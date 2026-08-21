import * as pdfjsLib from "pdfjs-dist";

import { detectTextWithGoogleVision } from "../ocr/visionClient";
import { extractText } from "../ocr/extractText";

// IMPORTANT:
// PDF must use the PDF-specific router.
// Do NOT use the normal image parserRouter here.
import { parsePDFReceipt } from "./pdfParserRouter";

import { parseBlinkitProductPages } from "../../parsers/blinkitParser";

import { classifyPDFPage } from "./pdfPageClassifier";

// ==========================================
// PDF.js Worker
// ==========================================

const PDF_WORKER_URL = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

pdfjsLib.GlobalWorkerOptions.workerSrc =
  PDF_WORKER_URL;

// ==========================================
// Normalize OCR text
// ==========================================

function normalizePageText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// ==========================================
// Score a PDF page
//
// Goal:
// Find the actual PRODUCT invoice page.
//
// We do NOT hardcode Myntra/Amazon/Flipkart.
// This is generic.
//
// Product invoice pages usually contain:
// - Tax Invoice
// - product/item description
// - Qty
// - Total
// - GST/HSN
//
// Service / transport / platform-fee pages
// should receive lower priority.
// ==========================================

function scoreInvoicePage(text) {
  if (!text) {
    return {
      score: 0,
      reasons: [],
    };
  }

  const normalized = text.toLowerCase();

  let score = 0;
  const reasons = [];

  // ------------------------------------------
  // Strong invoice indicators
  // ------------------------------------------

  if (/\btax invoice\b/i.test(text)) {
    score += 20;
    reasons.push("tax invoice");
  }

  if (/\btotal\b/i.test(text)) {
    score += 12;
    reasons.push("total");
  }

  if (/\bqty\b/i.test(text)) {
    score += 8;
    reasons.push("qty");
  }

  if (/\bhsn\b/i.test(text)) {
    score += 8;
    reasons.push("hsn");
  }

  if (/\bsac\b/i.test(text)) {
    score += 3;
    reasons.push("sac");
  }

  if (
    /\bdescription\b/i.test(text) ||
    /\bdescription of goods\b/i.test(text) ||
    /\bparticulars\b/i.test(text)
  ) {
    score += 7;
    reasons.push("description");
  }

  // ------------------------------------------
  // Product / goods indicators
  // ------------------------------------------

  if (/\bnature of supply:\s*goods\b/i.test(text)) {
    score += 15;
    reasons.push("goods supply");
  }

  if (/\bgoods\b/i.test(text)) {
    score += 4;
    reasons.push("goods");
  }

  if (/\bproduct\b/i.test(text)) {
    score += 4;
    reasons.push("product");
  }

  // ------------------------------------------
  // Monetary line indicators
  // ------------------------------------------

  const rupeeMatches =
    text.match(/(?:₹|Rs\.?)\s*[\d,]+(?:\.\d{1,2})?/gi) ||
    [];

  if (rupeeMatches.length >= 2) {
    score += 8;
    reasons.push("multiple amounts");
  }

  // ------------------------------------------
  // GST indicators
  // ------------------------------------------

  if (/\bigst\b/i.test(text)) {
    score += 4;
    reasons.push("igst");
  }

  if (/\bcgst\b/i.test(text)) {
    score += 4;
    reasons.push("cgst");
  }

  if (/\bsgst\b/i.test(text)) {
    score += 4;
    reasons.push("sgst");
  }

  // ------------------------------------------
  // Penalize obvious non-product documents
  // ------------------------------------------

  if (/\bplatform fee\b/i.test(text)) {
    score -= 25;
    reasons.push("platform fee");
  }

  if (/\bpayment handling charges\b/i.test(text)) {
    score -= 20;
    reasons.push("payment handling");
  }

  if (/\bgt charges\b/i.test(text)) {
    score -= 30;
    reasons.push("gt charges");
  }

  if (/\bservice\b/i.test(text)) {
    score -= 12;
    reasons.push("service");
  }

  if (/\bbill of supply\b/i.test(text)) {
    score -= 25;
    reasons.push("bill of supply");
  }

  if (/\bdetails of goods transported\b/i.test(text)) {
    score -= 20;
    reasons.push("transport document");
  }

  // ------------------------------------------
  // Penalize pages that are mostly legal/footer
  // ------------------------------------------

  if (
    normalized.includes("e.& o.e") &&
    !normalized.includes("tax invoice")
  ) {
    score -= 15;
    reasons.push("footer-only page");
  }

  return {
    score,
    reasons,
  };
}

// ==========================================
// Select best invoice page
//
// Generic page selection.
// No Myntra/Amazon/Flipkart hardcoding.
// ==========================================

function selectBestInvoicePage(pageResults) {
  if (!pageResults.length) {
    return null;
  }

  const scoredPages = pageResults.map((page) => {
    const result = scoreInvoicePage(page.text);

    return {
      ...page,
      score: result.score,
      reasons: result.reasons,
    };
  });

  scoredPages.sort((a, b) => {
    return b.score - a.score;
  });

  console.log(
    "================ PDF PAGE SCORING ================"
  );

  scoredPages.forEach((page) => {
    console.log(
      `Page ${page.pageNumber}: score=${page.score}`,
      page.reasons
    );
  });

  console.log(
    "=================================================="
  );

  return scoredPages[0];
}

// ==========================================
// PDF OCR Fallback
// ==========================================
// PDF → Page Image → Existing Google Vision
// → Existing OCR text extraction
// → Select actual invoice page
// → PDF-specific parser router
//
// Existing image OCR pipeline remains untouched.
// ==========================================

export const runPDFOCRFallback = async (file) => {
  if (!file) {
    throw new Error("PDF file is required.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported.");
  }

  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let combinedText = "";
  const rawResults = [];
  const pageResults = [];

  console.log(
    `PDF OCR Fallback: Processing ${pdf.numPages} page(s)`
  );

  // ==========================================
  // Process every PDF page
  // ==========================================

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    console.log(
      `PDF OCR Fallback: Rendering page ${pageNumber}/${pdf.numPages}`
    );

    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: 2,
    });

    // ==========================================
    // Temporary Canvas
    // ==========================================

    const canvas =
      document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Unable to create PDF rendering canvas."
      );
    }

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    // ==========================================
    // Render PDF page → Canvas
    // ==========================================

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    // ==========================================
    // Canvas → PNG Blob
    // ==========================================

    const blob = await new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                new Error(
                  `Failed to convert PDF page ${pageNumber} to image.`
                )
              );
            }
          },
          "image/png",
          1
        );
      }
    );

    // ==========================================
    // Blob → File
    // ==========================================

    const imageFile = new File(
      [blob],
      `pdf-page-${pageNumber}.png`,
      {
        type: "image/png",
      }
    );

    // ==========================================
    // Existing Google Vision OCR
    // ==========================================

    const visionResult =
      await detectTextWithGoogleVision(
        imageFile
      );

    const pageText = normalizePageText(
      extractText(visionResult)
    );

    console.log(
      `PDF OCR Fallback: Page ${pageNumber} text:`
    );

    console.log(pageText);

    // ==========================================
    // Keep page separately
    // ==========================================
const classification = classifyPDFPage(pageText);

console.log(
  `PDF Page ${pageNumber}:`,
  classification
);

pageResults.push({
  pageNumber,
  text: pageText,
  classification,
});

    // ==========================================
    // Keep combined text for debugging / raw
    // ==========================================

    if (pageText) {
      combinedText +=
        `\n\n===== PDF PAGE ${pageNumber} =====\n\n`;

      combinedText += `${pageText}\n`;
    }

    rawResults.push({
      pageNumber,
      response: visionResult.response,
      text: pageText,
    });

    // ==========================================
    // Release canvas memory
    // ==========================================

    canvas.width = 1;
    canvas.height = 1;
  }

  // ==========================================
  // Final Combined OCR Text
  // ==========================================

  const finalText =
    combinedText.trim();

  console.log(
    "================ PDF OCR COMBINED TEXT ================"
  );

  console.log(finalText);

  console.log(
    "========================================================"
  );

  // ==========================================
  // Select actual invoice page
  // ==========================================

  const bestPage =
    selectBestInvoicePage(pageResults);

  if (!bestPage) {
    throw new Error(
      "Unable to find a readable invoice page in the PDF."
    );
  }

  // ==========================================
// MULTI-PAGE PRODUCT INVOICE DETECTION
// ==========================================

const productPages = pageResults.filter(
  (page) =>
    page.classification?.type ===
    "PRODUCT_INVOICE"
);

const chargePages = pageResults.filter(
  (page) =>
    page.classification?.type ===
    "CHARGE_INVOICE"
);

console.log(
  "================ PDF PAGE GROUPS ================"
);

console.log(
  "Product Pages:",
  productPages.map((page) => page.pageNumber)
);

console.log(
  "Charge Pages:",
  chargePages.map((page) => page.pageNumber)
);

console.log(
  "=================================================="
);


  console.log(
    "================ PDF SELECTED PAGE ================"
  );

  console.log(
    "Selected Page:",
    bestPage.pageNumber
  );

  console.log(
    "Score:",
    bestPage.score
  );

  console.log(
    "Reasons:",
    bestPage.reasons
  );

  console.log(
    "===================================================="
  );

// ==========================================
// MULTI-PAGE PRODUCT PARSING
// ==========================================

let parsed;

// ------------------------------------------
// If multiple PRODUCT_INVOICE pages exist,
// parse all of them.
//
// This is currently used for Blinkit.
// ------------------------------------------

if (productPages.length > 1) {
  console.log(
    "PDF: Multiple product pages detected."
  );

  const multiPageResult =
    parseBlinkitProductPages(productPages);

  parsed = {
  ...multiPageResult,

  storeName:
    multiPageResult.storeName || "Blinkit",

  products:
    Array.isArray(multiPageResult.products)
      ? multiPageResult.products
      : [],

  productName:
    multiPageResult.productName ||
    multiPageResult.products
      ?.map((product) => product.productName)
      .join(", ") ||
    "",

  purchaseDate:
    multiPageResult.purchaseDate || "",

  amount:
    multiPageResult.amount || "",

  paymentMethod:
    multiPageResult.paymentMethod || "",

  category:
    multiPageResult.category ||
    (
      multiPageResult.products?.length > 1
        ? "Multiple"
        : multiPageResult.products?.[0]?.category || "Others"
    ),

  confidence:
    multiPageResult.confidence || 0,
};
} else {
  // ------------------------------------------
  // Existing single-page flow
  // ------------------------------------------

  parsed =
    parsePDFReceipt(bestPage.text);
}

  console.log(
    "================ PDF OCR FALLBACK RESULT ================"
  );

  console.log(
    "Selected Page:",
    bestPage.pageNumber
  );

  console.log(
    "Parsed Result:",
    parsed
  );

  console.log(
    "Product:",
    parsed.productName
  );

  console.log(
    "Store:",
    parsed.storeName
  );

  console.log(
    "Date:",
    parsed.purchaseDate
  );

  console.log(
    "Amount:",
    parsed.amount
  );

  console.log(
    "Category:",
    parsed.category
  );

  console.log(
    "=========================================================="
  );

  // ==========================================
  // Return
  // ==========================================

  return {
    // Full OCR text is still available for debugging.
    text: finalText,

    // Keep every page's raw OCR result.
    raw: rawResults,

    // PDF metadata.
    pageCount: pdf.numPages,

    // Useful debugging information.
    selectedPage: bestPage.pageNumber,
    selectedPageScore: bestPage.score,

    // Parsed receipt data.
    ...parsed,
  };
};
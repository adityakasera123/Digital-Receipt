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

pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

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
// Detect Blinkit document
// ==========================================

function isBlinkitDocument(text) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const lower = text.toLowerCase();

  return (
    lower.includes("blinkit") ||
    lower.includes("blink commerce private limited") ||
    lower.includes("grofers india private limited")
  );
}

// ==========================================
// Extract purchase date fallback
//
// Multi-product Blinkit parser may return blank
// date depending on parser version.
//
// We safely recover it from OCR text.
// ==========================================

function extractPurchaseDateFallback(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  // ------------------------------------------
  // DD-MMM-YYYY
  // Example: 23-Apr-2024
  // ------------------------------------------

  const monthNames = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };

  const textDateMatch = text.match(
    /\binvoice\s+date\s*:?\s*(\d{1,2})[-/ ]([A-Za-z]{3,9})[-/ ](\d{4})\b/i
  );

  if (textDateMatch) {
    const day = textDateMatch[1].padStart(2, "0");
    const monthName = textDateMatch[2].toLowerCase();
    const year = textDateMatch[3];

    const month = monthNames[monthName];

    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  // ------------------------------------------
  // DD/MM/YYYY or DD-MM-YYYY
  // ------------------------------------------

  const numericMatch = text.match(
    /\binvoice\s+date\s*:?\s*(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/i
  );

  if (numericMatch) {
    const day = numericMatch[1].padStart(2, "0");
    const month = numericMatch[2].padStart(2, "0");
    const year = numericMatch[3];

    return `${year}-${month}-${day}`;
  }

  // ------------------------------------------
  // Last fallback:
  // Any DD/MM/YYYY or DD-MM-YYYY
  // ------------------------------------------

  const fallbackMatch = text.match(
    /\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/
  );

  if (fallbackMatch) {
    const day = fallbackMatch[1].padStart(2, "0");
    const month = fallbackMatch[2].padStart(2, "0");
    const year = fallbackMatch[3];

    return `${year}-${month}-${day}`;
  }

  return "";
}

// ==========================================
// Score a PDF page
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
    text.match(/(?:₹|Rs\.?)\s*[\d,]+(?:\.\d{1,2})?/gi) || [];

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
  // Footer-only page
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

  scoredPages.sort((a, b) => b.score - a.score);

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
// Normalize multi-product result
//
// Makes sure Upload.jsx receives a stable shape.
// ==========================================

function normalizeMultiProductResult(
  multiPageResult,
  productPages
) {
  const products = Array.isArray(
    multiPageResult?.products
  )
    ? multiPageResult.products
    : [];

  const productNames = products
    .map((product) => product?.productName)
    .filter(Boolean);

  // ------------------------------------------
  // Date fallback
  // ------------------------------------------

  let purchaseDate =
    multiPageResult?.purchaseDate || "";

  if (!purchaseDate && productPages.length > 0) {
    purchaseDate = extractPurchaseDateFallback(
      productPages
        .map((page) => page.text)
        .join("\n")
    );
  }

  // ------------------------------------------
  // Category
  // ------------------------------------------

  let category =
    multiPageResult?.category || "";

  if (!category) {
    if (products.length > 1) {
      category = "Multiple";
    } else if (products[0]?.category) {
      category = products[0].category;
    } else {
      category = "Others";
    }
  }

  // ------------------------------------------
  // Product Name
  //
  // IMPORTANT:
  // Keep productName as a readable summary.
  // Upload.jsx can use `products` for the list.
  // ------------------------------------------

  const productName =
    productNames.length > 0
      ? productNames.join(", ")
      : multiPageResult?.productName || "";

  return {
    ...multiPageResult,

    storeName:
      multiPageResult?.storeName || "Blinkit",

    products,

    productName,

    purchaseDate,

    amount:
      multiPageResult?.amount || "",

    paymentMethod:
      multiPageResult?.paymentMethod || "",

    category,

    confidence:
      typeof multiPageResult?.confidence === "number"
        ? multiPageResult.confidence
        : 0,
  };
}

// ==========================================
// PDF OCR Fallback
//
// PDF
//  ↓
// PDF.js
//  ↓
// Every page rendered
//  ↓
// Google Vision
//  ↓
// Page classification
//  ↓
// Blinkit multi-page parser when required
//  ↓
// Existing single-page parser otherwise
// ==========================================

export const runPDFOCRFallback = async (file) => {
  if (!file) {
    throw new Error("PDF file is required.");
  }

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported.");
  }

  // ==========================================
  // Load PDF
  // ==========================================

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
    // Classify page
    // ==========================================

    const classification =
      classifyPDFPage(pageText);

    console.log(
      `PDF Page ${pageNumber}:`,
      classification
    );

    // ==========================================
    // Keep page separately
    // ==========================================

    pageResults.push({
      pageNumber,
      text: pageText,
      classification,
    });

    // ==========================================
    // Combined text
    // ==========================================

    if (pageText) {
      combinedText +=
        `\n\n===== PDF PAGE ${pageNumber} =====\n\n`;

      combinedText += `${pageText}\n`;
    }

    // ==========================================
    // Raw OCR
    // ==========================================

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
  // Select best invoice page
  // ==========================================

  const bestPage =
    selectBestInvoicePage(pageResults);

  if (!bestPage) {
    throw new Error(
      "Unable to find a readable invoice page in the PDF."
    );
  }

  // ==========================================
  // GROUP PAGES
  // ==========================================

  const productPages =
    pageResults.filter(
      (page) =>
        page.classification?.type ===
        "PRODUCT_INVOICE"
    );

  const chargePages =
    pageResults.filter(
      (page) =>
        page.classification?.type ===
        "CHARGE_INVOICE"
    );

  console.log(
    "================ PDF PAGE GROUPS ================"
  );

  console.log(
    "Product Pages:",
    productPages.map(
      (page) => page.pageNumber
    )
  );

  console.log(
    "Charge Pages:",
    chargePages.map(
      (page) => page.pageNumber
    )
  );

  console.log(
    "=================================================="
  );

  // ==========================================
  // Selected Page Debug
  // ==========================================

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
  // MULTI-PAGE PARSING
  // ==========================================

  let parsed;

  const blinkitDocument =
    isBlinkitDocument(finalText);

  // ==========================================
  // IMPORTANT:
  //
  // Only use Blinkit multi-product parser
  // when the PDF is actually Blinkit.
  //
  // This protects existing Amazon /
  // Flipkart / Myntra / other parsers.
  // ==========================================

  if (
    blinkitDocument &&
    productPages.length > 1
  ) {
    console.log(
      "=================================================="
    );

    console.log(
      "PDF: Blinkit multi-product document detected."
    );

    console.log(
      "Blinkit Product Pages:",
      productPages.map(
        (page) => page.pageNumber
      )
    );

    console.log(
      "Blinkit Charge Pages:",
      chargePages.map(
        (page) => page.pageNumber
      )
    );

    console.log(
      "=================================================="
    );

    // ==========================================
    // IMPORTANT:
    //
    // parseBlinkitProductPages expects the
    // page objects containing:
    //
    // {
    //   pageNumber,
    //   text,
    //   classification
    // }
    //
    // Do NOT pass only strings here.
    // ==========================================

    const multiPageResult =
      parseBlinkitProductPages(
        productPages
      );

    console.log(
      "================ BLINKIT MULTI RESULT ================"
    );

    console.log(
      "Raw Multi Result:",
      multiPageResult
    );

    console.log(
      "Products:",
      multiPageResult?.products
    );

    console.log(
      "Product Count:",
      multiPageResult?.products?.length || 0
    );

    console.log(
      "======================================================="
    );

    parsed =
      normalizeMultiProductResult(
        multiPageResult,
        productPages
      );

    // ==========================================
    // SAFETY FALLBACK
    //
    // If the multi parser unexpectedly returns
    // zero products, DO NOT destroy the existing
    // single-page flow.
    // ==========================================

    if (
      !Array.isArray(parsed.products) ||
      parsed.products.length === 0
    ) {
      console.warn(
        "Blinkit multi-product parser returned no products."
      );

      console.warn(
        "Falling back to selected-page PDF parser."
      );

      parsed =
        parsePDFReceipt(
          bestPage.text
        );
    }
  } else {
    // ==========================================
    // EXISTING SINGLE-PAGE FLOW
    //
    // This remains unchanged for:
    //
    // - Single-page PDFs
    // - Non-Blinkit PDFs
    // - Other existing stores
    // ==========================================

    console.log(
      "PDF: Using existing single-page parser."
    );

    parsed =
      parsePDFReceipt(
        bestPage.text
      );
  }

  // ==========================================
  // Ensure safe result
  // ==========================================

  if (!parsed) {
    parsed = {
      storeName: "",
      productName: "",
      products: [],
      purchaseDate: "",
      amount: "",
      paymentMethod: "",
      category: "Others",
      confidence: 0,
    };
  }

  // ==========================================
  // Final result debug
  // ==========================================

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
    "Products:",
    parsed.products
  );

  console.log(
    "Product Count:",
    Array.isArray(parsed.products)
      ? parsed.products.length
      : 0
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
    "Payment:",
    parsed.paymentMethod
  );

  console.log(
    "=========================================================="
  );

  // ==========================================
  // Return
  // ==========================================

  return {
    // Full OCR text
    text: finalText,

    // Every page's raw OCR result
    raw: rawResults,

    // PDF metadata
    pageCount: pdf.numPages,

    // Debugging information
    selectedPage: bestPage.pageNumber,
    selectedPageScore: bestPage.score,

    // Page groups
    productPages: productPages.map(
      (page) => page.pageNumber
    ),

    chargePages: chargePages.map(
      (page) => page.pageNumber
    ),

    // Parsed receipt data
    ...parsed,
  };
};
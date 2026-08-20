import * as pdfjsLib from "pdfjs-dist";

import { detectTextWithGoogleVision } from "../ocr/visionClient";
import { extractText } from "../ocr/extractText";

// IMPORTANT:
// PDF must use the PDF-specific router.
// Do NOT use the normal image parserRouter here.
import { parsePDFReceipt } from "./pdfParserRouter";

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
// PDF OCR Fallback
// ==========================================
// PDF → Page Image → Existing Google Vision
// → Existing OCR text extraction
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

    const pageText =
      extractText(visionResult);

    console.log(
      `PDF OCR Fallback: Page ${pageNumber} text:`
    );

    console.log(pageText);

    if (pageText) {
      combinedText += `${pageText}\n`;
    }

    rawResults.push({
      pageNumber,
      response: visionResult.response,
      text: pageText,
    });

    // Release canvas memory
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
  // IMPORTANT:
  // Use PDF-specific parser router here.
  //
  // This prevents a Myntra PDF containing
  // Flipkart transport/service text from being
  // incorrectly routed to Flipkart parser.
  // ==========================================

  const parsed =
    parsePDFReceipt(finalText);

  console.log(
    "================ PDF OCR FALLBACK RESULT ================"
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

  return {
    text: finalText,
    raw: rawResults,
    pageCount: pdf.numPages,
    ...parsed,
  };
};
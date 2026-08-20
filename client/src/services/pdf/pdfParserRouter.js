
import { parseAmazonReceipt } from "../../parsers/amazonParser";

import {
  detectFlipkart,
  parseFlipkartReceipt,
} from "../../parsers/flipkartParser";

import { parseGenericReceipt } from "../../parsers/genericParser";

import {
  isMyntraInvoice,
  parseMyntraInvoice,
} from "../../parsers/myntraParser";

// ==========================================
// PDF Parser Router
// ==========================================
// IMPORTANT:
//
// This router is ONLY for PDF processing.
//
// Existing image OCR parserRouter.js is NOT
// modified.
//
// We reuse the same existing parsers, but use
// stronger PDF-specific document detection.
// ==========================================

export function parsePDFReceipt(text) {
  if (!text) {
    return emptyResult();
  }

  const lower = text.toLowerCase();

  // ==========================================
  // 1. MYNTRA
  // ==========================================
  // Myntra PDFs can contain Flipkart transport
  // documents inside the same PDF.
  //
  // Therefore Myntra gets priority when strong
  // Myntra invoice markers are present.
  // ==========================================

  const myntraStrongMatch =
    isMyntraInvoice(text) ||
    (
      lower.includes("myntra designs pvt ltd") &&
      (
        lower.includes("myntra.com") ||
        lower.includes("myntra designs private limited")
      )
    ) ||
    (
      lower.includes("nivea") &&
      lower.includes("myntra") &&
      lower.includes("tax invoice")
    );

  if (myntraStrongMatch) {
    console.log("PDF Router: Using Myntra parser");

    return parseMyntraInvoice(text);
  }

  // ==========================================
  // 2. AMAZON
  // ==========================================

  const amazonMatch =
    lower.includes("amazon.in") ||
    lower.includes("amazon seller services") ||
    lower.includes("amazon");

  if (amazonMatch) {
    console.log("PDF Router: Using Amazon parser");

    return parseAmazonReceipt(text);
  }

  // ==========================================
  // 3. FLIPKART
  // ==========================================

  const flipkart = detectFlipkart(text);

  const flipkartStrongMatch =
    flipkart.matched ||
    (
      lower.includes("flipkart india private limited") &&
      (
        lower.includes("invoice number") ||
        lower.includes("grand total") ||
        lower.includes("order id")
      )
    ) ||
    (
      lower.includes("flipkart") &&
      lower.includes("order date") &&
      lower.includes("invoice date")
    );

  if (flipkartStrongMatch) {
    console.log("PDF Router: Using Flipkart parser");

    return parseFlipkartReceipt(text);
  }

  // ==========================================
  // 4. GENERIC FALLBACK
  // ==========================================

  console.log("PDF Router: Using Generic parser");

  return parseGenericReceipt(text);
}

// ==========================================
// Empty Result
// ==========================================

function emptyResult() {
  return {
    storeName: "",
    productName: "",
    purchaseDate: "",
    amount: 0,
    paymentMethod: "",
    category: "",
    confidence: 0,
  };
}
// src/utils/ocrParser.js

/**
 * Billvora OCR Parser
 * Converts OCR text into structured receipt fields.
 * Placeholder for 7.0.1 (real parsing in 7.0.3).
 */

export function parseReceiptText(rawText = "") {
  return {
    storeName: "",
    productName: "",
    purchaseDate: "",
    amount: "",
    currency: "INR",
    confidence: 0,
    rawText,
  };
}
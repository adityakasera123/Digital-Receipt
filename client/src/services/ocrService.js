// src/services/ocrService.js

import { OCR_PROCESSING_DURATION } from "../constants/ocrConstants";

/**
 * Fake OCR service for Billvora 7.0.1
 * Simulates OCR processing before real OCR.Space integration.
 */
export async function extractReceiptData(imageFile) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful OCR response
      resolve({
        storeName: "Amazon India",
        productName: "Wireless Earbuds",
        purchaseDate: "2026-08-14",
        amount: "2499",
        currency: "INR",
        confidence: 0.91,
      });

      // Uncomment this later to test failure flow
      // reject(new Error("Unable to extract receipt details"));
    }, OCR_PROCESSING_DURATION);
  });
}
// src/parsers/parserRouter.js

import { parseAmazonReceipt } from "./amazonParser";
import {
  detectFlipkart,
  parseFlipkartReceipt,
} from "./flipkartParser";
import {
  isMyntraInvoice,
  parseMyntraInvoice,
} from "./myntraParser";
import { parseGenericReceipt } from "./genericParser";

export function parseReceipt(text) {
  if (!text) return emptyResult();

  const lower = text.toLowerCase();

  // ==================================================
  // 1. Myntra
  // ==================================================

  if (isMyntraInvoice(text)) {
    console.log("Using Myntra parser");
    return parseMyntraInvoice(text);
  }

  // ==================================================
  // 2. Flipkart
  // ==================================================

  const flipkart = detectFlipkart(text);

  if (
    flipkart.matched ||
    lower.includes("flipkart") ||
    lower.includes("flipkart india private limited") ||
    lower.includes("ordered through")
  ) {
    console.log("Using Flipkart parser");
    return parseFlipkartReceipt(text);
  }

  // ==================================================
  // 3. Amazon
  // ==================================================

  if (
    lower.includes("amazon.in") ||
    lower.includes("amazon seller services") ||
    lower.includes("amazon")
  ) {
    console.log("Using Amazon parser");
    return parseAmazonReceipt(text);
  }

  // ==================================================
  // 4. Generic Parser Fallback
  // ==================================================

  console.log("Using Generic parser");
  return parseGenericReceipt(text);
}

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
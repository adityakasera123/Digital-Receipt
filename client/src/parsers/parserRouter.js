// src/parsers/parserRouter.js

import { parseAmazonReceipt } from "./amazonParser";

export function parseReceipt(text) {
  if (!text) {
    return emptyResult();
  }

  const lower = text.toLowerCase();

  // -----------------------------
  // Amazon Detection
  // -----------------------------
  if (
    lower.includes("amazon.in") ||
    lower.includes("tax invoice") ||
    lower.includes("order number")
  ) {
    return parseAmazonReceipt(text);
  }

  // -----------------------------
  // Zomato Detection
  // -----------------------------
  if (
    lower.includes("zomato") ||
    lower.includes("grand total") && lower.includes("delivery")
  ) {
    return {
      ...emptyResult(),
      storeName: "Zomato",
    };
  }

  // -----------------------------
  // Flipkart Detection
  // -----------------------------
  if (
    lower.includes("flipkart") ||
    lower.includes("order id")
  ) {
    return {
      ...emptyResult(),
      storeName: "Flipkart",
    };
  }

  // -----------------------------
  // Myntra Detection
  // -----------------------------
  if (
    lower.includes("myntra") ||
    lower.includes("invoice") && lower.includes("myntra")
  ) {
    return {
      ...emptyResult(),
      storeName: "Myntra",
    };
  }

  // -----------------------------
  // Generic Fallback
  // -----------------------------
  return {
    ...emptyResult(),
    storeName: "Unknown",
  };
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
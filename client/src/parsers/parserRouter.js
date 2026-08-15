import { parseAmazonReceipt } from "./amazonParser";
import { detectFlipkart, parseFlipkartReceipt } from "./flipkartParser";

export function parseReceipt(text) {
  if (!text) return emptyResult();

  const lower = text.toLowerCase();

  // 1. Flipkart first
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

  // 2. Amazon
  if (
    lower.includes("amazon.in") ||
    lower.includes("amazon seller services") ||
    lower.includes("amazon")
  ) {
    console.log("Using Amazon parser");
    return parseAmazonReceipt(text);
  }

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
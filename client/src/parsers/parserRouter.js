import { parseAmazonReceipt } from "./amazonParser";
import {
  detectFlipkart,
  parseFlipkartReceipt,
} from "./flipkartParser";
import { parseGenericReceipt } from "./genericParser";
import {
  isMyntraInvoice,
  parseMyntraInvoice,
} from "./myntraParser";

export function parseReceipt(text) {
  if (!text) {
    return emptyResult();
  }

  const lower = text.toLowerCase();

  // ==================================================
  // 1. FLIPKART
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
  // 2. AMAZON
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
  // 3. MYNTRA
  // ==================================================
  if (isMyntraInvoice(text)) {
    console.log("Using Myntra parser");
    return parseMyntraInvoice(text);
  }

  // ==================================================
  // 4. GENERIC FALLBACK
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
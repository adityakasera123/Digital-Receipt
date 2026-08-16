import { normalizeOCRDate } from "../utils/dateUtils";

/**
 * Myntra OCR Parser
 *
 * Extracts structured purchase data from Myntra invoices.
 *
 * IMPORTANT:
 * This parser is isolated from Amazon and Flipkart parsers.
 */

/**
 * Normalize OCR text without destroying line breaks.
 */
function normalizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Detect whether OCR text belongs to a Myntra invoice.
 */
export function isMyntraInvoice(text) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const normalizedText = text.toLowerCase();

  const myntraKeywords = [
    "myntra",
    "myntra designs",
    "myntra jabong",
    "myntra.com",
  ];

  return myntraKeywords.some((keyword) =>
    normalizedText.includes(keyword)
  );
}

/**
 * Extract product name from Myntra invoice.
 */
function extractProductName(lines) {
  const productIndex = lines.findIndex((line) => {
    return (
      line.includes(" - ") &&
      !line.toLowerCase().includes("total") &&
      !line.toLowerCase().includes("invoice")
    );
  });

  if (productIndex === -1) {
    return "";
  }

  const firstLine = lines[productIndex];

  // Remove product/SKU code before the hyphen.
  const parts = firstLine.split(" - ");

  let productName =
    parts.length > 1 ? parts.slice(1).join(" - ") : firstLine;

  // Myntra OCR may split product names across multiple lines.
  const nextLine = lines[productIndex + 1];

  if (
    nextLine &&
    !nextLine.toLowerCase().startsWith("hsn:") &&
    !nextLine.toLowerCase().startsWith("qty") &&
    !nextLine.toLowerCase().startsWith("total")
  ) {
    productName += ` ${nextLine}`;
  }

  // Remove size information from the final product name.
  productName = productName
    .replace(/,\s*size:\s*[^,]+$/i, "")
    .trim();

  return productName;
}

/**
 * Extract purchase date.
 *
 * Prefer Order Date over Invoice Date when both are available.
 */
function extractPurchaseDate(text) {
  const orderDateMatch = text.match(
    /Order Date:\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i
  );

  if (orderDateMatch) {
    return orderDateMatch[1];
  }

  const invoiceDateMatch = text.match(
    /Invoice Date:\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i
  );

  return invoiceDateMatch ? invoiceDateMatch[1] : "";
}

/**
 * Extract final total amount from Myntra invoice.
 *
 * Example:
 *
 * TOTAL Rs 1299.00 Rs 1090.00 Rs 0.00
 * Rs 199.05 Rs 9.95 Rs 209.00
 *
 * Final amount = 209.00
 */
function extractAmount(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const normalizedText = text.replace(/\r/g, " ");

  // Find the TOTAL section.
  const totalIndex = normalizedText.search(/\bTOTAL\b/i);

  if (totalIndex === -1) {
    return "";
  }

  const totalSection = normalizedText.slice(totalIndex);

  // Extract all Rs amounts after TOTAL.
  const amounts = [
    ...totalSection.matchAll(
      /Rs\.?\s*([\d,]+(?:\.\d{1,2})?)/gi
    ),
  ].map((match) => match[1]);

  if (amounts.length === 0) {
    return "";
  }

  // The final amount in the TOTAL row is the actual Total Amount.
  const finalAmount = amounts[amounts.length - 1];

  return finalAmount.replace(/,/g, "");
}

/**
 * Detect category from Myntra product name.
 *
 * IMPORTANT:
 * This logic is Myntra-specific.
 * Amazon and Flipkart parsers are not affected.
 *
 * Current ReceiptForm categories:
 * Electronics
 * Fashion
 * Food
 * Travel
 * Home
 * Others
 */
function detectMyntraCategory(productName) {
  if (!productName) {
    return "Others";
  }

  const product = productName.toLowerCase();

  // -----------------------------------------
  // Fashion
  // -----------------------------------------
  const fashionKeywords = [
    "shirt",
    "t-shirt",
    "tshirt",
    "top",
    "kurta",
    "kurti",
    "jeans",
    "trouser",
    "pants",
    "pant",
    "shorts",
    "jacket",
    "coat",
    "blazer",
    "sweater",
    "hoodie",
    "sweatshirt",
    "dress",
    "skirt",
    "saree",
    "lehenga",
    "dupatta",
    "salwar",
    "track pant",
    "trackpants",
    "clothing",
    "apparel",
  ];

  if (
    fashionKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Fashion";
  }

  // -----------------------------------------
  // Electronics
  // -----------------------------------------
  const electronicsKeywords = [
    "headphone",
    "headphones",
    "earphone",
    "earphones",
    "earbuds",
    "smartwatch",
    "watch",
    "speaker",
    "charger",
    "power bank",
    "mobile",
    "phone",
    "laptop",
    "tablet",
    "camera",
  ];

  if (
    electronicsKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Electronics";
  }

  // -----------------------------------------
  // Home
  // -----------------------------------------
  const homeKeywords = [
    "bedsheet",
    "bed sheet",
    "pillow",
    "curtain",
    "blanket",
    "towel",
    "cushion",
    "carpet",
    "mattress",
    "home decor",
    "decor",
  ];

  if (
    homeKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Home";
  }

  // -----------------------------------------
  // Food
  // -----------------------------------------
  const foodKeywords = [
    "chocolate",
    "snack",
    "coffee",
    "tea",
    "dry fruit",
    "dry fruits",
    "food",
  ];

  if (
    foodKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Food";
  }

  // -----------------------------------------
  // Beauty / Skincare / Personal Care
  // -----------------------------------------
  //
  // ReceiptForm currently does not have a
  // Beauty category.
  //
  // Therefore these products go to Others.
  //
  const beautyKeywords = [
    "cream",
    "creme",
    "moisturizer",
    "moisturiser",
    "face wash",
    "facewash",
    "serum",
    "sunscreen",
    "lotion",
    "cleanser",
    "shampoo",
    "conditioner",
    "soap",
    "body wash",
    "deodorant",
    "perfume",
    "fragrance",
    "lipstick",
    "makeup",
    "foundation",
    "concealer",
    "mascara",
    "kajal",
  ];

 if (
  beautyKeywords.some((keyword) =>
    product.includes(keyword)
  )
) {
  return "Skin Care";
}
  // -----------------------------------------
  // Unknown product
  // -----------------------------------------
  return "Others";
}

/**
 * Extract payment method.
 *
 * Some Myntra invoices may not contain payment information.
 * In that case, return an empty value instead of guessing.
 */
function extractPaymentMethod(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const normalizedText = text.toLowerCase();

  if (normalizedText.includes("upi")) {
    return "UPI";
  }

  if (normalizedText.includes("credit card")) {
    return "Credit Card";
  }

  if (normalizedText.includes("debit card")) {
    return "Debit Card";
  }

  if (normalizedText.includes("cash on delivery")) {
    return "Cash on Delivery";
  }

  if (normalizedText.includes("net banking")) {
    return "Net Banking";
  }

  if (normalizedText.includes("wallet")) {
    return "Wallet";
  }

  return "";
}

/**
 * Parse Myntra invoice OCR text.
 */
export function parseMyntraInvoice(text) {
  if (!text || typeof text !== "string") {
    return {
      storeName: "Myntra",
      productName: "",
      purchaseDate: "",
      amount: "",
      paymentMethod: "",
      category: "Others",
      confidence: 0,
    };
  }

  const normalizedText = normalizeText(text);

  const lines = normalizedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // -----------------------------------------
  // Extract fields
  // -----------------------------------------

  const productName = extractProductName(lines);

  const rawPurchaseDate = extractPurchaseDate(normalizedText);

  const purchaseDate = normalizeOCRDate(rawPurchaseDate);

  const amount = extractAmount(normalizedText);

  const paymentMethod = extractPaymentMethod(normalizedText);

  const category = detectMyntraCategory(productName);

  // -----------------------------------------
  // Debug logs
  // -----------------------------------------

  console.log("========== MYNTRA PARSER ==========");
  console.log("Product:", productName);
  console.log("Raw Date:", rawPurchaseDate);
  console.log("Date:", purchaseDate);
  console.log("Amount:", amount);
  console.log("Category:", category);
  console.log("Payment:", paymentMethod);
  console.log("===================================");

  // -----------------------------------------
  // Calculate confidence
  // -----------------------------------------

  let confidence = 0;

  if (isMyntraInvoice(normalizedText)) {
    confidence += 0.2;
  }

  if (productName) {
    confidence += 0.3;
  }

  if (purchaseDate) {
    confidence += 0.2;
  }

  if (amount) {
    confidence += 0.2;
  }

  if (paymentMethod) {
    confidence += 0.1;
  }

  return {
    storeName: "Myntra",
    productName,
    purchaseDate,
    amount,
    paymentMethod,
    category,
    confidence: Number(confidence.toFixed(2)),
  };
}
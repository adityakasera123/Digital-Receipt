import { normalizeOCRDate } from "../utils/dateUtils";

/**
 * Myntra OCR Parser
 *
 * IMPORTANT:
 * - Isolated from Amazon / Flipkart parsers
 * - Never guesses random invoice lines as product
 * - Designed for OCR + PDF extracted text
 */

// ==================================================
// TEXT NORMALIZATION
// ==================================================

function normalizeText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// ==================================================
// MYNTRA DETECTION
// ==================================================

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

// ==================================================
// INVALID PRODUCT LINES
//
// These are commonly picked by OCR accidentally.
// NEVER use these as product names.
// ==================================================

function isInvalidProductLine(line) {
  if (!line) {
    return true;
  }

  const value = line.trim();
  const lower = value.toLowerCase();

  if (value.length < 4) {
    return true;
  }

  const invalidKeywords = [
    "goods",
    "gross weight",
    "net weight",
    "weight of",
    "tax invoice",
    "invoice",
    "invoice no",
    "invoice number",
    "gstin",
    "gst",
    "hsn",
    "sac",
    "pan:",
    "quantity",
    "qty",
    "amount",
    "total",
    "subtotal",
    "grand total",
    "discount",
    "shipping",
    "delivery",
    "billing address",
    "shipping address",
    "ship to",
    "bill to",
    "sold by",
    "sold to",
    "order id",
    "order date",
    "invoice date",
    "payment",
    "signature",
    "authorized signatory",
    "terms",
    "conditions",
    "page ",
    "e. & o.e",
    "e.&o.e",
    "thank you",
    "customer care",
    "contact",
    "phone",
    "email",
    "www.",
    "http",
    "myntra designs",
    "myntra jabong",
    "myntra.com",
  ];

  if (
    invalidKeywords.some((keyword) =>
      lower.includes(keyword)
    )
  ) {
    return true;
  }

  // GSTIN
  if (/\b\d{2}[A-Z0-9]{10,15}\b/i.test(value)) {
    return true;
  }

  // Mostly numbers / punctuation
  const letters = value.replace(/[^A-Za-z]/g, "").length;

  if (letters < 3) {
    return true;
  }

  return false;
}

// ==================================================
// PRODUCT NAME CLEANING
// ==================================================

function cleanProductName(value) {
  if (!value) {
    return "";
  }

  let product = value
    .replace(/\s+/g, " ")
    .replace(/^[-:|]+/, "")
    .replace(/[-:|]+$/, "")
    .trim();

  // Remove common OCR noise
  product = product.replace(
    /^(product|description|item|goods)\s*[:\-]?\s*/i,
    ""
  );

  // Remove SKU / style prefix
  product = product.replace(
    /^(sku|style|article|product code)\s*[:#\-]?\s*[A-Z0-9_-]+\s*[-:]\s*/i,
    ""
  );

  // Remove Myntra-style SKU/article code
  // Example:
  // GIIZTSHT105052711 glitchez Regular Fit
  // -> glitchez Regular Fit
  product = product.replace(
    /^[A-Z]{2,}[A-Z0-9]{8,}\s+(?=[A-Za-z])/,
    ""
  );

  // Remove trailing size information
  product = product.replace(
    /,\s*size\s*[:\-]?\s*[^,]+$/i,
    ""
  );

  product = product.trim();

  if (isInvalidProductLine(product)) {
    return "";
  }

  return product;
}
// ==================================================
// PRODUCT EXTRACTION
// ==================================================

function extractProductName(lines, text) {
  // --------------------------------------------------
  // 1. Look for explicit product/description labels
  // --------------------------------------------------

  const labelIndexes = [];

  lines.forEach((line, index) => {
    const lower = line.toLowerCase();

    if (
      lower === "product" ||
      lower === "products" ||
      lower === "product name" ||
      lower === "description" ||
      lower === "item description" ||
      lower.includes("product details")
    ) {
      labelIndexes.push(index);
    }
  });

  // Search near explicit product labels
  for (const index of labelIndexes) {
    for (let offset = 1; offset <= 5; offset++) {
      const candidate = lines[index + offset];

      if (!candidate) {
        continue;
      }

      const cleaned = cleanProductName(candidate);

      if (cleaned) {
        return cleaned;
      }
    }
  }

  // --------------------------------------------------
  // 2. Look for common Myntra product patterns
  //
  // Example:
  // ABC123 - Nike Running Shoes
  // --------------------------------------------------

  for (const line of lines) {
    if (!line.includes(" - ")) {
      continue;
    }

    if (isInvalidProductLine(line)) {
      continue;
    }

    const parts = line.split(" - ");

    if (parts.length < 2) {
      continue;
    }

    const possibleProduct = parts
      .slice(1)
      .join(" - ")
      .trim();

    const cleaned = cleanProductName(possibleProduct);

    if (cleaned) {
      return cleaned;
    }
  }

  // --------------------------------------------------
  // 3. Look for product-like lines using useful words
  // --------------------------------------------------

  const productKeywords = [
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
    "shoe",
    "shoes",
    "sandal",
    "sandals",
    "slipper",
    "sneaker",
    "watch",
    "headphone",
    "headphones",
    "earphone",
    "earphones",
    "earbuds",
    "smartwatch",
    "speaker",
    "charger",
    "mobile",
    "phone",
    "laptop",
    "tablet",
    "camera",
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

  for (const line of lines) {
    if (isInvalidProductLine(line)) {
      continue;
    }

    const lower = line.toLowerCase();

    const hasProductKeyword = productKeywords.some((keyword) =>
      lower.includes(keyword)
    );

    if (hasProductKeyword) {
      const cleaned = cleanProductName(line);

      if (cleaned) {
        return cleaned;
      }
    }
  }

  // --------------------------------------------------
  // 4. Search the full OCR text for a product-looking
  //    line after "Goods" / "Description"
  // --------------------------------------------------

  const textLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = 0; i < textLines.length; i++) {
    const lower = textLines[i].toLowerCase();

    if (
      lower.includes("description") ||
      lower.includes("product details") ||
      lower === "product"
    ) {
      for (let j = i + 1; j < Math.min(i + 8, textLines.length); j++) {
        const candidate = cleanProductName(textLines[j]);

        if (candidate) {
          return candidate;
        }
      }
    }
  }

  // ==================================================
  // 5. No reliable product found
  //
  // IMPORTANT:
  // Never guess a random invoice line as product name.
  // Returning an empty value is safer than showing
  // GST/address/weight/tax information as a product.
  // ==================================================

  return "";
}

// ==================================================
// PURCHASE DATE
// ==================================================

function extractPurchaseDate(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const orderDateMatch = text.match(
    /Order Date\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i
  );

  if (orderDateMatch) {
    return orderDateMatch[1];
  }

  const invoiceDateMatch = text.match(
    /Invoice Date\s*[:\-]?\s*(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})/i
  );

  if (invoiceDateMatch) {
    return invoiceDateMatch[1];
  }

  // dd/mm/yyyy
  const slashDateMatch = text.match(
    /\b(\d{1,2}[\/-]\d{1,2}[\/-]\d{4})\b/
  );

  if (slashDateMatch) {
    return slashDateMatch[1];
  }

  return "";
}

// ==================================================
// AMOUNT
// ==================================================

function extractAmount(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const normalizedText = text.replace(/\r/g, " ");

  // --------------------------------------------------
  // Prefer TOTAL section
  // --------------------------------------------------

  const totalMatch = normalizedText.match(
    /\bTOTAL\b[\s\S]{0,250}/i
  );

  if (totalMatch) {
    const totalSection = totalMatch[0];

    const amounts = [
      ...totalSection.matchAll(
        /(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/gi
      ),
    ].map((match) => match[1]);

    if (amounts.length > 0) {
      return amounts[amounts.length - 1].replace(/,/g, "");
    }
  }

  // --------------------------------------------------
  // Grand Total
  // --------------------------------------------------

  const grandTotalMatch = normalizedText.match(
    /Grand\s+Total[\s:₹Rs.]*(\d[\d,]*(?:\.\d{1,2})?)/i
  );

  if (grandTotalMatch) {
    return grandTotalMatch[1].replace(/,/g, "");
  }

  // --------------------------------------------------
  // Amount Paid / Final Amount
  // --------------------------------------------------

  const paidMatch = normalizedText.match(
    /(?:Amount Paid|Total Amount|Net Amount)[\s:₹Rs.]*(\d[\d,]*(?:\.\d{1,2})?)/i
  );

  if (paidMatch) {
    return paidMatch[1].replace(/,/g, "");
  }

  return "";
}

// ==================================================
// CATEGORY
// ==================================================

function detectMyntraCategory(productName) {
  if (!productName) {
    return "Others";
  }

  const product = productName.toLowerCase();

  // --------------------------------------------------
  // Skin Care / Beauty
  // --------------------------------------------------

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
    "face",
    "skin",
    "acne",
    "pimple",
  ];

  if (
    beautyKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Skin Care";
  }

  // --------------------------------------------------
  // Fashion
  // --------------------------------------------------

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
    "shoe",
    "shoes",
    "sandal",
    "sandals",
    "slipper",
    "sneaker",
    "footwear",
  ];

  if (
    fashionKeywords.some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Fashion";
  }

  // --------------------------------------------------
  // Electronics
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Home
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Food
  // --------------------------------------------------

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

  return "Others";
}

// ==================================================
// PAYMENT METHOD
// ==================================================

function extractPaymentMethod(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  const normalizedText = text.toLowerCase();

  if (normalizedText.includes("cash on delivery")) {
    return "Cash on Delivery";
  }

  if (normalizedText.includes("credit card")) {
    return "Credit Card";
  }

  if (normalizedText.includes("debit card")) {
    return "Debit Card";
  }

  if (normalizedText.includes("net banking")) {
    return "Net Banking";
  }

  if (normalizedText.includes("upi")) {
    return "UPI";
  }

  if (normalizedText.includes("wallet")) {
    return "Wallet";
  }

  return "";
}

// ==================================================
// MAIN PARSER
// ==================================================

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

  // --------------------------------------------------
  // Extract
  // --------------------------------------------------

  const productName = extractProductName(
    lines,
    normalizedText
  );

  const rawPurchaseDate =
    extractPurchaseDate(normalizedText);

  const purchaseDate =
    normalizeOCRDate(rawPurchaseDate);

  const amount =
    extractAmount(normalizedText);

  const paymentMethod =
    extractPaymentMethod(normalizedText);

  const category =
    detectMyntraCategory(productName);

  // --------------------------------------------------
  // Confidence
  // --------------------------------------------------

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

  confidence = Number(
    confidence.toFixed(2)
  );

  // --------------------------------------------------
  // Debug
  // --------------------------------------------------

  console.log(
    "========== MYNTRA PARSER =========="
  );

  console.log(
    "Product:",
    productName
  );

  console.log(
    "Raw Date:",
    rawPurchaseDate
  );

  console.log(
    "Date:",
    purchaseDate
  );

  console.log(
    "Amount:",
    amount
  );

  console.log(
    "Category:",
    category
  );

  console.log(
    "Payment:",
    paymentMethod
  );

  console.log(
    "Confidence:",
    confidence
  );

  console.log(
    "==================================="
  );

  return {
    storeName: "Myntra",
    productName,
    purchaseDate,
    amount,
    paymentMethod,
    category,
    confidence,
  };
}
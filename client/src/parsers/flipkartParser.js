import { normalizeAmount, isReasonableAmount } from "../utils/amountUtils";
import { normalizeOCRDate } from "../utils/dateUtils";

// --------------------------------------------------
// Flipkart Detection
// --------------------------------------------------

const FLIPKART_KEYWORDS = [
  { keyword: "flipkart", score: 50 },
  { keyword: "order id", score: 20 },
  { keyword: "tax invoice", score: 15 },
  { keyword: "invoice no", score: 10 },
  { keyword: "gstin", score: 5 },
];

// --------------------------------------------------
// Payment Detection
// --------------------------------------------------

const PAYMENT_PATTERNS = [
  { regex: /\b(upi|gpay|google pay|phonepe|paytm)\b/i, value: "UPI" },
  { regex: /\b(credit card|visa|mastercard|rupay)\b/i, value: "Card" },
  { regex: /\b(debit card)\b/i, value: "Card" },
  { regex: /\b(net banking|internet banking)\b/i, value: "Net Banking" },
  { regex: /\b(cash)\b/i, value: "Cash" },
];

// --------------------------------------------------
// Detection
// --------------------------------------------------

export function detectFlipkart(rawText = "") {
  const text = rawText.toLowerCase();

  let score = 0;
  const matchedKeywords = [];

  for (const item of FLIPKART_KEYWORDS) {
    if (text.includes(item.keyword)) {
      score += item.score;
      matchedKeywords.push(item.keyword);
    }
  }

  return {
    matched: score >= 40,
    score: Math.min(score, 100),
    matchedKeywords,
  };
}
// --------------------------------------------------
// Product Extraction
// --------------------------------------------------

function extractProduct(lines) {
  const cleaned = lines.map((l) => l.trim()).filter(Boolean);

  // -------- Flipkart GTA / Transport Invoice --------
  let goodsIndex = cleaned.findIndex((line) => /description of goods/i.test(line));

  // OCR often splits "Description of Goods" into two lines
  if (goodsIndex === -1) {
    for (let i = 0; i < cleaned.length - 1; i++) {
      if (
        /description of/i.test(cleaned[i]) &&
        /^goods$/i.test(cleaned[i + 1])
      ) {
        goodsIndex = i + 1;
        break;
      }
    }
  }

  if (goodsIndex !== -1) {
    const productLines = [];

    for (let i = goodsIndex + 1; i < cleaned.length; i++) {
  const line = cleaned[i];

  // Stop when footer starts
  if (
    /consignor details|consignee details|place of origin|destination|registration no/i.test(line)
  ) {
    break;
  }

  // Skip table headers
  if (
    /^(goods|qty|gross weight of|value of goods|consignment)$/i.test(line)
  ) {
    continue;
  }

  // Skip numbers and weights
  if (/^[0-9.,₹ ]+$/.test(line)) continue;
  if (/grams?/i.test(line)) continue;

  productLines.push(line);
}

   if (productLines.length) {
  return productLines
    .join(" ")
    .replace(/\(1\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
  }

  // -------- Existing Flipkart PDF / Thermal logic continues below --------
  // (baaki tumhara existing code same rahega)


  // -------- Old Flipkart Thermal Receipt --------
  for (let i = 0; i < cleaned.length; i++) {
    if (/^product$/i.test(cleaned[i])) {
      let product = "";

      for (let j = i + 1; j < Math.min(i + 6, cleaned.length); j++) {
        const current = cleaned[j];

        if (/qty|price|igst|cgst|sgst|total|discount/i.test(current)) break;
        if (/hsn/i.test(current)) break;

        if (current.length > 3) {
          product += (product ? " " : "") + current;
        }
      }

      if (product) {
        return product
          .replace(/\|/g, " ")
          .replace(/IMEI\/SrNo:.*/i, "")
          .replace(/TRK_[A-Z0-9_]+/i, "")
          .replace(/\s{2,}/g, " ")
          .trim();
      }
    }
  }

  return "";
}
// --------------------------------------------------
// Date Extraction
// --------------------------------------------------

function extractDate(text) {
  const normalized = text.replace(/\s+/g, " ");

  const patterns = [
  /invoice\s*date\s*[:\-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
  /order\s*date\s*[:\-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
  /dt\s*[:\-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
  /invoice\s*no.*?dt\s*[:\-]?\s*(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/i,
  /(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{4})/,
];

  for (const regex of patterns) {
    const match = normalized.match(regex);
    if (match) {
      return normalizeOCRDate(match[1]);
    }
  }

  return "";
}

// --------------------------------------------------
// Amount Extraction
// --------------------------------------------------
// --------------------------------------------------
// Amount Extraction
// --------------------------------------------------
function extractAmount(text) {
  const normalized = text.replace(/\s+/g, " ");

  // 1. Flipkart GTA / Transport Invoice
  // Take the last reasonable amount before "Consignor details"
  const beforeConsignor = normalized.split(/consignor details/i)[0];
  const gtaNumbers = [...beforeConsignor.matchAll(/([0-9]+(?:\.[0-9]{1,2})?)/g)]
    .map((m) => normalizeAmount(m[1]))
    .filter((v) => v >= 10 && v <= 100000);

  if (gtaNumbers.length) {
    // Example: 86, 72.88, 13.12, 786, 356 -> return 356
    return gtaNumbers[gtaNumbers.length - 1];
  }

  // 2. Normal Flipkart PDF Invoice (TOTAL PRICE)
  let match = normalized.match(
    /total\s*price\s*[:\-]?\s*₹?\s*([0-9]+(?:\.[0-9]{1,2})?)/i
  );
  if (match) {
    return normalizeAmount(match[1]);
  }

  // 3. Generic Invoice Total
  match = normalized.match(
    /total\s*amount\s*[:\-]?\s*₹?\s*([0-9]+(?:\.[0-9]{1,2})?)/i
  );
  if (match) {
    return normalizeAmount(match[1]);
  }

  // 4. Fallback: choose the largest reasonable amount
  const values = [];

  for (const m of normalized.matchAll(/([0-9]+(?:\.[0-9]{1,2})?)/g)) {
    const value = normalizeAmount(m[1]);
    if (value >= 10 && value <= 100000) {
      values.push(value);
    }
  }

  if (!values.length) return null;

  return Math.max(...values);
}
// --------------------------------------------------
// Payment Extraction
// --------------------------------------------------

function extractPaymentMethod(text) {
  for (const item of PAYMENT_PATTERNS) {
    if (item.regex.test(text)) {
      return item.value;
    }
  }

  return "";
}

// --------------------------------------------------
// Category Detection
// --------------------------------------------------

function detectCategory(productName = "") {
  const text = productName.toLowerCase();

  if (
    /(google|pixel|iphone|samsung|redmi|realme|vivo|oppo|handset|headset|phone|mobile|airpods|watch|laptop|tablet|earbuds)/i.test(
      text
    )
  ) {
    return "Electronics";
  }

 if (
  /(track pant|trackpants|pants|shirt|t-shirt|kurta|saree|jeans|shoe|shoes|dress|hoodie|jacket|cotton|diwazzo)/i.test(
    text
  )
) {
  return "Fashion";
}

  return "Shopping";
}

// --------------------------------------------------
// Main Parser
// --------------------------------------------------

export function parseFlipkartReceipt(rawText = "") {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

 // ===== DEBUG =====
  console.log("========== OCR LINES ==========");
  lines.forEach((line, index) => {
    console.log(index, line);
  });
  console.log("===============================");

  const productName = extractProduct(lines);
  const purchaseDate = extractDate(rawText);
  const amount = extractAmount(rawText);
  const paymentMethod = extractPaymentMethod(rawText);
  const category = detectCategory(productName);

  console.log("PRODUCT:", productName);
  

  console.log("================ FLIPKART PARSER ================");
  console.log("PRODUCT:", productName);
  console.log("DATE:", purchaseDate);
  console.log("AMOUNT:", amount);
  console.log("CATEGORY:", category);
  console.log("===============================================");

  return {
    storeName: "Flipkart",
    productName,
    purchaseDate,
    amount,
    paymentMethod,
    category,
    confidence: {
      storeName: 0.99,
      productName: productName ? 0.96 : 0.4,
      purchaseDate: purchaseDate ? 0.98 : 0.3,
      amount: amount ? 0.99 : 0.3,
      paymentMethod: paymentMethod ? 0.9 : 0.4,
    },
    rawText,
  };
}

export default parseFlipkartReceipt;
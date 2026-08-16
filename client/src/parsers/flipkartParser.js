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
  {
    regex: /\b(upi|gpay|google pay|phonepe|paytm)\b/i,
    value: "UPI",
  },
  {
    regex: /\b(credit card|visa|mastercard|rupay)\b/i,
    value: "Card",
  },
  {
    regex: /\b(debit card)\b/i,
    value: "Card",
  },
  {
    regex: /\b(net banking|internet banking)\b/i,
    value: "Net Banking",
  },
  {
    regex: /\b(cash)\b/i,
    value: "Cash",
  },
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
// Product Name Cleanup
// --------------------------------------------------

function cleanProductName(product) {
  if (!product) {
    return "";
  }

  let cleaned = product
    .replace(/\|/g, " ")
    .replace(/TrackPants/gi, "Track Pants")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Remove FSN / SKU / IMEI information
  cleaned = cleaned.replace(
    /\s+(FSN|SKU|IMEI|SrNo)\s*:?.*$/i,
    ""
  );

  // Remove trailing discount values like:
  // asian Nexon-13 Black -40.00
  cleaned = cleaned.replace(
    /\s+-\s*\d+(?:,\d{3})*(?:\.\d{1,2})?\s*$/i,
    ""
  );

  // Remove accidental OCR table headers
  cleaned = cleaned
    .replace(
      /^(product\s+)?title\s+/i,
      ""
    )
    .replace(
      /^gross\s+amount\s+/i,
      ""
    )
    .replace(
      /^taxable\s+value\s+/i,
      ""
    )
    .replace(
      /^amount\s+/i,
      ""
    )
    .replace(
      /^discount\s+/i,
      ""
    )
    .replace(
      /^igst\s+/i,
      ""
    )
    .replace(
      /^total\s+/i,
      ""
    )
    .replace(
      /^qty\s+/i,
      ""
    )
    .trim();

  return cleaned.trim();
}

// --------------------------------------------------
// Product Extraction
// --------------------------------------------------

function extractProduct(lines) {
  const cleaned = lines.map((l) => l.trim()).filter(Boolean);

  // --------------------------------------------------
  // Flipkart GTA / Transport Invoice
  // --------------------------------------------------

  let goodsIndex = cleaned.findIndex((line) =>
    /description of goods/i.test(line)
  );

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

      if (
        /consignor details|consignee details|place of origin|destination|registration no/i.test(
          line
        )
      ) {
        break;
      }

      // Skip GTA table headers
      if (
        /^(goods|qty|gross weight of|value of goods|consignment)$/i.test(
          line
        )
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

  // --------------------------------------------------
  // Normal Flipkart PDF Invoice
  // --------------------------------------------------

  const productIndex = cleaned.findIndex((line) =>
    /^product$/i.test(line)
  );

  if (productIndex !== -1) {
    let i = productIndex + 1;

    // --------------------------------------------------
    // Handle combined OCR header
    //
    // Example:
    // Product
    // Title Qty Gross Amount Discount Taxable Value IGST Total
    //
    // OR:
    // Product Title Qty Gross Amount Discount Taxable Value...
    // --------------------------------------------------

    let hasCombinedHeader = false;

    if (
      i < cleaned.length &&
      /title/i.test(cleaned[i]) &&
      /qty/i.test(cleaned[i])
    ) {
      hasCombinedHeader = true;
      i++;
    }

    // Skip normal column headers
    while (
      i < cleaned.length &&
      /^(description|title|qty|gross|gross amount|amount|discount|taxable|taxable value|value|igst|cgst|sgst|cess|total)$/i.test(
        cleaned[i]
      )
    ) {
      i++;
    }

    const productLines = [];

    // --------------------------------------------------
    // In this invoice format:
    //
    // Product column = Sports Shoes
    // Title column   = asian Nexon-13 Black...
    //
    // So when we detected the combined Product + Title
    // header, skip the first product-category cell.
    // --------------------------------------------------

    let skippedProductColumn = false;

    while (i < cleaned.length) {
      const line = cleaned[i];

      // Stop at product tax/identifier information.
      if (/^hsn\s*:/i.test(line)) break;
      if (/^fsn\s*:/i.test(line)) break;

      // Numeric-only lines are prices/quantities.
      if (/^[0-9.,₹ ]+$/.test(line)) {
        i++;
        continue;
      }

      if (
        /shipping and handling|total qty|total price|grand total|seller registered address|declaration|ordered through/i.test(
          line
        )
      ) {
        break;
      }

      // Skip SKU / IMEI lines
      if (/imei|srno|trk_/i.test(line)) {
        i++;
        continue;
      }

      // Skip table headers that OCR may have kept together
      if (
        /^(product|title|description|qty|gross amount|discount|taxable value|igst|cgst|sgst|cess|total)$/i.test(
          line
        )
      ) {
        i++;
        continue;
      }

      // --------------------------------------------------
      // New Flipkart format:
      // First text value belongs to Product column
      // (e.g. "Sports Shoes"), not the actual title.
      // --------------------------------------------------

      if (hasCombinedHeader && !skippedProductColumn) {
        skippedProductColumn = true;
        i++;
        continue;
      }

      productLines.push(line);
      i++;
    }

    if (productLines.length) {
  let product = cleanProductName(productLines.join(" "));

  // Flipkart invoice ka "Sports Shoes" Product column hai,
  // actual product title ka part nahi hai.
  product = product.replace(
    /^sports shoes\s+/i,
    ""
  );

  if (product) {
    return product;
  }
}
  }

  // --------------------------------------------------
  // NEW Flipkart Invoice Format
  //
  // Example:
  //
  // Product
  // Title
  // Qty
  // Gross Amount
  // ...
  // asian Nexon-13 Black
  // Sports,Walking,Training,
  // Gym,Stylish, Running
  // Shoes For Men
  //
  // OR OCR may keep:
  //
  // Product Title Qty Gross Amount Discount...
  // --------------------------------------------------

  const combinedProductHeaderIndex = cleaned.findIndex((line) =>
    /product\s+title/i.test(line)
  );

  if (combinedProductHeaderIndex !== -1) {
    const productLines = [];

    for (
      let i = combinedProductHeaderIndex + 1;
      i < cleaned.length;
      i++
    ) {
      const line = cleaned[i];

      // Stop at the product tax/identifier information.
      if (/^hsn[:/]/i.test(line)) {
        break;
      }

      if (
        /shipping and handling|total qty|total price|grand total|seller registered address|declaration|ordered through/i.test(
          line
        )
      ) {
        break;
      }

      // Skip pure numeric/table values.
      if (/^[0-9.,₹\- ]+$/.test(line)) {
        continue;
      }

      // Skip common column/header text if OCR repeats it.
      if (
        /^(product|title|description|qty|gross amount|discount|taxable value|igst|cgst|sgst|cess|total)$/i.test(
          line
        )
      ) {
        continue;
      }

      // Skip SKU/FSN/IMEI information.
      if (/^(fsn|sku|imei|srno|trk_)/i.test(line)) {
        continue;
      }

      productLines.push(line);
    }

    if (productLines.length) {
      const product = cleanProductName(productLines.join(" "));

      if (product) {
        return product;
      }
    }
  }

  // --------------------------------------------------
  // NEW FALLBACK
  //
  // Some OCR versions may separate:
  //
  // Product
  // Title
  // Qty
  //
  // instead of:
  // Product Title Qty
  // --------------------------------------------------

  const productTitleIndex = cleaned.findIndex(
    (line, index) =>
      /^product$/i.test(line) &&
      cleaned[index + 1] &&
      /^title$/i.test(cleaned[index + 1])
  );

  if (productTitleIndex !== -1) {
    const productLines = [];

    let i = productTitleIndex + 2;

    // Skip Qty/header rows before actual product.
    while (
      i < cleaned.length &&
      /^(qty|gross amount|discount|taxable value|igst|cgst|sgst|cess|total)$/i.test(
        cleaned[i]
      )
    ) {
      i++;
    }

    while (i < cleaned.length) {
      const line = cleaned[i];

      if (/^hsn[:/]/i.test(line)) break;
      if (/^fsn[:/]/i.test(line)) break;

      if (
        /shipping and handling|total qty|total price|grand total|seller registered address|declaration|ordered through/i.test(
          line
        )
      ) {
        break;
      }

      if (/^[0-9.,₹\- ]+$/.test(line)) {
        i++;
        continue;
      }

      if (
        /^(qty|gross amount|discount|taxable value|igst|cgst|sgst|cess|total)$/i.test(
          line
        )
      ) {
        i++;
        continue;
      }

      if (/^(fsn|sku|imei|srno|trk_)/i.test(line)) {
        i++;
        continue;
      }

      productLines.push(line);
      i++;
    }

    if (productLines.length) {
      const product = cleanProductName(productLines.join(" "));

      if (product) {
        return product;
      }
    }
  }

  // --------------------------------------------------
  // Old Flipkart Thermal Receipt
  // --------------------------------------------------

  for (let i = 0; i < cleaned.length; i++) {
    if (/^product$/i.test(cleaned[i])) {
      let product = "";

      for (
        let j = i + 1;
        j < Math.min(i + 6, cleaned.length);
        j++
      ) {
        const current = cleaned[j];

        if (
          /qty|price|igst|cgst|sgst|total|discount/i.test(current)
        ) {
          break;
        }

        if (/hsn/i.test(current)) {
          break;
        }

        if (current.length > 3) {
          product += (product ? " " : "") + current;
        }
      }

      if (product) {
        return cleanProductName(product)
          .replace(/IMEI\/SrNo:.*/i, "")
          .replace(/TRK_[A-Z0-9_]+/i, "")
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

function extractAmount(text) {
  const normalized = text.replace(/\s+/g, " ");

  // --------------------------------------------------
  // 1. Normal Flipkart PDF Invoice
  // TOTAL PRICE
  //
  // IMPORTANT:
  // This is checked BEFORE GTA fallback so that a
  // normal invoice does not accidentally return an
  // invoice/order number such as "20".
  // --------------------------------------------------

  let match = normalized.match(
    /total\s*price\s*[:\-]?\s*₹?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  );

  if (match) {
    const amount = normalizeAmount(match[1]);

    if (isReasonableAmount(amount)) {
      return amount;
    }
  }

  // --------------------------------------------------
  // 2. Grand Total
  // --------------------------------------------------

  match = normalized.match(
    /grand\s*total\s*[:\-]?\s*₹?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  );

  if (match) {
    const amount = normalizeAmount(match[1]);

    if (isReasonableAmount(amount)) {
      return amount;
    }
  }

  // --------------------------------------------------
  // 3. Generic Invoice Total
  // --------------------------------------------------

  match = normalized.match(
    /total\s*amount\s*[:\-]?\s*₹?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  );

  if (match) {
    const amount = normalizeAmount(match[1]);

    if (isReasonableAmount(amount)) {
      return amount;
    }
  }

  // --------------------------------------------------
  // 4. Flipkart GTA / Transport Invoice
  //
  // ONLY run this logic when the invoice actually
  // looks like a GTA / transport invoice.
  // --------------------------------------------------

  const isGTAInvoice =
    /details of goods transported by gta supplier/i.test(
      normalized
    ) ||
    (/description of goods/i.test(normalized) &&
      /consignor details/i.test(normalized) &&
      /value of goods/i.test(normalized));

  if (isGTAInvoice) {
    const beforeConsignor = normalized.split(
      /consignor details/i
    )[0];

    const gtaNumbers = [
      ...beforeConsignor.matchAll(
        /([0-9]+(?:\.[0-9]{1,2})?)/g
      ),
    ]
      .map((m) => normalizeAmount(m[1]))
      .filter(
        (v) =>
          isReasonableAmount(v) &&
          v >= 10 &&
          v <= 100000
      );

    if (gtaNumbers.length) {
      // Existing GTA behavior preserved:
      // return the last reasonable amount.
      return gtaNumbers[gtaNumbers.length - 1];
    }
  }

  // --------------------------------------------------
  // 5. Fallback: choose the largest reasonable amount
  // --------------------------------------------------

  const values = [];

  for (const m of normalized.matchAll(
    /([0-9]+(?:\.[0-9]{1,2})?)/g
  )) {
    const value = normalizeAmount(m[1]);

    if (
      isReasonableAmount(value) &&
      value >= 10 &&
      value <= 100000
    ) {
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

function detectCategory(productName = "", rawText = "") {
  const productText = productName.toLowerCase();
  const invoiceText = rawText.toLowerCase();

  // Electronics
  if (
    /(google|pixel|iphone|samsung|redmi|realme|vivo|oppo|handset|headset|phone|mobile|airpods|watch|laptop|tablet|earbuds)/i.test(
      productText
    )
  ) {
    return "Electronics";
  }

  // Fashion
  if (
    /(track pant|trackpants|pants|shirt|t-shirt|kurta|saree|jeans|shoe|shoes|dress|hoodie|jacket|cotton|diwazzo)/i.test(
      productText
    )
  ) {
    return "Fashion";
  }

  // Check complete invoice text
  if (
    /(sports shoes|running shoes|casual shoes|formal shoes|men shoes|women shoes)/i.test(
      invoiceText
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
 const category = detectCategory(productName, rawText);

  console.log("PRODUCT:", productName);

  console.log(
    "================ FLIPKART PARSER ================"
  );

  console.log("PRODUCT:", productName);
  console.log("DATE:", purchaseDate);
  console.log("AMOUNT:", amount);
  console.log("CATEGORY:", category);

  console.log(
    "==============================================="
  );

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
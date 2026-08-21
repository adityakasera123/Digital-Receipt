

// ==========================================
// BLINKIT PDF PARSER
// ==========================================

function normalizeText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// ==========================================
// BLINKIT DETECTION
// ==========================================

export function isBlinkitInvoice(text) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const lower = text.toLowerCase();

  return (
    lower.includes("blink commerce private limited") ||
    lower.includes("blinkit") ||
    (
      lower.includes("sold by / seller") &&
      lower.includes("gstin") &&
      lower.includes("invoice date")
    )
  );
}

// ==========================================
// PRODUCT EXTRACTION
// ==========================================

function extractProductName(text) {
  if (!text) {
    return "";
  }

  // Blinkit structured invoice pattern:
  //
  // Sr. no UPC Item Description MRP Discount Qty ...
  //
  // 1 8901 7640 3227 1 Sprite Lime Flavored Soft Drink
  // (PET Bottle) ... 40.00 2.00 1 ...

  const match = text.match(
    /Item\s+Description[\s\S]*?\b\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+(.+?)\s+\d+\.\d{2}\s+\d+\.\d{2}\s+\d+\s+\d+\.\d{2}/i
  );

  if (match) {
    const product = match[1]
      .replace(/\s+/g, " ")
      .trim();

    if (
      product &&
      !/^(mrp|discount|qty|taxable|cgst|sgst|cess|total)$/i.test(product)
    ) {
      return product;
    }
  }

  // ------------------------------------------
  // Fallback: find known product-like line
  // ------------------------------------------

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      /sprite|coke|pepsi|biscuit|chips|milk|bread|rice|atta|dal|juice|water|soap|shampoo|cream|toothpaste|detergent/i.test(
        line
      )
    ) {
      return line
        .replace(/^\d+\s+/, "")
        .trim();
    }
  }

  return "";
}
// ==========================================
// PURCHASE DATE
// ==========================================

function extractPurchaseDate(text) {
  if (!text) {
    return "";
  }

  const match = text.match(
    /invoice\s+date\s*[:\-]?\s*(\d{1,2})\s*-\s*([A-Za-z]{3,9})\s*-\s*(\d{4})/i
  );

  if (match) {
    const day = match[1].padStart(2, "0");
    const monthName = match[2].toLowerCase();
    const year = match[3];

    const months = {
      jan: "01",
      january: "01",
      feb: "02",
      february: "02",
      mar: "03",
      march: "03",
      apr: "04",
      april: "04",
      may: "05",
      jun: "06",
      june: "06",
      jul: "07",
      july: "07",
      aug: "08",
      august: "08",
      sep: "09",
      sept: "09",
      september: "09",
      oct: "10",
      october: "10",
      nov: "11",
      november: "11",
      dec: "12",
      december: "12",
    };

    const month = months[monthName];

    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  // Fallback: DD/MM/YYYY or DD-MM-YYYY

  const numericMatch = text.match(
    /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/
  );

  if (numericMatch) {
    const day = numericMatch[1].padStart(2, "0");
    const month = numericMatch[2].padStart(2, "0");
    const year = numericMatch[3];

    return `${year}-${month}-${day}`;
  }

  return "";
}

// ==========================================
// AMOUNT
// ==========================================

function extractAmount(text) {
  if (!text) {
    return "";
  }

  // ==========================================
  // 1. Amount in Words section
  //
  // Example:
  // Amount in Words:
  // Sixty - Five Rupees And Zero Paisa Only
  //
  // This tells us the final amount is 65,
  // but we don't directly convert words here.
  // ==========================================

  // ------------------------------------------
  // 2. Look for Total row
  //
  // Example:
  //
  // Total 1 9.29 9.29 65.00
  // ------------------------------------------

  const totalMatch = text.match(
    /\bTotal\b[\s\S]{0,150}?(\d[\d,]*\.\d{1,2})\s*$/im
  );

  if (totalMatch) {
    const amount = totalMatch[1].replace(/,/g, "");

    if (Number.isFinite(Number(amount))) {
      return amount;
    }
  }

  // ------------------------------------------
  // 3. Total followed by multiple values
  // Pick the final monetary value.
  // ------------------------------------------

  const totalIndex = text.search(/\bTotal\b/i);

  if (totalIndex !== -1) {
    const totalSection = text.slice(
      totalIndex,
      totalIndex + 300
    );

    const amounts = [
      ...totalSection.matchAll(
        /(?:₹|Rs\.?)?\s*(\d[\d,]*\.\d{1,2})/gi
      ),
    ]
      .map((match) => match[1].replace(/,/g, ""))
      .filter((value) => Number.isFinite(Number(value)));

    if (amounts.length > 0) {
      return amounts[amounts.length - 1];
    }
  }

  return "";
}

// ==========================================
// CATEGORY
// ==========================================

function detectBlinkitCategory(productName) {
  if (!productName) {
    return "Others";
  }

  const product = productName.toLowerCase();

  if (
    [
      "milk",
      "bread",
      "butter",
      "cheese",
      "curd",
      "paneer",
      "yogurt",
    ].some((keyword) => product.includes(keyword))
  ) {
    return "Groceries";
  }

  if (
    [
      "chips",
      "biscuit",
      "chocolate",
      "snack",
      "namkeen",
      "juice",
      "soft drink",
      "drink",
      "sprite",
      "coke",
      "pepsi",
    ].some((keyword) => product.includes(keyword))
  ) {
    return "Food";
  }

  if (
    [
      "soap",
      "shampoo",
      "toothpaste",
      "cream",
      "face wash",
      "lotion",
      "deodorant",
    ].some((keyword) => product.includes(keyword))
  ) {
    return "Personal Care";
  }

  if (
    [
      "detergent",
      "cleaner",
      "dishwash",
      "washing",
    ].some((keyword) => product.includes(keyword))
  ) {
    return "Household";
  }

  return "Others";
}

// ==========================================
// PAYMENT METHOD
// ==========================================

function extractPaymentMethod(text) {
  if (!text) {
    return "";
  }

  const lower = text.toLowerCase();

  if (lower.includes("cash on delivery")) {
    return "Cash on Delivery";
  }

  if (lower.includes("upi")) {
    return "UPI";
  }

  if (lower.includes("credit card")) {
    return "Credit Card";
  }

  if (lower.includes("debit card")) {
    return "Debit Card";
  }

  if (lower.includes("wallet")) {
    return "Wallet";
  }

  return "";
}

// ==========================================
// MAIN PARSER
// ==========================================

export function parseBlinkitInvoice(text) {
  if (!text || typeof text !== "string") {
    return {
      storeName: "Blinkit",
      productName: "",
      purchaseDate: "",
      amount: "",
      paymentMethod: "",
      category: "Others",
      confidence: 0,
    };
  }

  const normalizedText = normalizeText(text);

  const productName =
    extractProductName(normalizedText);

const rawPurchaseDate =
  extractPurchaseDate(normalizedText);

const purchaseDate =
  rawPurchaseDate;


  const amount =
    extractAmount(normalizedText);

  const paymentMethod =
    extractPaymentMethod(normalizedText);

  const category =
    detectBlinkitCategory(productName);

  // ==========================================
  // CONFIDENCE
  // ==========================================

  let confidence = 0;

  if (isBlinkitInvoice(normalizedText)) {
    confidence += 0.25;
  }

  if (productName) {
    confidence += 0.30;
  }

  if (purchaseDate) {
    confidence += 0.20;
  }

  if (amount) {
    confidence += 0.20;
  }

  if (paymentMethod) {
    confidence += 0.05;
  }

  confidence = Number(
    Math.min(confidence, 1).toFixed(2)
  );

  console.log(
    "========== BLINKIT PARSER =========="
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
    "===================================="
  );

  return {
    storeName: "Blinkit",
    productName,
    purchaseDate,
    amount,
    paymentMethod,
    category,
    confidence,
  };
}
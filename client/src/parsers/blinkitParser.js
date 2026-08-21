// ==========================================
// BLINKIT PDF PARSER
// ==========================================
//
// Supports:
//
// 1. Existing single-product Blinkit parsing
// 2. Multiple products across multiple pages
// 3. Charge-only pages
// 4. Product category detection
// 5. Purchase date
// 6. Payment method
// 7. Multi-page total amount
//
// IMPORTANT:
// Existing parseBlinkitInvoice() is preserved
// for backward compatibility.
//
// New multi-product entry point:
//
// parseBlinkitProductPages(pages)
//
// ==========================================


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizeText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

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
// PRODUCT NAME - SINGLE PRODUCT
// ==========================================

function extractProductName(text) {
  if (!text) {
    return "";
  }

  const match = text.match(
    /Item\s+Description[\s\S]*?\b\d+\s+(?:(?:\d+\s+){4,6})([A-Za-z][\s\S]{1,140}?)\s*\(\s*HSN\s*[-:]?\s*\d{4,10}\s*\)/i
  );

  if (match) {
    const product = cleanBlinkitProductName(match[1]);

    if (
      product &&
      !/^(mrp|discount|qty|taxable|cgst|sgst|cess|total)$/i.test(
        product
      )
    ) {
      return product;
    }
  }

  // Fallback for known product words

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      /sprite|coke|pepsi|biscuit|chips|milk|bread|rice|atta|dal|juice|water|soap|shampoo|cream|toothpaste|detergent|tomato|onion|chilli|maggi|daliya/i.test(
        line
      )
    ) {
      return cleanBlinkitProductName(line);
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

  // Example:
  // Invoice Date : 23-Apr-2024

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

  // Fallback:
  // DD/MM/YYYY
  // DD-MM-YYYY

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
// SINGLE PRODUCT AMOUNT
// ==========================================

function extractAmount(text) {
  if (!text) {
    return "";
  }

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
      .filter(
        (value) => Number.isFinite(Number(value))
      );

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
      "rice",
      "atta",
      "dal",
      "cucumber",
      "tomato",
      "onion",
      "chilli",
      "daliya",
    ].some((keyword) =>
      product.includes(keyword)
    )
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
      "maggi",
      "noodle",
    ].some((keyword) =>
      product.includes(keyword)
    )
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
    ].some((keyword) =>
      product.includes(keyword)
    )
  ) {
    return "Personal Care";
  }

  if (
    [
      "detergent",
      "cleaner",
      "dishwash",
      "washing",
    ].some((keyword) =>
      product.includes(keyword)
    )
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
// PRODUCT NAME CLEANER
// ==========================================

function cleanBlinkitProductName(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .replace(/[|]+/g, "")
    .replace(/^\s*\d+\s+/, "")
    .trim();
}


// ==========================================
// CHARGE PRODUCT CHECK
// ==========================================

function isBlinkitChargeProduct(productName) {
  if (!productName) {
    return false;
  }

  return /^(handling\s+charge|delivery\s+charge|platform\s+fee|convenience\s+fee|shipping\s+charge|other\s+charges?|small\s+cart\s+fee|surge\s+fee)$/i.test(
    productName.trim()
  );
}


// ==========================================
// ADD UNIQUE PRODUCT
// ==========================================

function pushUniqueBlinkitProduct(
  products,
  seen,
  productName
) {
  const cleanName =
    cleanBlinkitProductName(productName);

  if (!cleanName) {
    return;
  }

  // Never treat charges as products

  if (isBlinkitChargeProduct(cleanName)) {
    return;
  }

  // Never treat table headers as products

  if (
    /^(item description|mrp|discount|qty|taxable value|cgst|sgst|cess|total)$/i.test(
      cleanName
    )
  ) {
    return;
  }

  const key = cleanName
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (!key || seen.has(key)) {
    return;
  }

  seen.add(key);

  products.push({
    productName: cleanName,
    category:
      detectBlinkitCategory(cleanName),
  });
}


// ==========================================
// MULTIPLE PRODUCT EXTRACTION
// ==========================================

function extractBlinkitProducts(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const normalizedText = normalizeText(text);

  // ==========================================
  // 1. FIND PRODUCT TABLE
  // ==========================================

  const itemStart = normalizedText.search(
    /Sr\.?\s*no\.?[\s\S]*?Item\s+Description/i
  );

  if (itemStart === -1) {
    return [];
  }

  const itemSection = normalizedText.slice(itemStart);

  const footerIndex = itemSection.search(
    /\bAmount\s+in\s+Words\b/i
  );

  const tableText =
    footerIndex !== -1
      ? itemSection.slice(0, footerIndex)
      : itemSection;

  // ==========================================
  // 2. FIND HSN MARKERS
  // ==========================================
  //
  // Blinkit OCR examples:
  //
  // Green Cucumber
  // (500 g) (HSN-
  // 400
  // 07070000)
  //
  // Green Chilli (HSN-07091000)
  //
  // Onion 1 kg (HSN-07081000)
  //
  // So HSN becomes our PRODUCT boundary.
  // ==========================================

  const hsnMatches = [
    ...tableText.matchAll(
      /\(\s*HSN\s*[-:]?\s*/gi
    ),
  ];

  if (hsnMatches.length === 0) {
    return [];
  }

  const products = [];
  const seen = new Set();

  // ==========================================
  // 3. EXTRACT PRODUCT BEFORE EACH HSN
  // ==========================================

  for (
    let index = 0;
    index < hsnMatches.length;
    index++
  ) {
    const match = hsnMatches[index];

    const previousEnd =
      index === 0
        ? 0
        : hsnMatches[index - 1].index +
          hsnMatches[index - 1][0].length;

    const segment = tableText.slice(
      previousEnd,
      match.index
    );

    const lines = segment
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    // ========================================
    // Expected invoice row number
    // ========================================
    //
    // First HSN -> row 1
    // Second HSN -> row 2
    // Third HSN -> row 3
    // etc.
    //
    // This prevents quantity "1" from being
    // confused with the actual row number.
    // ========================================

    const expectedRowNumber = String(index + 1);

    let rowStartIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === expectedRowNumber) {
        rowStartIndex = i;
        break;
      }
    }

    // ========================================
    // If row number is not found, use whole
    // segment as fallback.
    // ========================================

    const candidateLines =
      rowStartIndex !== -1
        ? lines.slice(rowStartIndex + 1)
        : lines;

    // ========================================
    // 4. KEEP ONLY DESCRIPTION-LIKE LINES
    // ========================================

    const descriptionLines = [];

    for (const line of candidateLines) {
      // Ignore pure numbers.
      //
      // Examples:
      // 551
      // 242
      // 14.00
      // 0.00
      // 1
      // 07070000
      //
      if (/^[\d\s.,|]+$/.test(line)) {
        continue;
      }

      // Remove leading UPC / numeric OCR garbage.
      //
      // Example:
      // "105 Instant Noodles"
      // -> "Instant Noodles"
      //
      // Example:
      // "1 3 551 245 Onion 1 kg"
      // -> "Onion 1 kg"
      let cleaned = line
        .replace(
          /^(?:\d+\s+){1,6}/,
          ""
        )
        .trim();

      // Remove trailing HSN opening fragment.
      cleaned = cleaned
        .replace(
          /\s*\(?\s*HSN\s*[-:]?\s*$/i,
          ""
        )
        .trim();

      // Remove pipe OCR artifact.
      cleaned = cleaned
        .replace(/\|/g, "")
        .trim();

      if (!cleaned) {
        continue;
      }

      // Ignore table headers.
      if (
        /^(item description|mrp|discount|qty|taxable value|cgst|sgst|cess|total)$/i.test(
          cleaned
        )
      ) {
        continue;
      }

      // Ignore charge products.
      if (
        /^(handling charge|delivery charge|platform fee|convenience fee|shipping charge|other charges?|small cart fee|surge fee)$/i.test(
          cleaned
        )
      ) {
        continue;
      }

      // Must contain at least one alphabetic character.
      if (!/[A-Za-z]/.test(cleaned)) {
        continue;
      }

      descriptionLines.push(cleaned);
    }

    // ========================================
    // 5. BUILD PRODUCT NAME
    // ========================================

    let productName = descriptionLines
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    // Remove accidental trailing table words.
    productName = productName
      .replace(
        /\s+(MRP|Discount|Qty\.?|Taxable Value|CGST|SGST|Cess|Total)\b.*$/i,
        ""
      )
      .trim();

    // Remove trailing "(" caused by:
    // Green Chilli (HSN-
    productName = productName
      .replace(/\s*\($/, "")
      .trim();

    if (!productName) {
      continue;
    }

    // ========================================
    // 6. REMOVE DUPLICATES
    // ========================================

    const key = productName
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    products.push({
      productName,
      category: detectBlinkitCategory(productName),
    });
  }

  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    "Blinkit extracted products:",
    products
  );

  console.log(
    "Blinkit product count:",
    products.length
  );

  return products;
}
// ==========================================
// PAGE TOTAL
// ==========================================

function extractBlinkitPageTotal(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const normalizedText =
    normalizeText(text);

  // Charge-only invoice:

  // 1 998549 Handling charge ...

  // Must NOT count it.

  if (
    /\bhandling\s+charge\b/i.test(
      normalizedText
    ) &&
    !/\bItem\s+Description\b/i.test(
      normalizedText
    )
  ) {
    return 0;
  }

  const itemStart =
    normalizedText.search(
      /Sr\.?\s*no\.?[\s\S]*?(?:Item\s+Description|HSN\s+Code)/i
    );

  if (itemStart === -1) {
    return 0;
  }

  const tableText =
    normalizedText.slice(itemStart);

  const footerIndex =
    tableText.search(
      /\bAmount\s+in\s+Words\b/i
    );

  const invoiceSection =
    footerIndex !== -1
      ? tableText.slice(
          0,
          footerIndex
        )
      : tableText;


  // Example:
  //
  // Total 4 83.00
  // Total 1 28.00
  //
  // Take final monetary value.

  const totalRows = [
    ...invoiceSection.matchAll(
      /\bTotal\s+\d+(?:\s+\d+(?:\.\d{1,3})?){0,10}\s+([\d,]+\.\d{1,2})\b/gi
    ),
  ];

  if (totalRows.length > 0) {
    const value =
      totalRows[
        totalRows.length - 1
      ][1].replace(/,/g, "");

    const number =
      Number(value);

    if (Number.isFinite(number)) {
      return number;
    }
  }


  // Fallback:
  //
  // Search after last "Total"

  const totalIndex =
    invoiceSection.lastIndexOf(
      "Total"
    );

  if (totalIndex !== -1) {
    const totalSection =
      invoiceSection.slice(
        totalIndex
      );

    const values = [
      ...totalSection.matchAll(
        /(\d+\.\d{1,2})/g
      ),
    ];

    if (values.length > 0) {
      const value =
        values[
          values.length - 1
        ][1];

      const number =
        Number(value);

      if (
        Number.isFinite(number)
      ) {
        return number;
      }
    }
  }

  return 0;
}


// ==========================================
// EXISTING SINGLE PRODUCT PARSER
// ==========================================
//
// IMPORTANT:
// Keep this function because existing
// Upload.jsx / router may still use it.
//
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

  const normalizedText =
    normalizeText(text);

  const productName =
    extractProductName(
      normalizedText
    );

  const purchaseDate =
    extractPurchaseDate(
      normalizedText
    );

  const amount =
    extractAmount(
      normalizedText
    );

  const paymentMethod =
    extractPaymentMethod(
      normalizedText
    );

  const category =
    detectBlinkitCategory(
      productName
    );


  let confidence = 0;

  if (
    isBlinkitInvoice(
      normalizedText
    )
  ) {
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

  confidence =
    Number(
      Math.min(
        confidence,
        1
      ).toFixed(2)
    );


  console.log(
    "========== BLINKIT PARSER =========="
  );

  console.log(
    "Product:",
    productName
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


// ==========================================
// MULTI-PAGE BLINKIT PARSER
// ==========================================
//
// Input:
//
// [
//   { pageNumber: 1, text: "..." },
//   { pageNumber: 2, text: "..." },
//   { pageNumber: 3, text: "..." },
//   { pageNumber: 4, text: "..." }
// ]
//
// Output:
//
// {
//   storeName: "Blinkit",
//   products: [...],
//   productName: "A, B, C",
//   purchaseDate: "...",
//   amount: "141.00",
//   paymentMethod: "UPI",
//   category: "Multiple",
//   confidence: 1
// }
//
// ==========================================

export function parseBlinkitProductPages(
  pages
) {
  if (
    !Array.isArray(pages) ||
    pages.length === 0
  ) {
    return {
      storeName: "Blinkit",
      products: [],
      productName: "",
      purchaseDate: "",
      amount: "",
      paymentMethod: "",
      category: "Others",
      confidence: 0,
    };
  }


  const allProducts = [];
  const seen = new Set();

  let purchaseDate = "";
  let paymentMethod = "";

  let totalAmount = 0;

  let productPageCount = 0;


  // ==========================================
  // PROCESS EVERY PAGE
  // ==========================================

  for (const page of pages) {
    if (
      !page?.text ||
      typeof page.text !== "string"
    ) {
      continue;
    }

    const pageText =
      normalizeText(
        page.text
      );


    // ------------------------------------------
    // DATE
    // ------------------------------------------

    if (!purchaseDate) {
      purchaseDate =
        extractPurchaseDate(
          pageText
        );
    }


    // ------------------------------------------
    // PAYMENT
    // ------------------------------------------

    if (!paymentMethod) {
      paymentMethod =
        extractPaymentMethod(
          pageText
        );
    }


    // ------------------------------------------
    // PRODUCTS
    // ------------------------------------------

    const pageProducts =
      extractBlinkitProducts(
        pageText
      );


    console.log(
      `Blinkit Page ${page.pageNumber}:`,
      pageProducts
    );


    if (
      pageProducts.length > 0
    ) {
      productPageCount += 1;
    }


    // Add products without
    // duplicates.

    for (
      const product of pageProducts
    ) {
      pushUniqueBlinkitProduct(
        allProducts,
        seen,
        product.productName
      );
    }


    // ------------------------------------------
    // PAGE TOTAL
    // ------------------------------------------

    const pageTotal =
      extractBlinkitPageTotal(
        pageText
      );


    if (
      pageTotal > 0 &&
      pageProducts.length > 0
    ) {
      totalAmount += pageTotal;
    }
  }


  // ==========================================
  // FINAL PRODUCTS
  // ==========================================

  const products =
    allProducts;


  // Compatibility field.
  //
  // Existing UI can still receive
  // productName as a string.

  const productName =
    products.length > 0
      ? products
          .map(
            (product) =>
              product.productName
          )
          .join(", ")
      : "";


  // ==========================================
  // CATEGORY
  // ==========================================

  let category = "Others";

  if (products.length === 1) {
    category =
      products[0].category;
  }

  if (products.length > 1) {
    category = "Multiple";
  }


  // ==========================================
  // CONFIDENCE
  // ==========================================

  let confidence = 0;

  if (products.length > 0) {
    confidence += 0.60;
  }

  if (purchaseDate) {
    confidence += 0.20;
  }

  if (paymentMethod) {
    confidence += 0.10;
  }

  if (totalAmount > 0) {
    confidence += 0.10;
  }

  confidence =
    Number(
      Math.min(
        confidence,
        1
      ).toFixed(2)
    );


  // ==========================================
  // FINAL AMOUNT
  // ==========================================

  const amount =
    totalAmount > 0
      ? totalAmount.toFixed(2)
      : "";


  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    "========== BLINKIT MULTI-PAGE PARSER =========="
  );

  console.log(
    "Pages:",
    pages.map(
      (page) =>
        page.pageNumber
    )
  );

  console.log(
    "Product Pages:",
    productPageCount
  );

  console.log(
    "Products:",
    products
  );

  console.log(
    "Product Count:",
    products.length
  );

  console.log(
    "Product Names:",
    productName
  );

  console.log(
    "Purchase Date:",
    purchaseDate
  );

  console.log(
    "Amount:",
    amount
  );

  console.log(
    "Payment:",
    paymentMethod
  );

  console.log(
    "Category:",
    category
  );

  console.log(
    "Confidence:",
    confidence
  );

  console.log(
    "================================================"
  );


  // ==========================================
  // FINAL RESULT
  // ==========================================

  return {
    storeName: "Blinkit",

    // NEW
    products,

    // OLD COMPATIBILITY FIELD
    productName,

    purchaseDate,

    amount,

    paymentMethod,

    category,

    confidence,
  };
}
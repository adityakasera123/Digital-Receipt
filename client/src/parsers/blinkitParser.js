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
//
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

  // ------------------------------------------
  // Fallback for known product words
  // ------------------------------------------

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    if (
      /sprite|coke|pepsi|biscuit|chips|milk|bread|rice|atta|dal|juice|water|soap|shampoo|cream|toothpaste|detergent|tomato|onion|chilli|maggi|daliya|cucumber/i.test(
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

// ==========================================
// PURCHASE DATE
// ==========================================
//
// Blinkit OCR can appear like:
//
// Invoice
// Date
// : 508393748
// : 23-Apr-2024
//
// OR:
//
// Invoice Date: 23-Apr-2024
//
// We therefore do NOT assume that
// "Invoice Date" and the actual date are
// on the same line.
//
// ==========================================

function extractPurchaseDate(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // ------------------------------------------
  // Keep original OCR line structure
  // ------------------------------------------

  const rawText = text
    .replace(/\r/g, '\n');

  // ------------------------------------------
  // 1. Strong Blinkit date pattern
  //
  // Examples:
  //
  // 23-Apr-2024
  // 23-April-2024
  // 23/Apr/2024
  // 23 Apr 2024
  //
  // ------------------------------------------

  const monthDateMatch = rawText.match(
    /\b(\d{1,2})\s*[-\/\s]\s*(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*[-\/\s]\s*(\d{4})\b/i
  );

  if (monthDateMatch) {
    const day = monthDateMatch[1].padStart(2, '0');

    const monthName =
      monthDateMatch[2].toLowerCase();

    const year =
      monthDateMatch[3];

    const months = {
      jan: '01',
      january: '01',

      feb: '02',
      february: '02',

      mar: '03',
      march: '03',

      apr: '04',
      april: '04',

      may: '05',

      jun: '06',
      june: '06',

      jul: '07',
      july: '07',

      aug: '08',
      august: '08',

      sep: '09',
      sept: '09',
      september: '09',

      oct: '10',
      october: '10',

      nov: '11',
      november: '11',

      dec: '12',
      december: '12',
    };

    const month =
      months[monthName];

    if (month) {
      const result =
        `${year}-${month}-${day}`;

      console.log(
        'Blinkit Purchase Date detected:',
        result
      );

      return result;
    }
  }

  // ------------------------------------------
  // 2. Numeric date fallback
  //
  // DD/MM/YYYY
  // DD-MM-YYYY
  //
  // ------------------------------------------

  const numericMatch = rawText.match(
    /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/
  );

  if (numericMatch) {
    const day =
      numericMatch[1].padStart(2, '0');

    const month =
      numericMatch[2].padStart(2, '0');

    const year =
      numericMatch[3];

    const monthNumber =
      Number(month);

    const dayNumber =
      Number(day);

    if (
      monthNumber >= 1 &&
      monthNumber <= 12 &&
      dayNumber >= 1 &&
      dayNumber <= 31
    ) {
      const result =
        `${year}-${month}-${day}`;

      console.log(
        'Blinkit Purchase Date detected:',
        result
      );

      return result;
    }
  }

  // ------------------------------------------
  // 3. Date with dots
  //
  // DD.MM.YYYY
  //
  // ------------------------------------------

  const dotDateMatch = rawText.match(
    /\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/
  );

  if (dotDateMatch) {
    const day =
      dotDateMatch[1].padStart(2, '0');

    const month =
      dotDateMatch[2].padStart(2, '0');

    const year =
      dotDateMatch[3];

    const monthNumber =
      Number(month);

    const dayNumber =
      Number(day);

    if (
      monthNumber >= 1 &&
      monthNumber <= 12 &&
      dayNumber >= 1 &&
      dayNumber <= 31
    ) {
      const result =
        `${year}-${month}-${day}`;

      console.log(
        'Blinkit Purchase Date detected:',
        result
      );

      return result;
    }
  }

  console.log(
    'Blinkit Purchase Date: NOT FOUND'
  );

  return '';
}

// ==========================================
// SINGLE PRODUCT AMOUNT
// ==========================================

function extractAmount(text) {
  if (!text) {
    return "";
  }

  const normalizedText = normalizeText(text);

  // ------------------------------------------
  // 1. Last Total section
  // ------------------------------------------

  const totalIndex = normalizedText.lastIndexOf("Total");

  if (totalIndex !== -1) {
    const totalSection = normalizedText.slice(
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
        (value) =>
          Number.isFinite(Number(value))
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

  // ------------------------------------------
  // GROCERIES
  // ------------------------------------------

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

  // ------------------------------------------
  // FOOD
  // ------------------------------------------

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

  // ------------------------------------------
  // PERSONAL CARE
  // ------------------------------------------

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

  // ------------------------------------------
  // HOUSEHOLD
  // ------------------------------------------

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

  const normalizedText =
    normalizeText(text);

  // ==========================================
  // FIND PRODUCT TABLE
  // ==========================================

  const itemStart = normalizedText.search(
    /Sr\.?\s*no\.?[\s\S]*?Item\s+Description/i
  );

  if (itemStart === -1) {
    return [];
  }

  const itemSection =
    normalizedText.slice(itemStart);

  const footerIndex =
    itemSection.search(
      /\bAmount\s+in\s+Words\b/i
    );

  const tableText =
    footerIndex !== -1
      ? itemSection.slice(0, footerIndex)
      : itemSection;

  // ==========================================
  // FIND HSN MARKERS
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
  // EXTRACT PRODUCT BEFORE EACH HSN
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

    const segment =
      tableText.slice(
        previousEnd,
        match.index
      );

    const lines = segment
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    // ------------------------------------------
    // Expected invoice row number
    // ------------------------------------------

    const expectedRowNumber =
      String(index + 1);

    let rowStartIndex = -1;

    for (
      let i = 0;
      i < lines.length;
      i++
    ) {
      if (
        lines[i] === expectedRowNumber
      ) {
        rowStartIndex = i;
        break;
      }
    }

    // ------------------------------------------
    // Fallback
    // ------------------------------------------

    const candidateLines =
      rowStartIndex !== -1
        ? lines.slice(rowStartIndex + 1)
        : lines;

    // ==========================================
    // KEEP DESCRIPTION-LIKE LINES
    // ==========================================

    const descriptionLines = [];

    for (const line of candidateLines) {
      // Ignore pure numbers

      if (/^[\d\s.,|]+$/.test(line)) {
        continue;
      }

      // Remove leading UPC / OCR garbage

      let cleaned = line
        .replace(
          /^(?:\d+\s+){1,6}/,
          ""
        )
        .trim();

      // Remove HSN opening fragment

      cleaned = cleaned
        .replace(
          /\s*\(?\s*HSN\s*[-:]?\s*$/i,
          ""
        )
        .trim();

      // Remove pipe OCR artifact

      cleaned = cleaned
        .replace(/\|/g, "")
        .trim();

      if (!cleaned) {
        continue;
      }

      // Ignore table headers

      if (
        /^(item description|mrp|discount|qty|taxable value|cgst|sgst|cess|total)$/i.test(
          cleaned
        )
      ) {
        continue;
      }

      // Ignore charge products

      if (
        /^(handling charge|delivery charge|platform fee|convenience fee|shipping charge|other charges?|small cart fee|surge fee)$/i.test(
          cleaned
        )
      ) {
        continue;
      }

      // Must contain alphabetic character

      if (!/[A-Za-z]/.test(cleaned)) {
        continue;
      }

      descriptionLines.push(cleaned);
    }

    // ==========================================
    // BUILD PRODUCT NAME
    // ==========================================

    let productName =
      descriptionLines
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

    // Remove accidental trailing table words

    productName = productName
      .replace(
        /\s+(MRP|Discount|Qty\.?|Taxable Value|CGST|SGST|Cess|Total)\b.*$/i,
        ""
      )
      .trim();

    // Remove trailing "("

    productName = productName
      .replace(/\s*\($/, "")
      .trim();

    if (!productName) {
      continue;
    }

    // ==========================================
    // REMOVE DUPLICATES
    // ==========================================

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
      category:
        detectBlinkitCategory(productName),
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
// NUMBER WORDS → NUMBER
// ==========================================
//
// Used mainly for Blinkit:
//
// Amount in Words:
// Thirty Rupees And Zero Paisa Only
//
// This gives:
//
// 30
//
// ==========================================

function blinkitWordsToNumber(text) {
  if (!text) {
    return NaN;
  }

  const normalized =
    text
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/,/g, " ")
      .replace(/\b(and)\b/g, " ")
      .replace(/\brupees?\b/g, " ")
      .replace(/\bpaise?\b/g, " ")
      .replace(/\bonly\b/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const smallNumbers = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
  };

  const tens = {
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };

  const tokens =
    normalized.split(" ");

  let total = 0;
  let current = 0;

  for (const token of tokens) {
    if (
      Object.prototype.hasOwnProperty.call(
        smallNumbers,
        token
      )
    ) {
      current += smallNumbers[token];
      continue;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        tens,
        token
      )
    ) {
      current += tens[token];
      continue;
    }

    if (token === "hundred") {
      if (current === 0) {
        current = 1;
      }

      current *= 100;
      continue;
    }

    if (
      token === "thousand" ||
      token === "thousands"
    ) {
      if (current === 0) {
        current = 1;
      }

      total += current * 1000;
      current = 0;
      continue;
    }

    if (
      token === "lakh" ||
      token === "lakhs"
    ) {
      if (current === 0) {
        current = 1;
      }

      total += current * 100000;
      current = 0;
      continue;
    }

    if (
      token === "crore" ||
      token === "crores"
    ) {
      if (current === 0) {
        current = 1;
      }

      total += current * 10000000;
      current = 0;
      continue;
    }

    // Ignore unknown OCR words.
  }

  total += current;

  return total;
}


// ==========================================
// EXTRACT AMOUNT FROM AMOUNT IN WORDS
// ==========================================

function extractBlinkitAmountInWords(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  const match = text.match(
    /Amount\s+in\s+Words\s*:?\s*([\s\S]{0,180})/i
  );

  if (!match) {
    return 0;
  }

  let words = match[1];

  // Stop at common footer markers

  words = words.split(
    /\b(?:authorized|authorised|for\s+blink|terms\s+(?:and|&)\s+conditions|digitally\s+signed)\b/i
  )[0];

  words = words
    .replace(/\s+/g, " ")
    .trim();

  if (!words) {
    return 0;
  }

  const number =
    blinkitWordsToNumber(words);

  if (
    Number.isFinite(number) &&
    number >= 0
  ) {
    return number;
  }

  return 0;
}


// ==========================================
// PAGE TOTAL
// ==========================================
//
// IMPORTANT:
//
// Product page:
//
// Total 4 83.00
//
// Product page:
//
// Total 1 28.00
//
// Product page:
//
// Amount in Words:
// Thirty Rupees And Zero Paisa Only
//
// Charge page:
//
// Handling charge
// Total ...
//
// Charge-only pages MUST NOT be added
// to receipt amount.
//
// ==========================================

function extractBlinkitPageTotal(text) {
  if (!text || typeof text !== "string") {
    return 0;
  }

  // Keep original line structure for amount
  // extraction. Do NOT use normalizeText here
  // because newlines are useful for OCR layouts.

  const rawText = text
    .replace(/\r/g, "\n");

  const normalizedText =
    normalizeText(text);

  // ------------------------------------------
  // Charge-only invoice
  // ------------------------------------------

  if (
    /\bhandling\s+charge\b/i.test(
      normalizedText
    ) &&
    !/\bItem\s+Description\b/i.test(
      normalizedText
    )
  ) {
    console.log(
      "Blinkit: Charge-only page ignored."
    );

    return 0;
  }

  // ------------------------------------------
  // Must have product table
  // ------------------------------------------

  const itemStart =
    normalizedText.search(
      /Sr\.?\s*no\.?[\s\S]*?(?:Item\s+Description|HSN\s+Code)/i
    );

  if (itemStart === -1) {
    return 0;
  }

  // ==========================================
  // STRATEGY 1
  //
  // Amount in Words
  //
  // This is the most reliable fallback for
  // OCR layouts where the Total row gets split.
  //
  // Example:
  //
  // Amount in Words:
  // Thirty Rupees And Zero Paisa Only
  //
  // => 30
  //
  // ==========================================

  const amountInWords =
    extractBlinkitAmountInWords(
      rawText
    );

  if (
    amountInWords > 0
  ) {
    console.log(
      "Blinkit total from Amount in Words:",
      amountInWords
    );

    return amountInWords;
  }

  // ==========================================
  // STRATEGY 2
  //
  // Direct Total row extraction
  //
  // Handles:
  //
  // Total 4 83.00
  // Total 1 28.00
  //
  // ==========================================

  const totalLineMatches = [
    ...rawText.matchAll(
      /^\s*Total\b.*$/gim
    ),
  ];

  if (
    totalLineMatches.length > 0
  ) {
    for (
      let i =
        totalLineMatches.length - 1;
      i >= 0;
      i--
    ) {
      const totalLine =
        totalLineMatches[i][0];

      const amounts = [
        ...totalLine.matchAll(
          /(?:₹|Rs\.?)?\s*(\d[\d,]*\.\d{1,2})/gi
        ),
      ]
        .map(
          (match) =>
            Number(
              match[1].replace(/,/g, "")
            )
        )
        .filter(
          (value) =>
            Number.isFinite(value) &&
            value >= 0
        );

      if (amounts.length > 0) {
        const value =
          amounts[amounts.length - 1];

        console.log(
          "Blinkit total from Total row:",
          value
        );

        return value;
      }
    }
  }

  // ==========================================
  // STRATEGY 3
  //
  // Total may be split over multiple OCR lines.
  //
  // Example:
  //
  // Total
  // 1
  // 30.00
  //
  // ==========================================

  const totalIndex =
    rawText.search(
      /\bTotal\b/i
    );

  if (totalIndex !== -1) {
    const afterTotal =
      rawText.slice(
        totalIndex,
        totalIndex + 250
      );

    const amounts = [
      ...afterTotal.matchAll(
        /(?:₹|Rs\.?)?\s*(\d[\d,]*\.\d{1,2})/gi
      ),
    ]
      .map(
        (match) =>
          Number(
            match[1].replace(/,/g, "")
          )
      )
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0
      );

    if (amounts.length > 0) {
      const value =
        amounts[amounts.length - 1];

      console.log(
        "Blinkit total from split Total section:",
        value
      );

      return value;
    }
  }

  // ==========================================
  // STRATEGY 4
  //
  // Original Blinkit style fallback
  //
  // ==========================================

  const normalizedTotalIndex =
    normalizedText.lastIndexOf(
      "Total"
    );

  if (
    normalizedTotalIndex !== -1
  ) {
    const totalSection =
      normalizedText.slice(
        normalizedTotalIndex
      );

    const values = [
      ...totalSection.matchAll(
        /(\d[\d,]*\.\d{1,2})/g
      ),
    ]
      .map(
        (match) =>
          Number(
            match[1].replace(/,/g, "")
          )
      )
      .filter(
        (value) =>
          Number.isFinite(value) &&
          value >= 0
      );

    if (values.length > 0) {
      const value =
        values[values.length - 1];

      console.log(
        "Blinkit total from final fallback:",
        value
      );

      return value;
    }
  }

  console.log(
    "Blinkit Page Total: 0"
  );

  return 0;
}


// ==========================================
// EXISTING SINGLE PRODUCT PARSER
// ==========================================
//
// IMPORTANT:
//
// DO NOT REMOVE.
//
// Existing Upload.jsx / router may still
// use this function.
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

  // ==========================================
  // CONFIDENCE
  // ==========================================

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

    if (!pageText) {
      continue;
    }

    console.log(
      "=========================================="
    );

    console.log(
      `BLINKIT PROCESSING PAGE ${page.pageNumber}`
    );

    // ========================================
    // DATE
    // ========================================

    const pageDate =
      extractPurchaseDate(
        pageText
      );

    if (
      !purchaseDate &&
      pageDate
    ) {
      purchaseDate = pageDate;
    }

    // ========================================
    // PAYMENT
    // ========================================

    const pagePayment =
      extractPaymentMethod(
        pageText
      );

    if (
      !paymentMethod &&
      pagePayment
    ) {
      paymentMethod =
        pagePayment;
    }

    // ========================================
    // PRODUCTS
    // ========================================

    const pageProducts =
      extractBlinkitProducts(
        pageText
      );

    console.log(
      `Blinkit Page ${page.pageNumber} products:`,
      pageProducts
    );

    // ========================================
    // PRODUCT PAGE CHECK
    // ========================================

    if (
      pageProducts.length > 0
    ) {
      productPageCount += 1;
    }

    // ========================================
    // ADD PRODUCTS
    // ========================================

    for (
      const product of pageProducts
    ) {
      pushUniqueBlinkitProduct(
        allProducts,
        seen,
        product.productName
      );
    }

    // ========================================
    // PAGE TOTAL
    // ========================================
    //
    // IMPORTANT:
    //
    // Only add total when page actually
    // contains products.
    //
    // Therefore:
    //
    // Page 1 = ₹83
    // Page 2 = ₹28
    // Page 3 = ₹30
    //
    // Page 4:
    // Handling Charge = ₹2
    //
    // Page 4 is not a product page,
    // so ₹2 is NOT added.
    //
    // Final:
    //
    // ₹83 + ₹28 + ₹30 = ₹141
    //
    // ========================================

    if (
      pageProducts.length > 0
    ) {
      const pageTotal =
        extractBlinkitPageTotal(
          pageText
        );

      console.log(
        `Blinkit Page ${page.pageNumber} total:`,
        pageTotal
      );

      if (
        pageTotal > 0
      ) {
        totalAmount +=
          pageTotal;
      }
    }

    console.log(
      "=========================================="
    );
  }

  // ==========================================
  // FINAL PRODUCTS
  // ==========================================

  const products =
    allProducts;

  // ==========================================
  // COMPATIBILITY FIELD
  // ==========================================
  //
  // Existing UI can still receive
  // productName as a string.
  //
  // ==========================================

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

  if (
    products.length === 1
  ) {
    category =
      products[0].category;
  }

  if (
    products.length > 1
  ) {
    category = "Multiple";
  }

  // ==========================================
  // CONFIDENCE
  // ==========================================

  let confidence = 0;

  if (
    products.length > 0
  ) {
    confidence += 0.60;
  }

  if (
    purchaseDate
  ) {
    confidence += 0.20;
  }

  if (
    paymentMethod
  ) {
    confidence += 0.10;
  }

  if (
    totalAmount > 0
  ) {
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

    // New multi-product field
    products,

    // Old compatibility field
    productName,

    purchaseDate,

    amount,

    paymentMethod,

    category,

    confidence,
  };
}
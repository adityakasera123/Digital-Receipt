// ==========================================
// ZOMATO PARSER
// ==========================================
//
// Responsibility:
// - Detect Zomato documents
// - Parse restaurant invoice
// - Parse Zomato platform invoice
// - Extract products from OCR
// - Extract purchase date
// - Extract total amount
// - Extract explicit payment method
// - Return normalized receipt result
// ==========================================


// ==========================================
// Normalize text
// ==========================================

function normalizeText(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}


// ==========================================
// Parse money
// ==========================================

function parseMoney(value) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const cleaned = String(value)
    .replace(/₹/g, "")
    .replace(/Rs\.?/gi, "")
    .replace(/,/g, "")
    .trim();

  const number = Number(cleaned);

  return Number.isFinite(number)
    ? number
    : null;
}


// ==========================================
// Detect Zomato document
// ==========================================

export function isZomatoDocument(text) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const lower = text.toLowerCase();

  return (
    lower.includes("zomato") ||
    lower.includes("zomato.com") ||
    lower.includes("eternal limited") ||
    lower.includes(
      "formerly known as zomato limited"
    )
  );
}


// ==========================================
// Extract purchase date
// ==========================================

function extractPurchaseDate(text) {
  if (!text) {
    return "";
  }

  // ------------------------------------------
  // Invoice Date: DD/MM/YYYY
  // ------------------------------------------

  const numericMatch = text.match(
    /\binvoice\s+date\s*:?\s*(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/i
  );

  if (numericMatch) {
    const day =
      numericMatch[1].padStart(2, "0");

    const month =
      numericMatch[2].padStart(2, "0");

    const year =
      numericMatch[3];

    return `${year}-${month}-${day}`;
  }

  // ------------------------------------------
  // Invoice Date: YYYY-MM-DD
  // ------------------------------------------

  const isoMatch = text.match(
    /\binvoice\s+date\s*:?\s*(20\d{2})-(\d{2})-(\d{2})\b/i
  );

  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // ------------------------------------------
  // dated YYYY-MM-DD
  // ------------------------------------------

  const datedMatch = text.match(
    /\bdated\s+(\d{4})-(\d{2})-(\d{2})\b/i
  );

  if (datedMatch) {
    return `${datedMatch[1]}-${datedMatch[2]}-${datedMatch[3]}`;
  }

  return "";
}


// ==========================================
// Extract restaurant name
// ==========================================

function extractRestaurantName(text) {
  if (!text) {
    return "";
  }

  const match = text.match(
    /\bRestaurant\s+Name\s*:\s*(.+?)(?=\n|$)/i
  );

  if (!match) {
    return "";
  }

  return match[1].trim();
}


// ==========================================
// Extract explicit payment method
//
// IMPORTANT:
// "settled digitally" does NOT mean UPI.
// We only return a method when explicitly named.
// ==========================================

function extractPaymentMethod(text) {
  if (!text) {
    return "";
  }

  const lower = text.toLowerCase();

  if (/\bupi\b/i.test(lower)) {
    return "UPI";
  }

  if (
    /\bcredit\s+card\b/i.test(lower)
  ) {
    return "Credit Card";
  }

  if (
    /\bdebit\s+card\b/i.test(lower)
  ) {
    return "Debit Card";
  }

  if (/\bnet\s*banking\b/i.test(lower)) {
    return "Net Banking";
  }

  if (/\bwallet\b/i.test(lower)) {
    return "Wallet";
  }

  if (/\bcash\b/i.test(lower)) {
    return "Cash";
  }

  if (/\bcard\b/i.test(lower)) {
    return "Card";
  }

  return "";
}


// ==========================================
// Extract restaurant invoice total
//
// IMPORTANT:
//
// Prefer the explicit:
//
// Amount of INR 204.75
//
// instead of trying to calculate from table rows.
// ==========================================

function extractRestaurantTotal(text) {
  if (!text) {
    return null;
  }

  // ------------------------------------------
  // BEST SOURCE
  //
  // Amount of INR 204.75
  // ------------------------------------------

  const amountMatch = text.match(
    /\bAmount\s+of\s+(?:INR|₹)?\s*([0-9][0-9,]*\.\d{2})/i
  );

  if (amountMatch) {
    return parseMoney(
      amountMatch[1]
    );
  }

  // ------------------------------------------
  // Total Value
  //
  // Use the last monetary value after
  // "Total Value".
  // ------------------------------------------

  const totalValueMatch = text.match(
    /\bTotal\s+Value\b[\s\S]*?([0-9][0-9,]*\.\d{2})(?![\s\S]*[0-9][0-9,]*\.\d{2})/i
  );

  if (totalValueMatch) {
    return parseMoney(
      totalValueMatch[1]
    );
  }

  return null;
}


// ==========================================
// Extract platform invoice total
//
// Actual OCR may contain:
//
// Amount of *9.44
//
// instead of:
//
// Amount of ₹9.44
//
// So we intentionally allow any non-digit
// characters between "Amount of" and amount.
// ==========================================

function extractPlatformTotal(text) {
  if (!text) {
    return null;
  }

  // ------------------------------------------
  // BEST SOURCE
  //
// Amount of ₹9.44
// Amount of *9.44
  // ------------------------------------------

  const amountMatch = text.match(
    /\bAmount\s+of\s+[^\d]*([0-9][0-9,]*\.\d{2})/i
  );

  if (amountMatch) {
    return parseMoney(
      amountMatch[1]
    );
  }

  // ------------------------------------------
  // Fallback:
  // Total ... 9.44
  // ------------------------------------------

  const totalMatch = text.match(
    /\bTotal\b[\s\S]*?([0-9][0-9,]*\.\d{2})(?![\s\S]*[0-9][0-9,]*\.\d{2})/i
  );

  if (totalMatch) {
    return parseMoney(
      totalMatch[1]
    );
  }

  return null;
}


// ==========================================
// Extract platform charges
// ==========================================

function extractPlatformCharges(text) {
  if (!text) {
    return [];
  }

  const charges = [];

  // ------------------------------------------
  // Platform fee
  //
  // Platform fee
  // 8.00
  // ------------------------------------------

  const platformFeeMatch = text.match(
    /\bPlatform\s+fee\b[\s\S]*?([0-9][0-9,]*\.\d{2})/i
  );

  if (platformFeeMatch) {
    const amount =
      parseMoney(
        platformFeeMatch[1]
      );

    if (amount !== null) {
      charges.push({
        name: "Platform fee",
        amount,
        type: "platform_fee",
      });
    }
  }

  return charges;
}


// ==========================================
// PRODUCT NAME CLEANUP
// ==========================================

function cleanProductName(name) {
  if (!name) {
    return "";
  }

  return name
    .replace(/^\d+\s*x\s*/i, "")
    .replace(/\s*\[[^\]]+\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ==========================================
// Check whether a line is a product start
//
// Examples:
//
// 1 x Paneer Bread Pakoda
// 1 x Veg Noodles
// 1 x Veg Manchurian Gravy
// ==========================================

function parseProductStart(line) {
  if (!line) {
    return null;
  }

  const match = line.match(
    /^(\d+)\s*x\s+(.+)$/i
  );

  if (!match) {
    return null;
  }

  const quantity =
    Number(match[1]);

  const productName =
    cleanProductName(
      match[2]
    );

  if (!productName) {
    return null;
  }

  return {
    quantity:
      Number.isFinite(quantity)
        ? quantity
        : 1,

    productName,
  };
}


// ==========================================
// Check whether a line contains product
// financial values
//
// OCR structure:
//
// 26
// 0
// 26
// 2.5%
// 0.65
// 2.5%
// 0.65
// 27.30
//
// Sometimes OCR puts all of these on one line.
// Sometimes they are split.
//
// We only need:
// - gross/unit price
// - final total
// ==========================================

function parseProductFinancialLine(line) {
  if (!line) {
    return null;
  }

  const normalized =
    line.trim();

  // ------------------------------------------
  // Extract all numeric tokens
  // ------------------------------------------

  const tokens =
    normalized.match(
      /[0-9]+(?:\.[0-9]+)?%?/g
    );

  if (!tokens || tokens.length < 3) {
    return null;
  }

  // ------------------------------------------
  // Remove percentage tokens
  // ------------------------------------------

  const numericTokens =
    tokens
      .filter(
        (token) =>
          !token.endsWith("%")
      )
      .map((token) =>
        parseMoney(token)
      )
      .filter(
        (value) =>
          value !== null
      );

  if (numericTokens.length < 3) {
    return null;
  }

  // ------------------------------------------
  // In this Zomato layout:
  //
  // gross
  // discount
  // net
  // cgst
  // sgst
  // total
  //
  // Therefore:
  //
  // first numeric = gross value
  // last numeric  = final total
  // ------------------------------------------

  const unitPrice =
    numericTokens[0];

  const totalPrice =
    numericTokens[
      numericTokens.length - 1
    ];

  if (
    unitPrice === null ||
    totalPrice === null
  ) {
    return null;
  }

  return {
    unitPrice,
    totalPrice,
  };
}


// ==========================================
// Extract products
//
// IMPORTANT:
//
// Google Vision OCR splits the original table:
//
// 1 x Paneer Bread Pakoda
// 26
// 0
// 26
// 2.5%
// 0.65
// ...
// 27.30
//
// So we CANNOT expect the entire product
// to exist on one line.
//
// We collect lines belonging to each
// product and then find the financial values.
// ==========================================

function extractProducts(text) {
  if (!text) {
    return [];
  }

  const lines =
    text
      .split("\n")
      .map((line) =>
        line.trim()
      )
      .filter(Boolean);

  const products = [];

  let currentProduct = null;

  let currentFinancialValues = [];

  // ------------------------------------------
  // Flush current product
  // ------------------------------------------

  const flushProduct = () => {
    if (!currentProduct) {
      return;
    }

    const numericTokens =
      currentFinancialValues
        .flatMap((line) => {
          return (
            line.match(
              /[0-9]+(?:\.[0-9]+)?%?/g
            ) || []
          );
        })
        .filter(
          (token) =>
            !token.endsWith("%")
        )
        .map((token) =>
          parseMoney(token)
        )
        .filter(
          (value) =>
            value !== null
        );

    // ----------------------------------------
    // Need at least:
    //
    // gross
    // discount
    // net
    // total
    // ----------------------------------------

    if (numericTokens.length >= 3) {
      const unitPrice =
        numericTokens[0];

      const totalPrice =
        numericTokens[
          numericTokens.length - 1
        ];

      if (
        unitPrice !== null &&
        totalPrice !== null
      ) {
        products.push({
          productName:
            currentProduct.productName,

          quantity:
            currentProduct.quantity,

          unitPrice:
            unitPrice.toFixed(2),

          totalPrice:
            totalPrice.toFixed(2),

          category: "Food",
        });
      }
    }

    currentProduct = null;
    currentFinancialValues = [];
  };


  // ------------------------------------------
  // Iterate OCR lines
  // ------------------------------------------

  for (const line of lines) {
    // ----------------------------------------
    // Ignore obvious headers
    // ----------------------------------------

    if (
      /^Particulars$/i.test(line) ||
      /^Gross value$/i.test(line) ||
      /^Discount$/i.test(line) ||
      /^Net value$/i.test(line) ||
      /^Total$/i.test(line) ||
      /^CGST$/i.test(line) ||
      /^SGST$/i.test(line)
    ) {
      continue;
    }

    // ----------------------------------------
    // Product starts
    // ----------------------------------------

    const productStart =
      parseProductStart(line);

    if (productStart) {
      // Save previous product first.
      flushProduct();

      currentProduct =
        productStart;

      continue;
    }

    // ----------------------------------------
    // If there is no active product,
    // ignore this line.
    // ----------------------------------------

    if (!currentProduct) {
      continue;
    }

    // ----------------------------------------
    // Unit description:
    //
    // [1 Piece]
    //
    // Ignore it.
    // ----------------------------------------

    if (
      /^\[[^\]]+\]$/i.test(line)
    ) {
      continue;
    }

    // ----------------------------------------
    // Stop at next invoice section.
    // ----------------------------------------

    if (
      /^Item\(s\)\s+Total/i.test(line) ||
      /^Total\s+Value/i.test(line) ||
      /^Amount\s+\(/i.test(line) ||
      /^Supply\s+attracts/i.test(line) ||
      /^For\s+ETERNAL/i.test(line)
    ) {
      flushProduct();
      continue;
    }

    // ----------------------------------------
    // Numeric / financial OCR lines
    // ----------------------------------------

    if (
      /\d/.test(line)
    ) {
      currentFinancialValues.push(
        line
      );
    }
  }

  // ------------------------------------------
  // Flush final product
  // ------------------------------------------

  flushProduct();

  return products;
}


// ==========================================
// Find restaurant page
// ==========================================

function findRestaurantPage(pageResults) {
  if (!Array.isArray(pageResults)) {
    return null;
  }

  return (
    pageResults.find((page) => {
      const text =
        page?.text || "";

      return (
        /\bRestaurant\s+Name\s*:/i.test(text) &&
        /\bParticulars\b/i.test(text) &&
        /\bItem\(s\)\s+Total\b/i.test(text)
      );
    }) || null
  );
}


// ==========================================
// Find platform page
// ==========================================

function findPlatformPage(pageResults) {
  if (!Array.isArray(pageResults)) {
    return null;
  }

  return (
    pageResults.find((page) => {
      const text =
        page?.text || "";

      return (
        /\bPlatform\s+fee\b/i.test(text) &&
        /ETERNAL\s+LIMITED/i.test(text)
      );
    }) || null
  );
}


// ==========================================
// Calculate confidence
// ==========================================

function calculateConfidence({
  restaurantPage,
  platformPage,
  restaurantName,
  products,
  purchaseDate,
  restaurantTotal,
  platformTotal,
}) {
  let score = 0;

  if (restaurantPage) {
    score += 0.15;
  }

  if (restaurantName) {
    score += 0.15;
  }

  if (products.length > 0) {
    score += 0.30;
  }

  if (purchaseDate) {
    score += 0.15;
  }

  if (restaurantTotal !== null) {
    score += 0.10;
  }

  if (platformPage) {
    score += 0.05;
  }

  if (platformTotal !== null) {
    score += 0.10;
  }

  return Math.min(
    Number(score.toFixed(2)),
    1
  );
}


// ==========================================
// Parse Zomato pages
// ==========================================

export function parseZomatoPages(
  pageResults = []
) {
  // ------------------------------------------
  // Empty result
  // ------------------------------------------

  if (
    !Array.isArray(pageResults) ||
    pageResults.length === 0
  ) {
    return {
      storeName: "",
      productName: "",
      products: [],
      purchaseDate: "",
      amount: "",
      paymentMethod: "",
      category: "Food",
      confidence: 0,
      charges: [],
    };
  }

  // ------------------------------------------
  // Normalize page text
  // ------------------------------------------

  const normalizedPages =
    pageResults.map((page) => ({
      ...page,

      text: normalizeText(
        page?.text || ""
      ),
    }));

  // ------------------------------------------
  // Identify pages
  // ------------------------------------------

  const restaurantPage =
    findRestaurantPage(
      normalizedPages
    );

  const platformPage =
    findPlatformPage(
      normalizedPages
    );

  // ------------------------------------------
  // Fallback product page
  // ------------------------------------------

  const fallbackProductPage =
    normalizedPages.find(
      (page) =>
        page?.classification?.type ===
        "PRODUCT_INVOICE"
    ) || null;

  const primaryPage =
    restaurantPage ||
    fallbackProductPage;

  // ------------------------------------------
  // Restaurant text
  // ------------------------------------------

  const restaurantText =
    restaurantPage?.text ||
    primaryPage?.text ||
    "";

  // ------------------------------------------
  // Store
  // ------------------------------------------

  const storeName =
    extractRestaurantName(
      restaurantText
    );

  // ------------------------------------------
  // Products
  // ------------------------------------------

  const products =
    extractProducts(
      restaurantText
    );

  // ------------------------------------------
  // Purchase date
  // ------------------------------------------

  let purchaseDate =
    extractPurchaseDate(
      restaurantText
    );

  if (
    !purchaseDate &&
    platformPage
  ) {
    purchaseDate =
      extractPurchaseDate(
        platformPage.text
      );
  }

  // ------------------------------------------
  // Payment method
  // ------------------------------------------

  let paymentMethod =
    extractPaymentMethod(
      restaurantText
    );

  if (
    !paymentMethod &&
    platformPage
  ) {
    paymentMethod =
      extractPaymentMethod(
        platformPage.text
      );
  }

  // ------------------------------------------
  // Restaurant invoice total
  // ------------------------------------------

  const restaurantTotal =
    extractRestaurantTotal(
      restaurantText
    );

  // ------------------------------------------
  // Platform invoice total
  // ------------------------------------------

  const platformTotal =
    platformPage
      ? extractPlatformTotal(
          platformPage.text
        )
      : null;

  // ------------------------------------------
  // Platform charges
  // ------------------------------------------

  const charges =
    platformPage
      ? extractPlatformCharges(
          platformPage.text
        )
      : [];

  // ------------------------------------------
  // Combined amount
  //
  // Restaurant invoice:
  // ₹204.75
  //
  // Platform invoice:
  // ₹9.44
  //
  // Combined:
  // ₹214.19
  // ------------------------------------------

  let amount = "";

  if (
    restaurantTotal !== null &&
    platformTotal !== null
  ) {
    amount = (
      restaurantTotal +
      platformTotal
    ).toFixed(2);
  } else if (
    restaurantTotal !== null
  ) {
    amount =
      restaurantTotal.toFixed(2);
  } else if (
    platformTotal !== null
  ) {
    amount =
      platformTotal.toFixed(2);
  }

  // ------------------------------------------
  // Product name summary
  // ------------------------------------------

  const productName =
    products.length > 0
      ? products
          .map(
            (product) =>
              product.productName
          )
          .join(", ")
      : "";

  // ------------------------------------------
  // Confidence
  // ------------------------------------------

  const confidence =
    calculateConfidence({
      restaurantPage,
      platformPage,
      restaurantName: storeName,
      products,
      purchaseDate,
      restaurantTotal,
      platformTotal,
    });

  // ------------------------------------------
  // Final normalized result
  // ------------------------------------------

  return {
    storeName,

    productName,

    products,

    purchaseDate,

    amount,

    paymentMethod,

    category: "Food",

    confidence,

    charges,

    metadata: {
      restaurantInvoiceTotal:
        restaurantTotal !== null
          ? restaurantTotal.toFixed(2)
          : "",

      platformInvoiceTotal:
        platformTotal !== null
          ? platformTotal.toFixed(2)
          : "",

      restaurantPage:
        restaurantPage?.pageNumber ||
        null,

      platformPage:
        platformPage?.pageNumber ||
        null,
    },
  };
}


// ==========================================
// Default export
// ==========================================

export default parseZomatoPages;
const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const vision = require("@google-cloud/vision");
const path = require("path");
const {GoogleGenAI} = require("@google/genai");

// ==========================================
// Firebase Admin
// ==========================================

initializeApp();

const adminAuth = getAuth();
const db = getFirestore();

// ==========================================
// Existing Vision OCR setup
// ==========================================

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, "billvora-vision.json"),
});

// ==========================================
// Gemini secret
// ==========================================

const geminiApiKey = defineSecret("GEMINI_API_KEY");

// ==========================================
// Spending Intelligence Helpers
// ==========================================

/**
 * Checks whether a value uses YYYY-MM-DD format.
 *
 * @param {string} value - Date value to validate.
 * @return {boolean} Whether the value is a valid date string.
 */
function isValidDate(value) {
  if (!value || typeof value !== "string") {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Converts a receipt amount into a safe numeric value.
 *
 * @param {number|string} value - Receipt amount.
 * @return {number} Parsed amount or zero.
 */
function parseAmount(value) {
  const amount = Number(value);

  return Number.isFinite(amount) ? amount : 0;
}

/**
 * Returns the current server date in YYYY-MM-DD format.
 *
 * @return {string} Current server date.
 */
function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Calculates overall spending statistics for receipts.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @return {Object} Spending summary.
 */
function calculateSpending(receipts) {
  const validReceipts = receipts.filter(
      (receipt) => isValidDate(receipt.purchaseDate),
  );

  const total = validReceipts.reduce(
      (sum, receipt) => sum + parseAmount(receipt.amount),
      0,
  );

  const highestPurchase = validReceipts.reduce(
      (highest, receipt) => {
        if (
          !highest ||
          parseAmount(receipt.amount) >
            parseAmount(highest.amount)
        ) {
          return receipt;
        }

        return highest;
      },
      null,
  );

  return {
    total: Number(total.toFixed(2)),
    purchaseCount: validReceipts.length,
    highestPurchase,
  };
}

/**
 * Filters receipts by a purchase-date range.
 *
 * The start date is inclusive and the end date is exclusive.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {string} startDate - Inclusive start date.
 * @param {string} endDate - Exclusive end date.
 * @return {Array<Object>} Receipts within the date range.
 */
function filterReceiptsByDateRange(
    receipts,
    startDate,
    endDate,
) {
  return receipts.filter((receipt) => {
    const purchaseDate = receipt.purchaseDate;

    if (!isValidDate(purchaseDate)) {
      return false;
    }

    return (
      purchaseDate >= startDate &&
      purchaseDate < endDate
    );
  });
}

/**
 * Calculates the first day of the next month.
 *
 * @param {string} currentDate - Current date in YYYY-MM-DD format.
 * @return {string} First day of the next month.
 */
function getNextMonthStart(currentDate) {
  const year = Number(currentDate.slice(0, 4));
  const month = Number(currentDate.slice(5, 7));

  const nextMonthDate = new Date(
      Date.UTC(year, month, 1),
  );

  const nextYear = nextMonthDate.getUTCFullYear();

  const nextMonth = String(
      nextMonthDate.getUTCMonth() + 1,
  ).padStart(2, "0");

  return `${nextYear}-${nextMonth}-01`;
}

/**
 * Resolves a natural-language spending period into a date range.
 *
 * The start date is inclusive and the end date is exclusive.
 *
 * @param {string} message - User's spending question.
 * @param {Date} now - Current server date.
 * @return {Object|null} Resolved date range or null.
 */
function resolveSpendingDateRange(message, now = new Date()) {
  if (!message || typeof message !== "string") {
    return null;
  }

  const text = message.trim().toLowerCase();

  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  // ==========================================
  // This month
  // ==========================================

  if (
    /\bthis month\b/.test(text) ||
    /\bis month\b/.test(text) ||
    /\biss month\b/.test(text) ||
    /\bis mahine\b/.test(text) ||
    /\biss mahine\b/.test(text)
  ) {
    const start = new Date(
        Date.UTC(currentYear, currentMonth, 1),
    );

    const end = new Date(
        Date.UTC(currentYear, currentMonth + 1, 1),
    );

    return {
      label: `this month (${start.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      })} ${currentYear})`,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }

  // ==========================================
  // Last month
  // ==========================================

  if (
    /\blast month\b/.test(text) ||
    /\bpichle month\b/.test(text) ||
    /\bpichhle month\b/.test(text) ||
    /\bpichle mahine\b/.test(text) ||
    /\bpichhle mahine\b/.test(text)
  ) {
    const start = new Date(
        Date.UTC(currentYear, currentMonth - 1, 1),
    );

    const end = new Date(
        Date.UTC(currentYear, currentMonth, 1),
    );

    const monthName = start.toLocaleString("en-US", {
      month: "long",
      timeZone: "UTC",
    });

    return {
      label: `last month (${monthName} ${start.getUTCFullYear()})`,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }

  // ==========================================
  // Named months
  // ==========================================

  const months = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    sept: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };

  const monthPattern = new RegExp(
      "\\b(january|jan|february|feb|march|mar|april|apr|may|" +
      "june|jun|july|jul|august|aug|september|sep|sept|" +
      "october|oct|november|nov|december|dec)" +
      "(?:\\s+(\\d{4}))?\\b",
      "i",
  );

  const match = text.match(monthPattern);

  if (match) {
    const monthName = match[1].toLowerCase();
    const monthIndex = months[monthName];

    const requestedYear = match[2] ?
      Number(match[2]) :
      currentYear;

    if (
      Number.isInteger(monthIndex) &&
      Number.isInteger(requestedYear)
    ) {
      const start = new Date(
          Date.UTC(requestedYear, monthIndex, 1),
      );

      const end = new Date(
          Date.UTC(requestedYear, monthIndex + 1, 1),
      );

      const displayMonth = start.toLocaleString("en-US", {
        month: "long",
        timeZone: "UTC",
      });

      return {
        label: `${displayMonth} ${requestedYear}`,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
      };
    }
  }

  return null;
}

/**
 * Calculates spending for a specific date range.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {Object} dateRange - Date range.
 * @return {Object} Spending result.
 */
function calculateSpendingForDateRange(receipts, dateRange) {
  if (!dateRange) {
    return {
      total: 0,
      purchaseCount: 0,
      highestPurchase: null,
    };
  }

  const filteredReceipts = filterReceiptsByDateRange(
      receipts,
      dateRange.startDate,
      dateRange.endDate,
  );

  const total = filteredReceipts.reduce(
      (sum, receipt) => sum + parseAmount(receipt.amount),
      0,
  );

  const highestPurchase = filteredReceipts.reduce(
      (highest, receipt) => {
        if (
          !highest ||
          parseAmount(receipt.amount) >
            parseAmount(highest.amount)
        ) {
          return receipt;
        }

        return highest;
      },
      null,
  );

  return {
    total: Number(total.toFixed(2)),
    purchaseCount: filteredReceipts.length,
    highestPurchase,
  };
}

// ==========================================
// Category Intelligence Helpers
// ==========================================

/**
 * Filters receipts by category.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {string} category - Category to match.
 * @return {Array<Object>} Matching receipts.
 */
function filterReceiptsByCategory(receipts, category) {
  const normalizedCategory =
    category.trim().toLowerCase();

  return receipts.filter((receipt) => {
    const receiptCategory =
      typeof receipt.category === "string" ?
        receipt.category.trim().toLowerCase() :
        "";

    return receiptCategory === normalizedCategory;
  });
}

/**
 * Calculates spending for a category.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {string} category - Category to calculate.
 * @return {Object} Category spending result.
 */
function calculateCategorySpending(receipts, category) {
  const filteredReceipts =
    filterReceiptsByCategory(
        receipts,
        category,
    );

  return calculateSpending(filteredReceipts);
}

/**
 * Resolves a known Billvora category from a user message.
 *
 * @param {string} message - User's question.
 * @return {string|null} Detected category.
 */
function resolveSpendingCategory(message) {
  if (!message || typeof message !== "string") {
    return null;
  }

  const text = message.trim().toLowerCase();

  const categoryAliases = {
    Fashion: [
      "fashion",
      "clothing",
      "clothes",
      "apparel",
      "dress",
    ],

    Electronics: [
      "electronics",
      "electronic",
      "electronical",
      "electoronic",
      "electornic",
      "electronic item",
      "electronics item",
      "gadget",
      "gadgets",
    ],

    Grocery: [
      "grocery",
      "groceries",
      "grocery shopping",
      "kirana",
    ],

    Home: [
      "home",
      "household",
      "home items",
      "household items",
    ],

    Beauty: [
      "beauty",
      "cosmetics",
      "cosmetic",
      "makeup",
    ],

    Health: [
      "health",
      "medical",
      "medicine",
      "medicines",
    ],

    Travel: [
      "travel",
      "travelling",
      "trip",
    ],

    Food: [
      "food",
      "restaurant",
      "restaurants",
      "dining",
    ],

    Shopping: [
      "shopping",
      "shopping items",
    ],

    Other: [
      "other",
      "others",
    ],
  };

  for (const [category, aliases] of Object.entries(
      categoryAliases,
  )) {
    for (const alias of aliases) {
      if (text.includes(alias)) {
        return category;
      }
    }
  }

  return null;
}

// ==========================================
// Merchant Intelligence
// ==========================================

/**
 * Aggregates spending by merchant/store.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @return {Array<Object>} Merchant spending summary.
 */
function calculateMerchantSpending(receipts) {
  const merchantMap = {};

  receipts.forEach((receipt) => {
    const storeName =
      typeof receipt.storeName === "string" ?
        receipt.storeName.trim() :
        "";

    if (!storeName) {
      return;
    }

    const normalizedStore = storeName.toLowerCase();

    if (!merchantMap[normalizedStore]) {
      merchantMap[normalizedStore] = {
        storeName,
        total: 0,
        purchaseCount: 0,
        highestPurchase: null,
      };
    }

    const merchant = merchantMap[normalizedStore];
    const amount = parseAmount(receipt.amount);

    merchant.total += amount;
    merchant.purchaseCount += 1;

    if (
      !merchant.highestPurchase ||
      amount >
        parseAmount(merchant.highestPurchase.amount)
    ) {
      merchant.highestPurchase = receipt;
    }
  });

  return Object.values(merchantMap)
      .map((merchant) => ({
        ...merchant,
        total: Number(merchant.total.toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total);
}

/**
 * Finds a merchant mentioned by the user.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {string} message - User's question.
 * @return {string|null} Matching merchant name.
 */
function resolveMerchantQuery(receipts, message) {
  if (!message || typeof message !== "string") {
    return null;
  }

  const text = message.trim().toLowerCase();

  const merchants = [
    ...new Set(
        receipts
            .map((receipt) => receipt.storeName)
            .filter(
                (storeName) =>
                  typeof storeName === "string" &&
                  storeName.trim(),
            ),
    ),
  ];

  merchants.sort(
      (a, b) => b.length - a.length,
  );

  for (const merchant of merchants) {
    if (
      text.includes(
          merchant.trim().toLowerCase(),
      )
    ) {
      return merchant;
    }
  }

  return null;
}

/**
 * Returns merchant-specific spending information.
 *
 * @param {Array<Object>} receipts - User receipt records.
 * @param {string} merchantName - Merchant name.
 * @return {Object|null} Merchant spending result.
 */
function getMerchantSpending(
    receipts,
    merchantName,
) {
  if (!merchantName) {
    return null;
  }

  const normalizedMerchant =
    merchantName.trim().toLowerCase();

  const merchantReceipts = receipts.filter(
      (receipt) =>
        typeof receipt.storeName === "string" &&
        receipt.storeName.trim().toLowerCase() ===
          normalizedMerchant,
  );

  if (merchantReceipts.length === 0) {
    return null;
  }

  const total = merchantReceipts.reduce(
      (sum, receipt) =>
        sum + parseAmount(receipt.amount),
      0,
  );

  const highestPurchase =
    merchantReceipts.reduce(
        (highest, receipt) => {
          if (
            !highest ||
            parseAmount(receipt.amount) >
              parseAmount(highest.amount)
          ) {
            return receipt;
          }

          return highest;
        },
        null,
    );

  return {
    storeName:
      merchantReceipts[0].storeName,
    total: Number(total.toFixed(2)),
    purchaseCount: merchantReceipts.length,
    highestPurchase,
  };
}

/**
 * Checks whether the user is asking for merchant ranking.
 *
 * @param {string} message - User's question.
 * @return {boolean} Whether this is a top-merchant question.
 */
function isMerchantRankingQuestion(message) {
  if (!message || typeof message !== "string") {
    return false;
  }

  const text = message.trim().toLowerCase();

  const rankingWords = [
    "top",
    "highest",
    "maximum",
    "most",
    "sabse zyada",
    "zyada",
  ];

  const merchantWords = [
    "store",
    "stores",
    "merchant",
    "merchants",
    "seller",
    "sellers",
    "shop",
    "shops",
    "dukaan",
    "dukaan par",
  ];

  const hasRankingWord = rankingWords.some(
      (word) => text.includes(word),
  );

  const hasMerchantWord = merchantWords.some(
      (word) => text.includes(word),
  );

  return hasRankingWord && hasMerchantWord;
}

/**
 * Detects whether the user wants multiple top merchants.
 *
 * @param {string} message - User's question.
 * @return {number} Requested merchant count.
 */
function getRequestedMerchantCount(message) {
  if (!message || typeof message !== "string") {
    return 1;
  }

  const text = message.trim().toLowerCase();

  const numberMatch = text.match(
      /\b(?:top|first)\s+(\d+)\b/,
  );

  if (numberMatch) {
    const count = Number(numberMatch[1]);

    if (Number.isInteger(count) && count > 0) {
      return Math.min(count, 10);
    }
  }

  if (
    text.includes("top 3") ||
    text.includes("three stores") ||
    text.includes("3 stores")
  ) {
    return 3;
  }

  return 1;
}

// ==========================================
// Existing OCR function — unchanged
// ==========================================

exports.ocrReceipt = onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    const {imageBase64} = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        error: "Missing imageBase64",
      });
    }

    const [result] = await client.documentTextDetection({
      image: {
        content: imageBase64,
      },
    });

    const text = result.fullTextAnnotation ?
      result.fullTextAnnotation.text :
      "";

    return res.json({
      success: true,
      text,
    });
  } catch (error) {
    console.error("OCR Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==========================================
// Ask Billvora AI assistant
// ==========================================

exports.askBillvora = onRequest(
    {
      secrets: [geminiApiKey],
    },
    async (req, res) => {
      // ==========================================
      // CORS
      // ==========================================

      res.set("Access-Control-Allow-Origin", "*");
      res.set(
          "Access-Control-Allow-Methods",
          "POST, OPTIONS",
      );
      res.set(
          "Access-Control-Allow-Headers",
          "Content-Type, Authorization",
      );

      // ==========================================
      // Browser preflight
      // ==========================================

      if (req.method === "OPTIONS") {
        return res.status(204).send("");
      }

      try {
        // ==========================================
        // Request method
        // ==========================================

        if (req.method !== "POST") {
          return res.status(405).json({
            success: false,
            error: "Method not allowed",
          });
        }

        // ==========================================
        // Firebase Authentication
        // ==========================================

        const authorization = req.get("Authorization");

        if (
          !authorization ||
          !authorization.startsWith("Bearer ")
        ) {
          return res.status(401).json({
            success: false,
            error: "Authentication required.",
          });
        }

        const idToken = authorization.split("Bearer ")[1];

        if (!idToken) {
          return res.status(401).json({
            success: false,
            error: "Invalid authentication token.",
          });
        }

        const decodedToken =
          await adminAuth.verifyIdToken(idToken);

        const userId = decodedToken.uid;

        // ==========================================
        // Validate message
        // ==========================================

        const {message} = req.body || {};

        if (!message || typeof message !== "string") {
          return res.status(400).json({
            success: false,
            error: "Message is required.",
          });
        }

        const trimmedMessage = message.trim();

        if (!trimmedMessage) {
          return res.status(400).json({
            success: false,
            error: "Message cannot be empty.",
          });
        }

        if (trimmedMessage.length > 2000) {
          return res.status(400).json({
            success: false,
            error: "Message is too long.",
          });
        }

        // ==========================================
        // Fetch ONLY current user's receipts
        // ==========================================

        const receiptsSnapshot = await db
            .collection("receipts")
            .where("userId", "==", userId)
            .get();

        // ==========================================
        // Fetch ONLY current user's warranties
        // ==========================================

        const warrantiesSnapshot = await db
            .collection("warranties")
            .where("userId", "==", userId)
            .get();

        // ==========================================
        // Build safe receipt context
        // ==========================================

        const receipts = receiptsSnapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            productName: data.productName || "",
            storeName: data.storeName || "",
            purchaseDate: data.purchaseDate || "",
            amount: Number(data.amount || 0),
            category: data.category || "",
            paymentMethod: data.paymentMethod || "",
            platform: data.platform || "",
            returnTracking: Boolean(data.returnTracking),
            returnType: data.returnType || "",
            returnDurationDays:
              Number(data.returnDurationDays || 0),
            returnStartDate: data.returnStartDate || "",
            returnEndDate: data.returnEndDate || "",
          };
        });

        // ==========================================
        // Build safe warranty context
        // ==========================================

        const currentDate = getCurrentDate();

        const warranties =
          warrantiesSnapshot.docs.map((doc) => {
            const data = doc.data();
            const expiryDate = data.expiryDate || "";

            let expiryStatus = "unknown";
            let daysRemaining = null;

            if (expiryDate) {
              const todayMs = Date.parse(
                  `${currentDate}T00:00:00Z`,
              );

              const expiryMs = Date.parse(
                  `${expiryDate}T00:00:00Z`,
              );

              if (!Number.isNaN(expiryMs)) {
                daysRemaining = Math.round(
                    (expiryMs - todayMs) /
                    (1000 * 60 * 60 * 24),
                );

                if (daysRemaining < 0) {
                  expiryStatus = "expired";
                } else if (daysRemaining === 0) {
                  expiryStatus = "expires_today";
                } else {
                  expiryStatus = "active";
                }
              }
            }

            return {
              productName: data.productName || "",
              storeName: data.storeName || "",
              category: data.category || "",
              purchaseDate: data.purchaseDate || "",
              warrantyDuration:
                data.warrantyDuration || "",
              expiryDate,
              expiryStatus,
              daysRemaining,
            };
          });

        // ==========================================
        // Overall Spending Intelligence
        // ==========================================

        const spendingSummary =
          calculateSpending(receipts);

        // ==========================================
        // Current month spending
        // ==========================================

        const currentMonthStart =
          `${currentDate.slice(0, 8)}01`;

        const nextMonthStart =
          getNextMonthStart(currentDate);

        const currentMonthReceipts =
          filterReceiptsByDateRange(
              receipts,
              currentMonthStart,
              nextMonthStart,
          );

        const currentMonthSpending =
          calculateSpending(currentMonthReceipts);

        // ==========================================
        // Natural-language spending date range
        // ==========================================

        const spendingDateRange =
          resolveSpendingDateRange(trimmedMessage);

        const spendingAnalysis =
          spendingDateRange ?
            calculateSpendingForDateRange(
                receipts,
                spendingDateRange,
            ) :
            null;

        // ==========================================
        // Category Intelligence
        // ==========================================

        const spendingCategory =
          resolveSpendingCategory(trimmedMessage);

        const categorySpending =
          spendingCategory ?
            calculateCategorySpending(
                receipts,
                spendingCategory,
            ) :
            null;

        // ==========================================
        // Merchant Intelligence
        // ==========================================

        const merchantSpending =
          calculateMerchantSpending(receipts);

        const merchantQuery =
          resolveMerchantQuery(
              receipts,
              trimmedMessage,
          );

        const merchantResult =
          merchantQuery ?
            getMerchantSpending(
                receipts,
                merchantQuery,
            ) :
            null;

        const merchantRankingQuestion =
          isMerchantRankingQuestion(
              trimmedMessage,
          );

        const requestedMerchantCount =
          merchantRankingQuestion ?
            getRequestedMerchantCount(
                trimmedMessage,
            ) :
            1;

        const topMerchants =
          merchantSpending.slice(
              0,
              requestedMerchantCount,
          );

        // ==========================================
        // AI context
        // ==========================================

        const context = {
          currentDate,
          spendingSummary,
          currentMonthSpending,
          spendingDateRange,
          spendingAnalysis,
          spendingCategory,
          categorySpending,
          merchantSpending,
          merchantQuery,
          merchantResult,
          merchantRankingQuestion,
          requestedMerchantCount,
          topMerchants,
          receipts,
          warranties,
        };

        // ==========================================
        // AI system instruction
        // ==========================================

        const systemInstruction = `
You are Ask Billvora, the personal purchase intelligence
assistant inside Billvora.

You are answering questions using the user's private Billvora
purchase data provided in the context below.

IMPORTANT RULES:

1. Only use the provided Billvora context for personal purchase,
   receipt, warranty, return-window, spending, and shopping-history
   questions.

2. Never claim to know personal purchase information that is not
   present in the provided context.

3. Never invent receipt, warranty, amount, date, store, category,
   or product information.

4. If the provided context does not contain the requested
   information, clearly say that the information is not available
   in the user's Billvora data.

5. Treat the provided data as belonging only to the currently
   authenticated Billvora user.

6. Do not reveal internal implementation details, authentication
   tokens, API keys, secrets, database credentials, or security
   information.

7. For overall spending questions, use spendingSummary.

8. For current-month spending questions, use currentMonthSpending.

9. When spendingDateRange is present, spendingAnalysis is the
   authoritative server-side calculation for that requested period.

10. Never recalculate, guess, estimate, or invent a spending total
    when spendingAnalysis is available.

11. For spending period questions, use:
    - spendingAnalysis.total
    - spendingAnalysis.purchaseCount
    - spendingAnalysis.highestPurchase
    as the authoritative result.

12. If spendingAnalysis is null, do not assume a date range that
    was not detected.

13. If spendingAnalysis.purchaseCount is 0, clearly say that there
    are no purchases recorded for that period.

14. When spendingCategory is present, categorySpending is the
    authoritative server-side calculation for that category.

15. Never guess or estimate category spending.

16. For category spending questions, use the exact total,
    purchase count, and highest purchase from categorySpending.

17. If categorySpending.purchaseCount is 0, clearly say that no
    purchases were found for that category.

18. For warranty questions, use the warranty data provided in the
    context.

19. The warranty expiryStatus and daysRemaining fields are
    calculated server-side and must be treated as authoritative.

20. If expiryStatus is "expired", clearly say that the warranty
    has already expired.

21. If expiryStatus is "expires_today", clearly say that the
    warranty expires today.

22. If expiryStatus is "active", use daysRemaining to describe
    how many days remain when relevant.

23. If expiryStatus is "unknown", do not guess the warranty status.

24. For return-window questions, use the receipt return fields
    provided in the context.

25. For a specific merchant/store question, use merchantResult
    when merchantQuery is present.

26. merchantResult is the authoritative server-side calculation
    for a specific merchant.

27. Never calculate, guess, estimate, or invent merchant totals
    when merchantResult is available.

28. For top merchant questions, use topMerchants.

29. topMerchants is already sorted by total spending from highest
    to lowest.

30. If the user asks for the top merchant, use the first item in
    topMerchants.

31. If the user asks for multiple top merchants, use the items
    already provided in topMerchants in their existing order.

32. If merchantSpending is empty, clearly say that no merchant
    spending data is available.

33. Never reveal internal Firestore document IDs or receipt IDs.

34. Preserve the actual storeName from Billvora data.

35. Do not invent, rename, or alter merchant names.

36. You can answer general knowledge questions normally, even when
    they are unrelated to Billvora purchases.

37. Be concise, friendly, and helpful.

Billvora user data context:
${JSON.stringify(context)}
`;

        // ==========================================
        // Gemini
        // ==========================================

        const ai = new GoogleGenAI({
          apiKey: geminiApiKey.value(),
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text:
                    `${systemInstruction}\n\n` +
                    `User question:\n${trimmedMessage}`,
                },
              ],
            },
          ],
        });

        return res.status(200).json({
          success: true,
          message: response.text ||
            "I couldn't generate a response.",
        });
      } catch (error) {
        console.error("Ask Billvora Error:", error);

        // ==========================================
        // Authentication errors
        // ==========================================

        if (error.code === "auth/id-token-expired") {
          return res.status(401).json({
            success: false,
            error:
              "Your session has expired. Please sign in again.",
          });
        }

        if (error.code === "auth/argument-error") {
          return res.status(401).json({
            success: false,
            error: "Invalid authentication token.",
          });
        }

        // ==========================================
        // Generic error
        // ==========================================

        return res.status(500).json({
          success: false,
          error: "Unable to get a response from Billvora.",
        });
      }
    },
);

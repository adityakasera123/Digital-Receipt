// src/parsers/genericParser.js

import { normalizeOCRDate } from "../utils/dateUtils";
import { normalizeAmount } from "../utils/amountUtils";

/*
 * Billvora Generic Receipt Parser
 * --------------------------------
 * Company-independent parser for invoices that do not have a
 * dedicated Amazon / Flipkart / Myntra parser.
 *
 * Strategy:
 * OCR
 *  ↓
 * Normalize
 *  ↓
 * Detect invoice structure
 *  ↓
 * Extract candidates
 *  ↓
 * Remove obvious noise
 *  ↓
 * Score candidates
 *  ↓
 * Return best result
 */


/* ==========================================================================
   1. BASIC HELPERS
========================================================================== */

function clean(value = "") {
  return String(value)
    .replace(/\u00A0/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function lower(value = "") {
  return clean(value).toLowerCase();
}

function getLines(text = "") {
  return String(text)
    .replace(/\r/g, "")
    .split("\n")
    .map(clean)
    .filter(Boolean);
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function isNumberOnly(value = "") {
  return /^[\d\s,./:#-]+$/.test(clean(value));
}

function looksLikeDate(value = "") {
  return /\b\d{1,4}[./-]\d{1,2}[./-]\d{2,4}\b/.test(value);
}


/* ==========================================================================
   2. LOCATION / ADDRESS
========================================================================== */

function isCommonLocation(value = "") {
  const text = lower(value).trim();

  const locations = [
    "india",
    "delhi",
    "new delhi",
    "mumbai",
    "pune",
    "jaunpur",
    "firozabad",
    "lucknow",
    "kanpur",
    "varanasi",
    "noida",
    "gurgaon",
    "gurugram",
    "bangalore",
    "bengaluru",
    "hyderabad",
    "kolkata",
    "chennai",
    "ahmedabad",
    "surat",
    "maharashtra",
    "uttar pradesh",
    "rajasthan",
    "gujarat",
    "karnataka",
    "telangana",
    "west bengal",
  ];

  // Exact known location
  if (locations.includes(text)) {
    return true;
  }

  // Common address fragments that should
  // never be treated as store names.
  const locationFragments = [
    "pradesh",
    "maharashtra",
    "rajasthan",
    "gujarat",
    "karnataka",
    "telangana",
    "bengal",
  ];

  return locationFragments.includes(text);
}

function isAddress(value = "") {
  const text = lower(value);

  if (!text) {
    return false;
  }

  /*
   * A 6 digit pincode is very strong address evidence.
   */
  if (/\b\d{6}\b/.test(text)) {
    return true;
  }

  const addressPatterns = [
    /\broad\b/,
    /\brd\.?\b/,
    /\bstreet\b/,
    /\blane\b/,
    /\bnagar\b/,
    /\bcolony\b/,
    /\bcomplex\b/,
    /\bmarket\b/,
    /\bbazaar\b/,
    /\bbazar\b/,
    /\bgali\b/,
    /\bbuilding\b/,
    /\bfloor\b/,
    /\bapartment\b/,
    /\bapt\.?\b/,
    /\bsuite\b/,
    /\bpincode\b/,
    /\bpin\s*code\b/,
    /\bmaharashtra\b/,
    /\buttar\s+pradesh\b/,
    /\bdelhi\b/,
    /\bmumbai\b/,
    /\bpune\b/,
    /\bjaunpur\b/,
    /\bfirozabad\b/,
    /\bindia\b/,
  ];

  const count = addressPatterns.filter((pattern) =>
    pattern.test(text)
  ).length;

  const hasNumber = /\b\d{1,5}\b/.test(text);

  if (count >= 2) {
    return true;
  }

  if (count >= 1 && hasNumber) {
    return true;
  }

  return false;
}


/* ==========================================================================
   3. TABLE / FOOTER / PAYMENT NOISE
========================================================================== */

function isTableNoise(value = "") {
  const text = lower(value);

  if (!text) {
    return true;
  }

  const exactHeaders = [
    "sn",
    "s no",
    "sr no",
    "serial no",
    "description",
    "product",
    "product name",
    "item",
    "item name",
    "particulars",
    "hsn",
    "sku",
    "qty",
    "quantity",
    "size",
    "color",
    "gross",
    "gross amount",
    "discount",
    "taxable",
    "taxable value",
    "tax",
    "taxes",
    "total",
    "total amount",
    "rate",
    "price",
    "amount",
    "payment",
    "payment method",
    "product details",
    "details",
    "net units",
  ];

  if (exactHeaders.includes(text)) {
    return true;
  }

  const headerWords = [
    "description",
    "product",
    "hsn",
    "sku",
    "qty",
    "quantity",
    "gross",
    "amount",
    "discount",
    "taxable",
    "value",
    "taxes",
    "total",
    "rate",
    "price",
    "color",
    "size",
    "net",
    "units",
  ];

  const words = text
    .replace(/[|:]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const matches = words.filter((word) =>
    headerWords.includes(word)
  );

  if (matches.length >= 2) {
    return true;
  }

  if (
    /\b(?:gross\s+amount|taxable\s+value|net\s+units|total\s+amount)\b/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

function isFooterNoise(value = "") {
  return /\b(?:terms?\s*(?:&|and)\s*conditions|computer\s+generated|original\s+for|tax\s+is\s+not|reverse\s+charge|customer\s+address|if\s+undelivered|return\s+to)\b/i.test(
    value
  );
}

function isPaymentText(value = "") {
  return /\b(?:cod|c\.?o\.?d\.?|cash\s+on\s+delivery|upi|gpay|google\s*pay|phonepe|paytm|credit\s+card|debit\s+card|net\s+banking|wallet)\b/i.test(
    value
  );
}

function isTaxLine(value = "") {
  const text = clean(value)
    .replace(/[:.]+$/g, "")
    .trim();

  return (
    /^(?:igst|cgst|sgst|gst|cess)$/i.test(text) ||
    /\b(?:igst|cgst|sgst|cess|gst)\b/i.test(text) &&
    /%|\d+(?:\.\d+)?/.test(text)
  );
}


function isProductMetadataLine(value = "") {
  const text = lower(value);
  const words = text.split(/\s+/).filter(Boolean);

  /*
   * Short metadata rows such as:
   *
   * Free Size 1 (One) Multicolor
   * SKU JUC-2
   * Size Free Size
   *
   * must NOT become the product.
   *
   * Important:
   * Long real product descriptions are NOT rejected just
   * because they contain words like size/color.
   */

  if (words.length > 12) {
    return false;
  }

  if (
    /^(?:sku|size|qty|quantity|color|net\s+units?)\b/i.test(
      text
    )
  ) {
    return true;
  }

  const metadataWords =
    /\b(?:sku|size|qty|quantity|color|net\s+units?|free\s+size|multicolor)\b/gi;

  const matches = text.match(metadataWords) || [];

  return matches.length >= 2 && words.length <= 10;
}

function isProductDetailsHeading(value = "") {
  return /^product\s+details\b/i.test(clean(value));
}

function isInvoiceTableHeading(value = "") {
  const text = lower(value);

  return (
    /\b(?:description|particulars|item(?:\s+name)?|product(?:\s+name)?)\b/i.test(
      text
    ) &&
    /\b(?:qty|quantity|hsn|amount|gross|taxable|total|price|rate)\b/i.test(
      text
    )
  );
}

/* ==========================================================================
   4. PERSON NAME DETECTION
========================================================================== */

function looksLikePersonName(value = "") {
  let text = clean(value).replace(
    /^(?:sold\s+by|seller|merchant|customer(?:\s+name)?|bill\s+to|ship\s+to|name)\s*:?\s*/i,
    ""
  );

  if (!text || text.length < 3) {
    return false;
  }

  if (
  isAddress(text) ||
  isNumberOnly(text) ||
  isTableNoise(text)
) {
  return false;
}

/*
 * Strong business evidence must never be classified
 * as a person's name.
 */
if (
  strongBusinessPattern.test(text) ||
  businessTypePattern.test(text)
) {
  return false;
}

const words = text.split(/\s+/);

  if (words.length < 2 || words.length > 5) {
    return false;
  }

  if (
    words.some((word) =>
      /\d/.test(word)
    )
  ) {
    return false;
  }

  return words.every((word) =>
    /^[A-Za-z.'-]+$/.test(word)
  );
}


/* ==========================================================================
   5. BUSINESS NAME DETECTION
========================================================================== */

const strongBusinessPattern =
  /\b(?:pvt\.?\s*ltd\.?|private\s+limited|ltd\.?|limited|llp|inc\.?|incorporated|enterprises?|industries|traders?|trading\s+company|exports?|imports?|wholesale|supermarket|pharmacy|retail\s+store|retail\s+shop|electronics\s+store|jewellery\s+store|jewellers?)\b/i;

const businessTypePattern =
  /\b(?:store|shop|mart|bazaar|bazar|boutique|bakery|bakers|studio|collections?|fashions?|foods?|duniya|bangles|jewellery|jewelry|electronics|garments|clothing|footwear|cosmetics|furniture)\b/i;

function isGenericBusinessWord(value = "") {
  const text = lower(
    clean(value)
  )
    .replace(/[.:]+$/g, "")
    .trim();

  const genericWords = [
    "value",
    "amount",
    "total",
    "invoice",
    "number",
    "date",
    "gst",
    "gstin",
    "gst no",
    "gst number",
    "code",
    "weight",
    "actual",
    "charged",
    "rate",
    "price",
    "paid",
    "copy",
    "name",
    "booking",
    "officer",
    "consignor",
    "consignee",
    "particulars",
    "description",
    "details",
  ];

  return genericWords.includes(
    text
  );
}

function hasStrongMerchantEvidence(
  value = ""
) {
  const text = clean(value);

  return (
    strongBusinessPattern.test(
      text
    ) ||
    /\b(?:logistics|roadways|transport|courier|shipping|trading|retail|mart|shop|store)\b/i.test(
      text
    )
  );
}

function looksLikeBusinessName(value = "") {
  const text = clean(value)
    .split(",")[0]
    .trim();

  if (
    !text ||
    text.length < 3 ||
    text.length > 100
  ) {
    return false;
  }

 if (
  isAddress(text) ||
  isNumberOnly(text) ||
  isTableNoise(text) ||
  isGenericBusinessWord(text) ||
  /^(?:₹|rs\.?)\s*[\d,]+(?:\.\d{1,2})?$/i.test(text)
) {
  return false;
}

  if (
    isFooterNoise(text) ||
    isPaymentText(text) ||
    isCommonLocation(text)
  ) {
    return false;
  }

  if (hasStrongMerchantEvidence(text)) {
    return true;
  }

  if (businessTypePattern.test(text)) {
    return true;
  }

  /*
   * Compact brand-like names:
   *
   * TrendyDuniya
   * Amazon
   * Flipkart
   * Myntra
   *
   * Generic invoice words such as "Value"
   * must not pass through this fallback.
   */
  /*
 * Compact brand-like names:
 *
 * TrendyDuniya
 * Amazon
 * Flipkart
 * Myntra
 *
 * Also allow clean multi-word
 * business / brand names.
 */
if (
  /^[A-Za-z][A-Za-z0-9&.'-]{2,40}$/.test(
    text
  )
) {
  return true;
}

const words =
  text.split(/\s+/).filter(Boolean);

/*
 * Clean multi-word business names
 * are valid even when they don't contain
 * explicit words like Shop / Store / Mart.
 *
 * Example:
 * Apna Billbook
 * Trendy Duniya
 * Vijay Electrical
 */
if (
  words.length >= 2 &&
  words.length <= 4 &&
  words.every((word) =>
    /^[A-Za-z][A-Za-z.'-]*$/.test(word)
  )
) {
  return true;
}

return false;
}


/* ==========================================================================
   6. STORE EXTRACTION
========================================================================== */

function extractStore(text) {
  const lines = getLines(text);
  const candidates = [];

  /*
   * --------------------------------------------------
   * Generic words that can appear near GST / invoice
   * sections but are NOT merchant names.
   * --------------------------------------------------
   */
  const genericStoreWords = new Set([
    "value",
    "amount",
    "total",
    "invoice",
    "number",
    "date",
    "gst",
    "other charges",
"charges",
"discount",
"taxable value",
"taxes",
"hsn",
"qty",
"gross amount",
    "gstin",
    "gst no",
    "gst number",
    "code",
    "weight",
    "actual",
    "charged",
    "rate",
    "price",
    "paid",
    "copy",
    "name",
    "booking",
    "officer",
    "consignor",
    "consignee",
    "particulars",
    "description",
    "details",
    "service tax invoice",
"tax invoice",
"sales invoice",
"retail invoice",
"purchase invoice",
"bill",
"receipt",
"invoice copy",
  ]);

 const isGenericStoreCandidate = (
  value = ""
) => {
  const normalized = lower(
    clean(value)
  )
    .replace(/[.:]+$/g, "")
    .trim();

  /*
   * Generic invoice / table words
   * should never become store names.
   */
  if (
    genericStoreWords.has(
      normalized
    )
  ) {
    return true;
  }

  /*
   * Common OCR / invoice noise.
   */
 if (
  /^(?:p\.?m\.?|s\.?n\.?|sr\.?\s*no\.?|box|item|unit|qty|quantity|price|gst|cgst|sgst|igst|amount|total|tax|rate|service\s+tax\s+invoice|tax\s+invoice|sales\s+invoice|invoice\s+copy|bill|receipt)$/i.test(
    normalized
  )
) {
  return true;
}

  /*
   * Pure numeric / identifier noise.
   */
  if (
    /^\d[\d\s./#:-]*$/.test(
      normalized
    )
  ) {
    return true;
  }

  return false;
};

  const addCandidate = (
    value,
    score,
    source
  ) => {
    const candidate = clean(value)
      .split(",")[0]
      .trim();

    if (!candidate) return;

    /*
     * Never allow generic invoice words
     * to become store names.
     */
    if (
      isGenericStoreCandidate(
        candidate
      )
    ) {
      return;
    }

    if (
      isAddress(candidate) ||
      isNumberOnly(candidate) ||
      isTableNoise(candidate) ||
      isFooterNoise(candidate) ||
      isPaymentText(candidate) ||
      isCommonLocation(candidate)
    ) {
      return;
    }


    /*
     * OCR may split a state/location into
     * separate lines.
     */
    if (
      /^(?:pradesh|uttar|uttarakhand|himachal|bihar|jharkhand|punjab|haryana|rajasthan|madhya|kerala|odisha|assam)$/i.test(
        candidate
      )
    ) {
      return;
    }

    if (
      !looksLikeBusinessName(
        candidate
      )
    ) {
      return;
    }

    /*
     * Strong merchant evidence.
     *
     * Examples:
     * Pvt Ltd
     * Private Limited
     * Logistics
     * Roadways
     * Retail
     * Store
     */
    let finalScore = score;

    if (
      strongBusinessPattern.test(
        candidate
      )
    ) {
      finalScore += 100;
    }

    if (
      businessTypePattern.test(
        candidate
      )
    ) {
      finalScore += 50;
    }

    /*
     * Multi-word names are stronger than
     * isolated one-word candidates.
     */
    const wordCount =
      candidate.split(/\s+/).length;

    if (wordCount >= 2) {
      finalScore += 15;
    }

    if (wordCount >= 3) {
      finalScore += 10;
    }

    candidates.push({
      value: candidate,
      score: finalScore,
      source,
    });
  };

  /*
   * ==================================================
   * 1. EXPLICIT SELLER / MERCHANT CONTEXT
   * ==================================================
   */

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const match =
      lines[i].match(
        /^(?:sold\s*by|seller|merchant|billed\s*from|bill\s*from)\s*:?\s*(.*)$/i
      );

    if (!match) continue;

    const direct =
      clean(match[1]);

    /*
     * Example:
     *
     * Sold By: ABC Retail Pvt Ltd
     */
    if (direct) {
      const directWords =
        direct.split(/\s+/);

      /*
       * If OCR combines person + business,
       * try the strongest business-looking
       * suffix first.
       */
      for (
        let end =
          directWords.length;
        end >= 1;
        end--
      ) {
        const part =
          directWords
            .slice(
              Math.max(
                0,
                end - 5
              ),
              end
            )
            .join(" ");

        if (
          businessTypePattern.test(
            part
          ) ||
          strongBusinessPattern.test(
            part
          )
        ) {
          addCandidate(
            part,
            120,
            "seller-context"
          );

          break;
        }
      }

      /*
       * Normal direct seller/business name.
       */
      /*
 * Normal direct seller/business name.
 *
 * If the direct seller value looks like a
 * person's name, treat it as weak evidence.
 *
 * Example:
 *
 * Sold by: ADITYA KASERA
 * TrendyDuniya
 *
 * We want TrendyDuniya as the merchant/store,
 * not the seller person's name.
 */
const directScore =
  looksLikePersonName(direct)
    ? 35
    : 110;

addCandidate(
  direct,
  directScore,
  "seller-context"
);
    }

    /*
     * ==================================================
     * Seller label may be followed by:
     *
     * Sold by:
     * Peekesh Kumar
     * Mahima Bangles
     *
     * ==================================================
     */

    for (
      let offset = 1;
      offset <= 6;
      offset++
    ) {
      const raw =
        lines[i + offset] ||
        "";

      const candidate =
        clean(raw)
          .split(",")[0]
          .trim();

      if (!candidate) {
        continue;
      }

      if (
        isGenericStoreCandidate(
          candidate
        )
      ) {
        continue;
      }

      /*
 * Invoice metadata must never become
 * a merchant/store candidate.
 *
 * Example:
 * Purchase Order No.
 * Invoice No.
 * Order Date
 * Return Code
 * Destination Code
 */
if (
  /^(?:purchase\s+order|order|invoice|bill|return|destination)\s*(?:no|number|date|code)?\.?\s*:?\s*$/i.test(
    candidate
  )
) {
  continue;
}
if (
  isAddress(candidate) ||
  isNumberOnly(candidate) ||
  isTableNoise(candidate) ||
  isFooterNoise(candidate) ||
  isPaymentText(candidate) ||
  isCommonLocation(candidate)
) {
  continue;
}

if (
  /^(?:pradesh|uttar|uttarakhand|himachal|bihar|jharkhand|punjab|haryana|rajasthan|madhya|kerala|odisha|assam)$/i.test(
    candidate
  )
) {
  continue;
}

      /*
       * Person names are weak evidence.
       * Business names are stronger.
       */
      if (
        looksLikeBusinessName(
          candidate
        )
      ) {
        let score =
          105 - offset * 3;

        if (
          strongBusinessPattern.test(
            candidate
          )
        ) {
          score += 100;
        }

        if (
          businessTypePattern.test(
            candidate
          )
        ) {
          score += 50;
        }

        addCandidate(
          candidate,
          score,
          "near-seller"
        );
      }
    }
  }

  /*
   * ==================================================
   * 2. GSTIN CONTEXT
   * ==================================================
   *
   * Important:
   * Do NOT immediately return the first
   * business-looking candidate.
   *
   * Collect candidates and score them.
   * This prevents:
   *
   * GST No.
   * Value
   *
   * from producing:
   *
   * Store = Value
   * ==================================================
   */

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    if (
      !/\bgstin\b|\bgst\s*(?:no|number)\b/i.test(
        lines[i]
      )
    ) {
      continue;
    }

    const gstCandidates = [];

    for (
      let offset = 1;
      offset <= 6;
      offset++
    ) {
      const candidate =
        clean(
          lines[i - offset] ||
            ""
        )
          .split(",")[0]
          .trim();

      if (!candidate) {
        continue;
      }

      if (
        isGenericStoreCandidate(
          candidate
        )
      ) {
        continue;
      }

      if (
        isAddress(candidate) ||
        isNumberOnly(candidate) ||
        isTableNoise(candidate) ||
        isFooterNoise(candidate) ||
        isPaymentText(candidate) ||
        isCommonLocation(candidate)
      ) {
        continue;
      }

      if (
        !looksLikeBusinessName(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Person names should not beat
       * actual business names.
       */
      if (
        looksLikePersonName(
          candidate
        )
      ) {
        continue;
      }

      let score = 0;

      /*
       * Strong company/legal evidence.
       */
      if (
        strongBusinessPattern.test(
          candidate
        )
      ) {
        score += 200;
      }

      /*
       * Business type evidence.
       */
      if (
        businessTypePattern.test(
          candidate
        )
      ) {
        score += 80;
      }

      /*
       * Industry/business words.
       */
      if (
        /\b(?:logistics|roadways|transport|courier|shipping|trading|retail|mart|shop|store)\b/i.test(
          candidate
        )
      ) {
        score += 60;
      }

      /*
       * Multi-word names are safer.
       */
      const wordCount =
        candidate.split(
          /\s+/
        ).length;

      if (wordCount >= 2) {
        score += 20;
      }

      if (wordCount >= 3) {
        score += 10;
      }

      /*
       * Nearer to GSTIN gets some
       * contextual weight, but NOT enough
       * to override strong business evidence.
       */
      score += Math.max(
        0,
        25 - offset * 3
      );

      gstCandidates.push({
        value: candidate,
        score,
        source:
          "gst-context",
      });
    }

    /*
     * Best GST merchant candidate.
     */
    gstCandidates.sort(
      (a, b) =>
        b.score - a.score ||
        b.value.length -
          a.value.length
    );

    for (
      const candidate of gstCandidates
    ) {
      addCandidate(
        candidate.value,
        candidate.score,
        candidate.source
      );
    }
  }
/*
 * ==================================================
 * 3. TOP-OF-INVOICE BUSINESS CANDIDATES
 * ==================================================
 */

for (
  let i = 0;
  i < Math.min(
    lines.length,
    60
  );
  i++
) {
  const candidate =
    clean(lines[i])
      .split(",")[0]
      .trim();

  if (!candidate) {
    continue;
  }

  /*
 * ==================================================
 * STOP AT PRODUCT / DESCRIPTION TABLE
 * ==================================================
 *
 * Once OCR reaches the product table,
 * lines below it must never be treated
 * as possible store names.
 */

if (
  /^(?:description|particulars|item(?:\s+name)?|product(?:\s+name)?|goods)$/i.test(
    candidate
  )
) {
  break;
}


  /*
   * Generic invoice words should never
   * become store candidates.
   */
  if (
    isGenericStoreCandidate(
      candidate
    )
  ) {
    continue;
  }

  /*
   * ==================================================
   * HARD STOP — TABLE / INVOICE COLUMN HEADERS
   * ==================================================
   *
   * Prevent OCR table headers such as:
   *
   * S.No.
   * Item name
   * HSN/SAC
   * Quantity
   * Unit
   * Price
   * GST
   * Amount
   * Total
   * CGST
   * SGST
   *
   * from being selected as the store.
   */

  if (
    /^(?:s\.?\s*no\.?|serial\s*(?:no\.?|number)|item\s*name|hsn(?:\/|\s*)sac|quantity|qty|unit|price|gst|amount|total|cgst|sgst|igst|tax|taxable\s*amount|tax\s*summary|subtotal|grand\s*total|paid\s*amount)$/i.test(
      candidate
    )
  ) {
    continue;
  }

  /*
   * Skip obvious invoice metadata labels.
   */
  if (
  /^(?:date|time|invoice\s+date|order\s+date|bill\s*(?:no|number|date)|invoice\s*(?:no|number|date)|purchase\s+order\s*(?:no|number|date)|order\s*(?:no|number|date)|payment\s*(?:method|status)|order\s*status|customer\s*type|created\s*by|terms?\s*(?:&|and)\s*conditions?)\s*:?\s*$/i.test(
    candidate
  )
) {
  continue;
}
  /*
   * Avoid pure numeric / identifier candidates.
   */
  if (
    /^\d[\d\s./#:-]*$/.test(
      candidate
    )
  ) {
    continue;
  }

  /*
   * Add genuine business-looking candidate.
   */
  addCandidate(
    candidate,
    45 -
      Math.min(i, 20),
    "top-invoice"
  );
}
  /*
 * ==================================================
 * BEST MERCHANT
 * ==================================================
 *
 * Prefer merchant evidence by SOURCE.
 *
 * Seller-context is stronger than generic
 * top-of-invoice text because OCR often places
 * addresses, product descriptions and random
 * invoice text near the top.
 */

const SOURCE_PRIORITY = {
  "seller-context": 3,
  "near-seller": 3,
  "gst-context": 2,
  "top-invoice": 1,
};

candidates.sort(
  (a, b) => {
    const sourceA =
      SOURCE_PRIORITY[a.source] || 0;

    const sourceB =
      SOURCE_PRIORITY[b.source] || 0;

    /*
     * 1. Prefer stronger merchant context.
     */
    if (
      sourceA !== sourceB
    ) {
      return sourceB - sourceA;
    }

    /*
     * 2. Within the same source,
     * prefer higher score.
     */
    if (
      b.score !== a.score
    ) {
      return b.score - a.score;
    }

    /*
     * 3. Final tie-breaker:
     * prefer the more descriptive value.
     */
    return (
      b.value.length -
      a.value.length
    );
  }
);

const winner =
  candidates[0];

console.log(
  "========== STORE EXTRACTION =========="
);

console.log(
  "Store Candidates:",
  candidates
);

console.log(
  "Selected Store:",
  winner?.value ||
    "Unknown"
);

console.log(
  "Store Source:",
  winner?.source ||
    "none"
);

  console.log(
    "========== STORE EXTRACTION =========="
  );

  console.log(
    "Store Candidates:",
    candidates
  );

  console.log(
    "Selected Store:",
    winner?.value ||
      "Unknown"
  );

  console.log(
    "Store Source:",
    winner?.source ||
      "none"
  );

  console.log(
    "======================================"
  );

  return (
    winner?.value ||
    "Unknown"
  );
}


/* ==========================================================================
   7. TABLE SECTION DETECTION
========================================================================== */

function findSectionRange(lines, startPattern, endPattern) {
  const start = lines.findIndex((line) =>
    startPattern.test(line)
  );

  if (start === -1) {
    return null;
  }

  let end = lines.length;

  for (let i = start + 1; i < lines.length; i++) {
    if (endPattern.test(lines[i])) {
      end = i;
      break;
    }
  }

  return {
    start,
    end,
  };
}

function findProductDetailsSection(lines) {
  return findSectionRange(
    lines,
    /^product\s+details\b/i,
    /^(?:tax\s+invoice|invoice\s+details|bill\s+details)\b/i
  );
}

function scoreTableHeader(text) {
  const value = lower(text);

  let score = 0;

  if (
    /\bdescription\b|\bparticulars\b/.test(
      value
    )
  ) {
    score += 8;
  }

  if (
    /\bitem(?:\s+name)?\b/.test(
      value
    )
  ) {
    score += 7;
  }

  if (
    /\bproduct(?:\s+name)?\b/.test(
      value
    )
  ) {
    score += 7;
  }

  if (
    /\bqty\b|\bquantity\b/.test(
      value
    )
  ) {
    score += 4;
  }

  if (
    /\bhsn\b/.test(value)
  ) {
    score += 3;
  }

  if (
    /\bgross\s+amount\b|\bamount\b/.test(
      value
    )
  ) {
    score += 3;
  }

  if (
    /\btaxable\s+value\b|\btaxable\b/.test(
      value
    )
  ) {
    score += 2;
  }

  if (
    /\bdiscount\b/.test(value)
  ) {
    score += 1;
  }

  if (
    /\btaxes?\b/.test(value)
  ) {
    score += 1;
  }

  if (
    /\btotal\b/.test(value)
  ) {
    score += 2;
  }

  if (
    /\brate\b|\bprice\b/.test(value)
  ) {
    score += 1;
  }

  return score;
}

function findDescriptionTable(
  lines,
  excludedRange = null
) {
  let best = null;

  const isHeaderLine = (value = "") => {
    const text = lower(value);

    return (
      /^(?:s\.?\s*no\.?|serial\s*(?:no|number)?)$/i.test(text) ||
      /^(?:description|particulars|item|item\s+name|product|product\s+name)$/i.test(text) ||
      /^(?:hsn|hsn\/\s*sac|sku)$/i.test(text) ||
      /^(?:qty|quantity)$/i.test(text) ||
      /^(?:unit|uom)$/i.test(text) ||
      /^(?:price|unit\s+price|rate)$/i.test(text) ||
      /^(?:gst|tax|taxes)$/i.test(text) ||
      /^(?:amount|gross\s+amount|total\s+amount)$/i.test(text)
    );
  };

  const isSummaryLine = (value = "") => {
    const text = lower(value);

    return (
      /^(?:tax\s+summary|item\s+total|subtotal|sub\s+total|tax\s+amount|total\s+tax|grand\s+total|paid\s+amount|round\s+off)$/i.test(
        text
      ) ||
      /^hsn\s+code\s+tax/i.test(text)
    );
  };

  const isLikelyProductRow = (value = "") => {
    const text = cleanProductCandidate(value);

    if (!text) {
      return false;
    }

    if (
      isSummaryLine(text) ||
      isNumberOnly(text) ||
      isLikelyNumericRow(text) ||
      isTaxLine(text) ||
      isTableNoise(text) ||
      isPaymentText(text) ||
      isFooterNoise(text) ||
      isAddress(text)
    ) {
      return false;
    }

    return (
      /[A-Za-z]/.test(text) &&
      text.length >= 2 &&
      text.length <= 250
    );
  };

  for (let i = 0; i < lines.length; i++) {
    if (
      excludedRange &&
      i >= excludedRange.start &&
      i < excludedRange.end
    ) {
      continue;
    }

    /*
     * Ignore obvious invoice-summary sections.
     */
    if (isSummaryLine(lines[i])) {
      continue;
    }

    /*
     * Build a contiguous header block.
     *
     * Example:
     *
     * S.No.
     * Item name
     * HSN/SAC
     * Quantity
     * Unit
     * Price
     * GST
     * Amount
     */
    const headerLines = [];

    let j = i;

    while (
      j < lines.length &&
      j < i + 12
    ) {
      const line = clean(lines[j]);

      if (!line) {
        j++;
        continue;
      }

      if (isSummaryLine(line)) {
        break;
      }

      if (isHeaderLine(line)) {
        headerLines.push(line);
        j++;
        continue;
      }

      /*
       * Header block has ended.
       */
      break;
    }

    if (
      headerLines.length < 2
    ) {
      continue;
    }

    const headerText =
      headerLines.join(" ");

    const headerScore =
      scoreTableHeader(headerText);

    /*
     * Must contain an actual product/item
     * description concept.
     */
    if (
      !/\b(?:description|particulars|item|product)\b/i.test(
        headerText
      )
    ) {
      continue;
    }

    /*
     * Require at least two useful
     * invoice columns besides the
     * description itself.
     */
    let columnEvidence = 0;

    if (/\b(?:hsn|sku)\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (/\b(?:qty|quantity)\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (/\b(?:unit|uom)\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (/\b(?:price|rate)\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (/\b(?:gst|tax|taxes)\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (/\bamount\b/i.test(headerText)) {
      columnEvidence++;
    }

    if (columnEvidence < 2) {
      continue;
    }

    /*
     * Find a real product-like row
     * immediately after the header.
     */
    let productRowIndex = -1;

    for (
      let k = j;
      k < Math.min(
        lines.length,
        j + 8
      );
      k++
    ) {
      const candidate =
        cleanProductCandidate(
          lines[k]
        );

      if (!candidate) {
        continue;
      }

      if (isSummaryLine(candidate)) {
        break;
      }

      if (
        isLikelyProductRow(
          candidate
        )
      ) {
        productRowIndex = k;
        break;
      }
    }

    /*
     * A table without a plausible
     * product row is not our product table.
     */
    if (
      productRowIndex === -1
    ) {
      continue;
    }

    /*
     * Strong bonus for having an
     * actual product row.
     */
    const score =
      headerScore +
      columnEvidence * 2 +
      20;

    const candidate = {
      index: i,
      endIndex: j - 1,
      score,
    };

    /*
     * Prefer the stronger table.
     *
     * If scores are equal, prefer
     * the EARLIER table because
     * invoice product tables normally
     * appear before summaries/taxes.
     */
    if (
      !best ||
      candidate.score > best.score ||
      (
        candidate.score === best.score &&
        candidate.index < best.index
      )
    ) {
      best = candidate;
    }
  }

  return best;
}

/* ==========================================================================
   7.5. GENERIC RECEIPT STRUCTURE DETECTION
========================================================================== */

function detectReceiptStructure(lines = [], table = null) {
/*
 * --------------------------------------------------
 * LOCAL / HANDWRITTEN BILL
 * --------------------------------------------------
 *
 * Local bills may not be detected by
 * findDescriptionTable(), so detect them
 * independently from the OCR lines.
 */
for (let i = 0; i < lines.length; i++) {
  const current = lower(lines[i]);

  if (!/^particulars$/i.test(current)) {
    continue;
  }

  const context = lines
    .slice(
      Math.max(0, i - 3),
      Math.min(lines.length, i + 25)
    )
    .map(lower)
    .join(" ");

  const hasQty =
    /\b(?:qty|quantity)\b/i.test(context);

  const hasRate =
    /\brate\b/i.test(context);

  const hasAmount =
    /\bamount\b/i.test(context);

  if (
    hasQty &&
    hasRate &&
    hasAmount
  ) {
    return {
      type: "MULTI_ITEM_LOCAL",
      confidence: 0.96,
      signals: [
        "particulars",
        "quantity",
        "rate",
        "amount",
      ],
    };
  }
}

/*
 * No known table structure detected.
 */
if (!table) {
  return {
    type: "NO_TABLE",
    confidence: 0,
    signals: [],
  };
}

  const headerLines = lines.slice(
    table.index,
    table.endIndex + 1
  );

  const headerText = lower(
    headerLines.join(" ")
  );

  const signals = [];

  const hasDescription =
    /\b(?:description|particulars|item|product|goods)\b/i.test(
      headerText
    );

  const hasQty =
    /\b(?:qty|quantity)\b/i.test(
      headerText
    );

  const hasRate =
    /\brate\b/i.test(
      headerText
    );

  const hasAmount =
    /\bamount\b/i.test(
      headerText
    );

  const hasPrice =
    /\bprice\b/i.test(
      headerText
    );

  const hasHSN =
    /\b(?:hsn|hsn\/\s*sac|sku)\b/i.test(
      headerText
    );

  const hasTax =
    /\b(?:gst|cgst|sgst|tax|taxes)\b/i.test(
      headerText
    );

  const hasSerial =
    /\b(?:s\.?\s*no\.?|sr\.?\s*no\.?|serial)\b/i.test(
      headerText
    );

  /*
   * --------------------------------------------------
   * LOCAL / HANDWRITTEN BILL
   * --------------------------------------------------
   *
   * Strong generic signal:
   *
   * Particulars + Qty + Rate + Amount
   */
  if (
    /\bparticulars\b/i.test(headerText) &&
    hasQty &&
    hasRate &&
    hasAmount
  ) {
    signals.push(
      "particulars",
      "quantity",
      "rate",
      "amount"
    );

    return {
      type: "MULTI_ITEM_LOCAL",
      confidence: 0.96,
      signals,
    };
  }

  /*
   * --------------------------------------------------
   * STRUCTURED TABLE
   * --------------------------------------------------
   */
  if (
    hasDescription &&
    (
      hasQty ||
      hasAmount ||
      hasPrice ||
      hasHSN ||
      hasTax
    )
  ) {
    signals.push("description");

    if (hasQty) {
      signals.push("quantity");
    }

    if (hasAmount) {
      signals.push("amount");
    }

    if (hasPrice) {
      signals.push("price");
    }

    if (hasHSN) {
      signals.push("hsn");
    }

    if (hasTax) {
      signals.push("tax");
    }

    if (hasSerial) {
      signals.push("serial-number");
    }

    /*
     * Look at the first part of the table body
     * for repeated row-start patterns.
     */
    const bodyStart =
      table.endIndex + 1;

    const bodyLines = lines.slice(
      bodyStart,
      Math.min(
        lines.length,
        bodyStart + 30
      )
    );

    let rowSignals = 0;

    for (
      let i = 0;
      i < bodyLines.length;
      i++
    ) {
      const line =
        clean(
          bodyLines[i]
        );

      if (!line) {
        continue;
      }

      /*
       * 1.
       * 2.
       * 3.
       */
      if (
        /^\d{1,3}\s*[.)]?$/.test(
          line
        )
      ) {
        rowSignals++;
        continue;
      }

      /*
       * 1 x Product
       * 2 x Product
       */
      if (
        /^\d{1,3}\s*[xX]\s+[A-Za-z]/.test(
          line
        )
      ) {
        rowSignals++;
        continue;
      }

      /*
       * 1 Product
       * 2 Product
       *
       * Useful when OCR keeps serial number
       * and description on the same line.
       */
      if (
        /^\d{1,3}\s+(?=[A-Za-z])/.test(
          line
        )
      ) {
        rowSignals++;
      }
    }

    if (rowSignals >= 2) {
      signals.push(
        "multiple-row-pattern"
      );

      return {
        type: "MULTI_ITEM_TABLE",
        confidence: 0.95,
        signals,
      };
    }

    /*
     * We know this is a product table,
     * but we don't yet know whether it contains
     * one product or multiple rows.
     */
    return {
      type: "PRODUCT_TABLE",
      confidence: 0.78,
      signals,
    };
  }

  return {
    type: "UNKNOWN_TABLE",
    confidence: 0.35,
    signals,
  };
}


function isLikelyTableColumnLine(
  value = ""
) {
  const text = lower(value);

 return /^(?:hsn|sku|qty|quantity|unit|uom|gross|gross\s+amount|discount|taxable|taxable\s+value|tax|taxes|total|rate|price|amount)\b/i.test(
  text
);
}

function isLikelyNumericRow(
  value = ""
) {
  const text = clean(value);

  if (!text) {
    return true;
  }

  if (isNumberOnly(text)) {
    return true;
  }

  if (
    /^(?:₹|rs\.?)\s*[\d,]+(?:\.\d{1,2})?$/i.test(
      text
    )
  ) {
    return true;
  }

  if (
    /^\d{4,10}\s+(?:\d+|na)\b/i.test(
      text
    )
  ) {
    return true;
  }

  return false;
}

function findTotalSectionIndex(lines) {
  for (
    let i = lines.length - 1;
    i >= 0;
    i--
  ) {
    if (
      /^total\b/i.test(lines[i])
    ) {
      return i;
    }
  }

  return -1;
}


/* ==========================================================================
   8. PRODUCT CLEANING
========================================================================== */

function cleanProductCandidate(value = "") {
  let product = clean(value);

  if (!product) {
    return "";
  }

  /*
   * Remove serial number.
   */
  product = product.replace(
    /^\d+\s+(?=[A-Za-z])/,
    ""
  );

  /*
   * Remove product labels.
   */
  /*
 * Remove product labels and accidental
 * invoice column headers.
 */
product = product.replace(
  /^(?:description|product(?:\s+name)?|item(?:\s+name)?|particulars|value)\s*:?\s*/i,
  ""
);

  /*
   * Remove HSN + Qty + Amount columns
   * when OCR places them on the same line.
   */
  product = product.replace(
    /\s+\d{4,10}\s+\d+(?:\.\d+)?\s+(?:(?:₹|rs\.?)\s*)?[\d,]+(?:\.\d{1,2})?.*$/i,
    ""
  );

  /*
   * Remove HSN / SKU trailing information.
   */
  product = product.replace(
    /\s+(?:hsn|sku)\s*:?\s*\d{4,10}\b.*$/i,
    ""
  );

  /*
   * Remove trailing price.
   */
  product = product.replace(
    /\s+(?:₹|rs\.?)\s*[\d,]+(?:\.\d{1,2})?\s*$/i,
    ""
  );

  return clean(product);
}


/* ==========================================================================
   9. PRODUCT VALIDATION
========================================================================== */

const productKeywords = [
  "shirt",
  "t-shirt",
  "shoe",
  "shoes",
  "sneaker",
  "watch",
  "laptop",
  "mobile",
  "phone",
  "iphone",
  "airpods",
  "headphone",
  "earbuds",
  "charger",
  "cable",
  "blender",
  "juicer",
  "bangles",
  "jewellery",
  "jewelry",
  "jeans",
  "pant",
  "dress",
  "hoodie",
  "jacket",
  "bag",
  "bottle",
  "speaker",
  "camera",
  "tablet",
  "mixer",
  "kettle",
  "keyboard",
  "mouse",
  "appliance",
  "perfume",
  "cosmetic",
  "wallet",
  "toy",
  "book",
  "bedsheet",
  "pillow",
  "curtain",
];

function isProductReference(value = "") {
  const text = clean(value);

  return /^(?:item|sku|code|id|item\s*no|item\s*number)[\s:_-]*[A-Z]*\d[\w-]*$/i.test(
    text
  );
}

function looksLikeProduct(value = "") {
  const text =
    cleanProductCandidate(value);

  if (
    !text ||
    text.length < 3 ||
    text.length > 250
  ) {
    return false;
  }

  if (
    isTableNoise(text) ||
    isAddress(text) ||
    isNumberOnly(text)
  ) {
    return false;
  }

  if (
    looksLikeDate(text) ||
    isFooterNoise(text) ||
    isPaymentText(text)
  ) {
    return false;
  }

 /*
 * Tax labels must never become products.
 */
if (
  /^(?:igst|cgst|sgst|gst|cess)\s*:?\s*$/i.test(
    text
  )
) {
  return false;
}


if (
  /^(?:invoice|order|gstin|gst|grand\s+total|paid\s+amount|total|subtotal|tax|discount|payment|payment\s+method|terms|conditions|bill\s+to|ship\s+to|other\s+charges|round\s+off|item\s+total|subtotal|cgst|sgst|igst|tax\s+summary)\b/i.test(
    text
  )
) {
  return false;
}

  if (
    /\b(?:qty\s+gross|gross\s+amount|taxable\s+value|net\s+units|unit\s+price)\b/i.test(
      text
    )
  ) {
    return false;
  }

  const letters =
    (text.match(/[A-Za-z]/g) || [])
      .length;

  return letters >= 2;
}

function productScore(
  candidate,
  context = {}
) {
  const text =
    cleanProductCandidate(candidate);

  if (
    !looksLikeProduct(
      text,
      context
    )
  ) {
    return -999;
  }

  let score = 0;

  /*
   * Actual invoice Description table
   * gets the strongest priority.
   */

  if (
    context.descriptionTable
  ) {
    score += 120;
  }

  if (
    context.afterDescription
  ) {
    score += 50;
  }

  if (
    context.explicitLabel
  ) {
    score += 70;
  }

  if (
    context.keyword
  ) {
    score += 25;
  }

  if (
    context.metadataPenalty
  ) {
    score -= 150;
  }

  /*
 * ==================================================
 * PRODUCT KEYWORD STRENGTH
 * ==================================================
 *
 * One keyword = basic evidence
 * Multiple keywords = stronger product evidence
 *
 * Example:
 *
 * Blender Electric Juicer
 * → blender + juicer
 *
 * Blender Shaker
 * → blender
 *
 * This helps choose the more complete
 * product candidate without hardcoding
 * any specific receipt.
 */

const matchedKeywords =
  productKeywords.filter(
    (keyword) =>
      lower(text).includes(
        keyword
      )
  );

if (
  matchedKeywords.length > 0
) {
  score += 20;

  score += Math.min(
    matchedKeywords.length * 15,
    45
  );
}

  if (
    looksLikePersonName(text)
  ) {
    score -= 50;
  }

  if (
    isAddress(text)
  ) {
    score -= 100;
  }

  const wordCount =
    text.split(/\s+/).length;

  if (wordCount >= 2) {
    score += 15;
  }

  if (wordCount >= 5) {
    score += 10;
  }

  if (
    text.length >= 10 &&
    text.length <= 220
  ) {
    score += 10;
  }

  return score;
}


/* ==========================================================================
   10. PRODUCT EXTRACTION
========================================================================== */
function collectDescriptionProduct(lines, table) {
  const parts = [];

  /*
   * Start from the actual line after the
   * Description / Goods header.
   */
  let start = table.index + 1;

  /*
   * Skip invoice column headers.
   */
  while (
    start < lines.length &&
    (
      isLikelyTableColumnLine(lines[start]) ||
      /^description$/i.test(clean(lines[start])) ||
      /^particulars$/i.test(clean(lines[start])) ||
      /^item(?:\s+name)?$/i.test(clean(lines[start])) ||
      /^product(?:\s+name)?$/i.test(clean(lines[start])) ||
      /^name\s+of\s+goods$/i.test(clean(lines[start]))
    )
  ) {
    start++;
  }

  for (
    let i = start;
    i < Math.min(lines.length, start + 25);
    i++
  ) {
    const line = clean(lines[i]);

    if (!line) continue;

    /*
     * ==================================================
     * HARD STOP — LEGAL / FOOTER / TERMS
     * ==================================================
     */
    if (
  /^(?:1\s*\/\s*we|i\s*\/\s*we|we\s+hereby|i\s+hereby)\b/i.test(
    line
  ) ||
  /^(?:shipper'?s?\s+copy|consignor\s+copy|consignee\s+copy)\b/i.test(
    line
  ) ||
  /^(?:non[-\s]?negotiable|not\s+responsible\s+for)\b/i.test(
    line
  ) ||
  /^(?:gst\s+is\s+to\s+be\s+paid|delivery\s+from)\b/i.test(
    line
  ) ||
  /^(?:terms?\s*(?:&|and)\s*conditions?)\b/i.test(
    line
  ) ||
  /^(?:tax\s+is\s+not\s+payable)\b/i.test(
    line
  ) ||
  /^(?:this\s+is\s+a\s+computer\s+generated)\b/i.test(
    line
  ) ||
  /^(?:computer\s+generated\s+invoice)\b/i.test(
    line
  ) ||
  /^(?:notes?|remarks?)\b/i.test(
    line
  ) ||

  /*
   * E-commerce / invoice footer disclaimer.
   *
   * Example:
   * Includes discounts for your city,
   * limited returns and/or for online payments
   */
  /\b(?:includes?\s+discounts?|limited\s+returns?|for\s+your\s+city|online\s+payments?|returns?\s+and\/or)\b/i.test(
    line
  )
) {
  break;
}

    /*
     * ==================================================
     * HARD STOP — INVOICE SUMMARY
     * ==================================================
     */
    if (
      /^(?:total|grand\s+total|subtotal|sub\s+total)$/i.test(
        line
      ) ||
      /^other\s+charges\b/i.test(line) ||
      /^e[-\s]?way\s+cost\b/i.test(line) ||
      /^green\s+tax\b/i.test(line)
    ) {
      break;
    }

    /*
     * ==================================================
     * TAX LINES
     * ==================================================
     */
    if (isTaxLine(line)) {
      if (parts.length) break;
      continue;
    }

    /*
     * ==================================================
     * NUMERIC / TABLE COLUMNS
     * ==================================================
     */
    if (isLikelyNumericRow(line)) {
      if (parts.length) break;
      continue;
    }

    if (isLikelyTableColumnLine(line)) {
      if (parts.length) break;
      continue;
    }

    /*
     * ==================================================
     * TABLE / METADATA NOISE
     * ==================================================
     */
    if (
      isProductMetadataLine(line) ||
      isTableNoise(line)
    ) {
      if (parts.length) break;
      continue;
    }

    /*
     * ==================================================
     * PAYMENT / FOOTER / ADDRESS
     * ==================================================
     */
    if (
      isPaymentText(line) ||
      isFooterNoise(line) ||
      isAddress(line)
    ) {
      if (parts.length) break;
      continue;
    }

    /*
     * ==================================================
     * LEGAL SENTENCE DETECTION
     * ==================================================
     */
    if (
      /\b(?:applicable\s+to\s+your\s+order|computer\s+generated|does\s+not\s+require\s+signature|reverse\s+charge\s+basis|logistics?\s+fee|city\s+and\/or\s+online\s+payments?|terms\s+and\s+conditions|non[-\s]?negotiable|contraband|hazardous|banned\s+item|indian\s+postal\s+act)\b/i.test(
        line
      )
    ) {
      break;
    }

    /*
     * ==================================================
     * PRODUCT CANDIDATE
     * ==================================================
     */
    let candidate =
      cleanProductCandidate(line);

    /*
     * OCR may accidentally attach the
     * "Value" column header.
     *
     * Example:
     *
     * Value Fancy bangles - 2.6
     */
    if (
      /^value\s+/i.test(candidate)
    ) {
      const withoutValue =
        candidate
          .replace(
            /^value\s+/i,
            ""
          )
          .trim();

      const hasProductKeyword =
        productKeywords.some(
          (keyword) =>
            lower(
              withoutValue
            ).includes(keyword)
        );

      if (
        hasProductKeyword &&
        looksLikeProduct(
          withoutValue
        )
      ) {
        candidate =
          withoutValue;
      }
    }

    if (!candidate) continue;

    /*
     * ==================================================
     * OCR NON-PRODUCT PHRASES
     * ==================================================
     *
     * Example:
     *
     * Not for Sale
     *      ↓
     * Juel for Solle
     *
     * Do not allow these OCR artifacts to become
     * part of the product description.
     */
    if (
      /(?:not\s+for\s+sale|juel\s+for\s+solle|for\s+sale)/i.test(
        candidate
      )
    ) {
      continue;
    }

    /*
     * ==================================================
     * STRONG PRODUCT LINE
     * ==================================================
     */
  if (!candidate) {
  continue;
}

const isDescriptionContinuation =
  /^[A-Za-z0-9][A-Za-z0-9\s.,()&/'-]{1,149}$/.test(
    candidate
  );

if (
  /^(?:tax\s+invoice|sold\s+by|billed\s+by|original\s+for\s+recipient|gstin|purchase\s+order|invoice\s+no|order\s+date|invoice\s+date|hsn|qty|gross\s+amount|discount|taxable\s+value|taxes|total|other\s+charges)$/i.test(
    candidate
  )
) {
  if (parts.length) break;
  continue;
}

if (
  /^(?:1\s*\/\s*we|i\s*\/\s*we|we\s+hereby|this\s+shipment|gst\s+is\s+to\s+be\s+paid|not\s+responsible|non[-\s]?negotiable|delivery\s+from)\b/i.test(
    candidate
  ) ||
  /\b(?:terms\s+and\s+conditions|contraband|hazardous|banned\s+item|indian\s+postal\s+act)\b/i.test(
    candidate
  )
) {
  if (parts.length) break;
  continue;
}

if (
  isNumberOnly(candidate) ||
  isTaxLine(candidate) ||
  isLikelyNumericRow(candidate) ||
  isTableNoise(candidate)
) {
  if (parts.length) break;
  continue;
}

if (
  looksLikeProduct(candidate) ||
  (parts.length > 0 && isDescriptionContinuation)
) {
  parts.push(candidate);
  continue;
}

if (parts.length) {
  break;
}
    /*
     * ==================================================
     * MULTI-LINE PRODUCT CONTINUATION
     * ==================================================
     *
     * E-commerce invoices commonly wrap one product
     * across multiple OCR lines.
     *
     * Example:
     *
     * Blender Electric Juicer 6
     * Blade USB Rechargable
     * Blender Shaker for Juices,
     * Shakes and Smoothies Usb
     * Juicer (380ml) (MULTI) -
     * Free Size
     *
     * The continuation lines may NOT individually
     * satisfy looksLikeProduct(), but they are still
     * part of the same description.
     */
    if (parts.length) {
      const looksLikeContinuation =
        /[A-Za-z]/.test(candidate) &&
        candidate.length >= 2 &&
        candidate.length <= 100 &&
        !/^(?:hsn|qty|quantity|gross\s+amount|discount|taxable\s+value|taxes|total|description|particulars|item|product)$/i.test(
          candidate
        ) &&
        !/^(?:invoice|order|purchase|payment|gst|igst|cgst|sgst)\b/i.test(
          candidate
        ) &&
        !/^\d[\d\s.,%₹$-]*$/.test(candidate);

      if (looksLikeContinuation) {
        parts.push(candidate);
        continue;
      }

      /*
       * Product collection ends when the line is
       * neither a valid product line nor a safe
       * continuation.
       */
      break;
    }
  }

  return unique(parts).join(" ");
}


function extractProductDetails(text) {
  const lines = getLines(text);

  const metadataRange =
    findProductDetailsSection(lines);

  const table =
    findDescriptionTable(
      lines,
      metadataRange
    );
    console.log("🔎 PRODUCT TABLE DETECTION:", table);

    const structure =
  detectReceiptStructure(
    lines,
    table
  );

console.log(
  "🧠 RECEIPT STRUCTURE:",
  structure
);

  const candidates = [];

  /*
   * ==================================================
   * PRODUCT FOOTER / ROLE NOISE
   * ==================================================
   */

  const isProductRoleNoise = (
    value = ""
  ) => {
    const normalized = lower(
      cleanProductCandidate(value)
    ).trim();

    return (
      /^(?:booking\s+officer|authorized\s+signatory|authorised\s+signatory|signatory|sales\s+officer|accounts?\s+officer|delivery\s+agent|consignor|consignee)$/i.test(
        normalized
      )
    );
  };

  /*
   * ==================================================
   * PRODUCT SECTION STOP SIGNALS
   * ==================================================
   */

  const isProductSectionEnd = (
    value = ""
  ) => {
    const normalized = lower(
      cleanProductCandidate(value)
    ).trim();

    return (
      /^(?:invoice\s+no\.?|invoice\s+number|value|gst\s*(?:no|number)?|actual\s+weight|charged\s+weight|rate\s+per\s*kg|basic\s+freight|hamali|statistical\s+charges|door\s+delivery|other\s+charges|e-?way\s+cost|total|grand\s+total|green\s+tax|consignor\s+copy|booking\s+officer)$/i.test(
        normalized
      )
    );
  };

  /*
   * ==================================================
   * DESCRIPTION / INVOICE METADATA NOISE
   * ==================================================
   *
   * These lines can appear between the first
   * product line and the remaining wrapped
   * product description.
   *
   * Example:
   *
   * Description
   * Blender Electric Juicer 6
   * TAX INVOICE
   * Sold by: ...
   * GSTIN...
   * Purchase Order No.
   * ...
   * HSN
   * Qty
   * Gross Amount
   * Blade USB Rechargable
   * ...
   */

  const isInvoiceMetadataNoise = (
    value = ""
  ) => {
    const normalized = lower(
      cleanProductCandidate(value)
    ).trim();

    if (!normalized) {
      return true;
    }
const isKeyValueMetadata =
  /^[a-z][a-z\s./#()_-]{1,40}\s*:\s*\S/i.test(
    normalized
  );

if (isKeyValueMetadata) {
  const key = normalized
    .split(":")[0]
    .trim();

  const metadataKeyPattern =
  /^(?:date|time|invoice|bill|order|payment|customer|created|contact|phone|mobile|email|address|gst|hsn|tax|status|type|account|bank|ifsc|round|subtotal|total|discount|quantity|qty|unit|price|amount|mrp|seller|buyer|billing|shipping|delivery|reference|ref|code|id|number|no)(?:\s+[a-z]+)*$/i;

  if (metadataKeyPattern.test(key)) {
    return true;
  }
}
    return (
        /^(?:time|invoice\s+time|order\s+time)\s*:?\s*\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm)?$/i.test(
  normalized
) ||
      /^(?:tax\s+invoice|original\s+for\s+recipient|sold\s+by\b|billed\s+by\b|ship\s+to\b|bill\s+to\b|bill\s+to\/ship\s+to\b)$/i.test(
        normalized
      ) ||
      /^(?:gstin|gst\s*(?:no|number)|purchase\s+order\s+no\.?|purchase\s+order|invoice\s+no\.?|invoice\s+number|order\s+date|invoice\s+date|place\s+of\s+supply|hsn|qty|gross\s+amount|discount|taxable\s+value|taxes|total)$/i.test(
        normalized
      ) ||
      /^(?:original\s+for\s+recipient|consignee|consignor)$/i.test(
        normalized
      ) ||
      /^sold\s+by\s*:/i.test(normalized) ||
      /^billed\s+from\s*:/i.test(normalized) ||
      /^ship\s+to\s*:/i.test(normalized) ||
      /^bill\s+to\s*:/i.test(normalized)
    );
  };

  /*
   * ==================================================
   * 1. STRONGEST SOURCE
   * Actual Description / Item / Product table
   * ==================================================
   */

  if (table) {
    const value =
      collectDescriptionProduct(
        lines,
        table
      );

    if (value) {
      candidates.push({
        value,
        score: productScore(
          value,
          {
            descriptionTable: true,
            afterDescription: true,
          }
        ) + 20,
        source:
          "description-table",
      });
    }
  }

/*
 * ==================================================
 * 2. EXPLICIT PRODUCT / DESCRIPTION LABEL
 * ==================================================
 */

for (
  let i = 0;
  i < lines.length;
  i++
) {
  /*
   * Never extract product from
   * PRODUCT DETAILS section.
   */
  if (
    metadataRange &&
    i >= metadataRange.start &&
    i < metadataRange.end
  ) {
    continue;
  }

  const match = lines[i].match(
 /^(?:product\s*name|product|item\s*name|item|description|particulars).../
);

  if (!match) {
    continue;
  }

  const label =
    lower(
      cleanProductCandidate(
        lines[i]
      )
    );

  const isDescriptionLabel =
    /^(?:description|particulars)$/i.test(
      label
    );

  const parts = [];

  /*
   * ==================================================
   * PRODUCT ON SAME LINE
   * ==================================================
   *
   * Example:
   *
   * Product: Samsung Cable
   */
  const first =
    cleanProductCandidate(
      match[1]
    );

  if (
    first &&
    !isProductRoleNoise(first) &&
    looksLikeProduct(first)
  ) {
    parts.push(first);
  }

  /*
   * ==================================================
   * MULTI-LINE DESCRIPTION
   * ==================================================
   *
   * Example:
   *
   * Description
   * Blender Electric Juicer 6
   * TAX INVOICE
   * Sold by: ADITYA KASERA
   * ...
   * Blade USB Rechargable
   * Blender Shaker for Juices,
   * Shakes and Smoothies Usb
   * Juicer (380ml) (MULTI) -
   * Free Size
   *
   * The important point:
   *
   * After the first product line is found,
   * continuation lines do NOT need to pass
   * looksLikeProduct().
   * ==================================================
   */

  for (
    let j = i + 1;
    j < Math.min(
      lines.length,
      i + (isDescriptionLabel ? 30 : 12)
    );
    j++
  ) {
    const raw =
      lines[j];

    const next =
      cleanProductCandidate(raw);

    if (!next) {
      continue;
    }

    /*
     * ==================================================
     * HARD STOP — LEGAL / FOOTER
     * ==================================================
     */
    if (
      /^(?:1\s*\/\s*we|i\s*\/\s*we|we\s+hereby|i\s+hereby)\b/i.test(
        next
      ) ||
      /^(?:this\s+shipment|gst\s+is\s+to\s+be\s+paid|not\s+responsible|non-?negotiable|delivery\s+from|for\s+g\.?\s*r\.?\s*logistics)/i.test(
        next
      ) ||
      /\b(?:terms\s+and\s+conditions|reverse\s+of\s+this|non[-\s]?negotiable\s+way\s+bill|contraband|hazardous|banned\s+item|indian\s+postal\s+act)\b/i.test(
        next
      )
    ) {
      break;
    }

    /*
     * ==================================================
     * FOOTER ROLE
     * ==================================================
     */
    if (
      isProductRoleNoise(next)
    ) {
      if (parts.length) {
        break;
      }

      continue;
    }

    /*
     * ==================================================
     * INVOICE METADATA
     * ==================================================
     *
     * IMPORTANT:
     * For Description labels we SKIP these
     * instead of ending the product immediately.
     *
     * This is necessary because Google Vision
     * may reorder OCR lines.
     */
    if (
      isInvoiceMetadataNoise(next)
    ) {
      if (parts.length) {
        /*
         * Description may continue after metadata.
         */
        if (isDescriptionLabel) {
          continue;
        }

        break;
      }

      continue;
    }

    /*
     * ==================================================
     * TABLE COLUMN HEADERS
     * ==================================================
     */
    if (
      isLikelyTableColumnLine(
        next
      )
    ) {
      if (parts.length) {
        if (isDescriptionLabel) {
          continue;
        }

        break;
      }

      continue;
    }

    /*
     * ==================================================
     * NUMERIC / TAX / TABLE NOISE
     * ==================================================
     */
    if (
      isTableNoise(next) ||
      isNumberOnly(next) ||
      isTaxLine(next) ||
      isLikelyNumericRow(next)
    ) {
      if (parts.length) {
        /*
         * E-commerce OCR often places:
         *
         * HSN
         * Qty
         * Rs.409
         *
         * between wrapped product lines.
         *
         * So Description continues searching.
         */
        if (isDescriptionLabel) {
          continue;
        }

        break;
      }

      continue;
    }

    /*
     * ==================================================
     * ADDRESS / SELLER NOISE
     * ==================================================
     */
    if (
      isAddress(next)
    ) {
      if (parts.length) {
        if (isDescriptionLabel) {
          continue;
        }

        break;
      }

      continue;
    }

    /*
     * ==================================================
     * CLEAN PRODUCT CANDIDATE
     * ==================================================
     */
    let candidate =
      cleanProductCandidate(
        next
      );

    if (!candidate) {
      continue;
    }

    /*
     * Remove accidental "Value" prefix.
     *
     * Example:
     *
     * Value Fancy bangles - 2.6
     */
    if (
      /^value\s+/i.test(
        candidate
      )
    ) {
      const withoutValue =
        candidate
          .replace(
            /^value\s+/i,
            ""
          )
          .trim();

      if (
        looksLikeProduct(
          withoutValue
        )
      ) {
        candidate =
          withoutValue;
      }
    }

    /*
     * ==================================================
     * REJECT KNOWN OCR GARBAGE
     * ==================================================
     */
    if (
      /(?:not\s+for\s+sale|juel\s+for\s+solle)/i.test(
        candidate
      )
    ) {
      continue;
    }

    /*
     * ==================================================
     * FIRST PRODUCT LINE
     * ==================================================
     */
    if (
      parts.length === 0
    ) {
      if (
        looksLikeProduct(
          candidate
        )
      ) {
        parts.push(candidate);
      }

      continue;
    }

    /*
     * ==================================================
     * MULTI-LINE PRODUCT CONTINUATION
     * ==================================================
     *
     * THIS IS THE IMPORTANT FIX.
     *
     * These lines do NOT have to satisfy
     * looksLikeProduct().
     *
     * Example:
     *
     * Blade USB Rechargable
     * Blender Shaker for Juices,
     * Shakes and Smoothies Usb
     * Juicer (380ml) (MULTI) -
     * Free Size
     */
  /*
 * ==================================================
 * MULTI-LINE PRODUCT CONTINUATION
 * ==================================================
 *
 * Only accept continuation text that actually
 * looks like product/description content.
 *
 * Generic English/legal/footer sentences must
 * never become part of the product name.
 */

const isFooterOrLegalText =
  /\b(?:includes?\s+discounts?|limited\s+returns?|for\s+your\s+city|online\s+payments?|returns?\s+and\/or|applicable\s+to\s+your\s+order|terms?\s+and\s+conditions?|tax\s+is\s+not\s+payable|computer\s+generated\s+invoice|this\s+is\s+a\s+computer\s+generated)\b/i.test(
    candidate
  );

if (
  isFooterOrLegalText
) {
  break;
}

const isSafeContinuation =
  /^[A-Za-z0-9][A-Za-z0-9\s.,()&/'-]{1,149}$/.test(
    candidate
  );

/*
 * A continuation should not look like a complete
 * sentence / legal statement.
 *
 * Product continuations normally contain:
 * - product nouns
 * - model names
 * - specifications
 * - short descriptive fragments
 *
 * Long sentence-like text is treated as noise.
 */
const wordCount =
  candidate
    .split(/\s+/)
    .filter(Boolean)
    .length;

const looksLikeSentence =
  wordCount >= 8 &&
  /(?:\b(?:for|and|or|with|your|this|that|the|are|is|to)\b)/i.test(
    candidate
  );

if (
  isSafeContinuation &&
  !looksLikeSentence
) {
  parts.push(candidate);
  continue;
}

/*
 * Unknown unrelated text.
 */
if (parts.length) {
  break;
}

    /*
     * Unknown unrelated text.
     */
    if (parts.length) {
      break;
    }
  }

  /*
   * ==================================================
   * CREATE EXPLICIT PRODUCT CANDIDATE
   * ==================================================
   */
  if (parts.length) {
    const value =
      unique(parts).join(" ");

    candidates.push({
      value,
      score:
        productScore(
          value,
          {
            explicitLabel: true,
            afterDescription: true,
          }
        ) +
        (
          isDescriptionLabel &&
          parts.length > 1
            ? 25
            : 0
        ),
      source:
        "explicit-label",
    });
  }
}

  /*
   * ==================================================
   * 3. NAME OF GOODS / GOODS SECTION
   * ==================================================
   *
   * Important for logistics / transport documents.
   */

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    if (
      !/^(?:name\s+of\s+goods|goods|description\s+of\s+goods)$/i.test(
        cleanProductCandidate(
          lines[i]
        )
      )
    ) {
      continue;
    }

    const parts = [];

    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 10
      );
      j++
    ) {
      const raw =
        lines[j];

      const candidate =
        cleanProductCandidate(
          raw
        );

      if (!candidate) {
        continue;
      }

      /*
       * Column header / OCR artifact.
       */
      if (
        /^p\.?\s*m\.?$/i.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Stop at invoice / charge section.
       */
      if (
        isProductSectionEnd(
          candidate
        )
      ) {
        break;
      }

      /*
       * Footer role.
       */
      if (
        isProductRoleNoise(
          candidate
        )
      ) {
        break;
      }

      /*
       * Legal / footer paragraph.
       */
      if (
        /^(?:1\s*\/\s*we|i\s*\/\s*we|we\s+hereby|i\s+hereby)\b/i.test(
          candidate
        ) ||
        /^(?:this\s+shipment|gst\s+is\s+to\s+be\s+paid|not\s+responsible|non-?negotiable|delivery\s+from|for\s+g\.?\s*r\.?\s*logistics)/i.test(
          candidate
        ) ||
        /\b(?:terms\s+and\s+conditions|reverse\s+of\s+this|non[-\s]?negotiable\s+way\s+bill|contraband|hazardous|banned\s+item|indian\s+postal\s+act)\b/i.test(
          candidate
        )
      ) {
        break;
      }

      /*
       * Skip table / numeric noise.
       */
      if (
        isTableNoise(candidate) ||
        isNumberOnly(candidate) ||
        isTaxLine(candidate)
      ) {
        continue;
      }

      /*
       * Ignore OCR garbage from another script.
       */
      if (
        !/[A-Za-z]/.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Reject obvious OCR "Not for Sale"
       * artifacts.
       */
      if (
        /(?:not\s+for\s+sale|juel\s+for\s+solle|for\s+sale)/i.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Short descriptive goods lines are valid.
       */
      if (
        candidate.length >= 2
      ) {
        parts.push(candidate);
      }
    }

    if (parts.length) {
      const value =
        unique(parts).join(" ");

      candidates.push({
        value,
        score:
          productScore(
            value,
            {
              descriptionTable: true,
              afterDescription: true,
            }
          ) + 35,
        source:
          "goods-section",
      });
    }
  }

  /*
 * ==================================================
 * 4. HANDWRITTEN / LOCAL SHOP BILL
 * ==================================================
 *
 * Supports receipts like:
 *
 * Qty. | Particulars | Rate | Amount
 *
 * 2. MTR Coen wike.
 * 1. Heter Rad
 * 1. 3 Pin Top GAD
 * 4. Room Heten
 * Repair
 * Labour Charges
 *
 * This is generic and does not depend on
 * any store/product name.
 */

{
  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
   const rawHeader =
  String(
    lines[i] || ""
  ).trim();

const header =
  cleanProductCandidate(
    rawHeader
  );

console.log(
  "LOCAL BILL HEADER CHECK:",
  JSON.stringify(header),
  "RAW:",
  JSON.stringify(rawHeader)
);

if (
  !/^\s*particulars\s*$/i.test(
    rawHeader
  )
) {
  continue;
}
    /*
     * ==================================================
     * CHECK TABLE HEADER CONTEXT
     * ==================================================
     *
     * OCR can reorder:
     *
     * Qty.
     * Particulars
     * Rate
     * Amount
     *
     * So check BOTH sides of Particulars.
     */

    const before =
      lines
        .slice(
          Math.max(0, i - 3),
          i
        )
        .map(
          (line) =>
            lower(
              cleanProductCandidate(
                line
              )
            )
        )
        .join(" ");

    const after =
  lines
    .slice(
      i,
      Math.min(
        lines.length,
        i + 25
      )
    )
        .map(
          (line) =>
            lower(
              cleanProductCandidate(
                line
              )
            )
        )
        .join(" ");

    const headerContext =
      `${before} ${after}`;

    const hasQty =
      /\b(?:qty|quantity)\b/i.test(
        headerContext
      );

    const hasRate =
      /\brate\b/i.test(
        headerContext
      );

    const hasAmount =
      /\bamount\b/i.test(
        headerContext
      );

        console.log(
  "LOCAL BILL HEADER SIGNALS:",
  {
    header,
    headerContext,
    hasQty,
    hasRate,
    hasAmount,
  }
);

    if (
      !hasQty ||
      !hasRate ||
      !hasAmount
    ) {
      continue;
    }

    console.log(
      "🧾 LOCAL BILL TABLE DETECTED"
    );

    console.log(
      "HEADER CONTEXT:",
      headerContext
    );

    const parts = [];

    /*
     * ==================================================
     * COLLECT ITEMS
     * ==================================================
     */

    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 18
      );
      j++
    ) {
      let candidate =
        cleanProductCandidate(
          lines[j]
        );

      if (!candidate) {
        continue;
      }

      /*
       * HARD STOP
       */

      if (
        /^(?:thanks?\s*(?:you)?|thank\s*you|e\.?\s*&\.?\s*o\.?\s*e\.?|signature|g\.?\s*total|grand\s*total)$/i.test(
          candidate
        )
      ) {
        break;
      }

      /*
       * Footer / legal text.
       */

      if (
        /\b(?:terms\s+and\s+conditions|includes?\s+discounts?|limited\s+returns?|online\s+payments?|computer\s+generated\s+invoice|reverse\s+charge|logistics)\b/i.test(
          candidate
        )
      ) {
        break;
      }

      /*
       * Column headers.
       */

      if (
        /^(?:qty|quantity|particulars|rate|amount|price|item|description|total)$/i.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * ==================================================
       * REMOVE QUANTITY PREFIX
       * ==================================================
       *
       * 2. MTR Coen wike.
       * 1. Heter Rad
       * 4. Room Heten
       */

      candidate =
        candidate
          .replace(
            /^\s*\d{1,3}\s*[.)-]\s*/,
            ""
          )
          .trim();

      if (!candidate) {
        continue;
      }

      /*
       * ==================================================
       * IMPORTANT:
       * DO NOT use isLikelyNumericRow()
       * here.
       *
       * Local bills commonly have quantity
       * before the handwritten description.
       * ==================================================
       */

      if (
        isNumberOnly(candidate) ||
        isTaxLine(candidate)
      ) {
        continue;
      }

      if (
        isProductRoleNoise(candidate)
      ) {
        continue;
      }

      if (
        isAddress(candidate)
      ) {
        continue;
      }

      if (
        !/[A-Za-z]/.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Ignore obvious unrelated OCR garbage.
       */

      if (
        /^(?:bill|cash|dated?|no\.?|shri|thanks?|signature)$/i.test(
          candidate
        )
      ) {
        continue;
      }

      /*
       * Keep the handwritten item.
       */

      /*
 * ==================================================
 * KEEP LOCAL BILL PRODUCT
 * ==================================================
 *
 * OCR local bills mein columns mix kar sakta hai.
 *
 * Example:
 *
 * 2. MTR Coen wike.
 * 45P
 * 1
 * 1. Heter Rad
 * -
 * 1. 3 Pin Top GAD
 * 4. Room Heten
 * Repair
 * Labour Charges
 *
 * We don't want rate/amount noise
 * to become part of product name.
 */

/*
 * Ignore OCR values coming from
 * Rate / Amount columns.
 */
if (
  /^\d+(?:\.\d+)?[A-Za-z]?$/.test(
    candidate
  )
) {
  continue;
}

/*
 * Ignore standalone dash.
 */
if (
  /^[-–—]+$/.test(
    candidate
  )
) {
  continue;
}

/*
 * Remove quantity prefix.
 */
const cleanedItem =
  candidate
    .replace(
      /^\s*\d{1,3}\s*[.)-]\s*/,
      ""
    )
    .trim();
    /*
 * ==================================================
 * LOCAL BILL NON-PRODUCT / SERVICE NOISE
 * ==================================================
 */

if (
  /^(?:repair|labou?r\s+charges?|service\s+charges?|labou?r|charges?)$/i.test(
    cleanedItem
  )
) {
  continue;
}

if (
  cleanedItem.length >= 2 &&
  cleanedItem.length <= 100
) {
  parts.push(cleanedItem);
}
    }

    /*
     * ==================================================
     * CREATE PRODUCT CANDIDATE
     * ==================================================
     */

    if (parts.length) {
      const value =
        unique(parts).join(" ");

      candidates.push({
        value,
        score:
          productScore(
            value,
            {
              descriptionTable: true,
              afterDescription: true,
            }
          ) + 50,
        source:
          "handwritten-local-bill",
      });

      console.log(
        "📝 LOCAL BILL PRODUCT:",
        value
      );
    }

    /*
     * We found the relevant Particulars
     * section, so stop searching.
     */

    break;
  }
}


/*
 * ==================================================
 * 4. KEYWORD FALLBACK
 * ==================================================
 */

if (!table) {
  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    if (
      metadataRange &&
      i >= metadataRange.start &&
      i < metadataRange.end
    ) {
      continue;
    }

    const first =
      cleanProductCandidate(
        lines[i]
      );

    if (
      isProductRoleNoise(first)
    ) {
      continue;
    }

    if (
      /^(?:this\s+is|tax\s+is|applicable\s+to|other\s+charges|computer\s+generated|does\s+not\s+require|terms|conditions|charges\s+for\s+logistics?)\b/i.test(
        first
      )
    ) {
      continue;
    }

    if (
  /\b(?:applicable\s+to\s+your\s+order|include(?:s)?\s+discounts?|limited\s+returns?|for\s+your\s+city|online\s+payments?|returns?\s+and\/or|include\s+charges\s+for\s+logistics|computer\s+generated\s+invoice)\b/i.test(
    first
  )
) {
  continue;
}
    if (
      !looksLikeProduct(first)
    ) {
      continue;
    }

    const hasKeyword =
      productKeywords.some(
        (keyword) =>
          lower(first).includes(
            keyword
          )
      );

    if (!hasKeyword) {
      continue;
    }

    const parts = [first];

    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 7
      );
      j++
    ) {
      const next =
        cleanProductCandidate(
          lines[j]
        );

      if (!next) {
        break;
      }

      if (
        isProductRoleNoise(next)
      ) {
        break;
      }

      if (
        isTableNoise(next) ||
        isNumberOnly(next) ||
        isTaxLine(next)
      ) {
        break;
      }

      if (
        isProductSectionEnd(next)
      ) {
        break;
      }

      if (
        isLikelyTableColumnLine(next)
      ) {
        break;
      }

      if (
        !looksLikeProduct(next)
      ) {
        break;
      }

      parts.push(next);
    }

    const value =
      unique(parts).join(" ");

    candidates.push({
      value,
      score: productScore(
        value,
        {
          keyword: true,
        }
      ),
      source:
        "keyword-fallback",
    });
  }
}

  /*
   * ==================================================
   * BEST CANDIDATE
   * ==================================================
   */

  console.log(
  "PRODUCT CANDIDATES JSON:",
  JSON.stringify(
    candidates,
    null,
    2
  )
);

  candidates.sort(
    (a, b) =>
      b.score - a.score ||
      b.value.length -
        a.value.length
  );

  const winner =
    candidates[0] || {
      value: "",
      score: 0,
      source: "none",
    };

  /*
   * Debug information
   */

  console.log(
    "========== PRODUCT EXTRACTION =========="
  );

  console.log(
    "Product:",
    winner.value
  );

  console.log(
    "Product Source:",
    winner.source
  );

  console.log(
    "Product Score:",
    winner.score
  );

 console.table(
  candidates.map((candidate) => ({
    value: candidate.value,
    score: candidate.score,
    source: candidate.source,
  }))
);

  console.log(
    "========================================="
  );

  return {
    value: winner.value,
    score: winner.score,
    source: winner.source,
    candidateCount:
      candidates.length,
  };
}
function extractProduct(text) {
  return extractProductDetails(
    text
  ).value;
}


/* ==========================================================================
   11. DATE EXTRACTION
========================================================================== */

function extractPurchaseDate(text) {
  const lines =
    getLines(text);

  const dateRegex =
    /(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/;

  /*
   * Find a date on the same line
   * OR on the next 1-2 OCR lines.
   */
  const findDateNearLabel = (
    labelRegex
  ) => {
    for (
      let i = 0;
      i < lines.length;
      i++
    ) {
      const line =
        lines[i];

      /*
       * Same line:
       *
       * Invoice Date: 04-08-2026
       */
      const sameLine =
        line.match(
          new RegExp(
            labelRegex.source +
              "\\s*:?[\\s-]*" +
              dateRegex.source,
            "i"
          )
        );

      if (
        sameLine?.[1]
      ) {
        const normalized =
          normalizeOCRDate(
            sameLine[1]
          );

        if (normalized) {
          return normalized;
        }
      }

      /*
       * Split OCR:
       *
       * Invoice Date
       * 04-08-2026
       */
      if (
        labelRegex.test(line)
      ) {
        for (
          let offset = 1;
          offset <= 2;
          offset++
        ) {
          const next =
            lines[i + offset] ||
            "";

          const match =
            next.match(
              dateRegex
            );

          if (
            match?.[1]
          ) {
            const normalized =
              normalizeOCRDate(
                match[1]
              );

            if (normalized) {
              return normalized;
            }
          }
        }
      }
    }

    return "";
  };

  /*
   * ==================================================
   * 1. INVOICE DATE — strongest
   * ==================================================
   */

  let result =
    findDateNearLabel(
      /invoice\s*date/i
    );

  if (result) {
    return result;
  }

  /*
   * ==================================================
   * 2. PURCHASE DATE
   * ==================================================
   */

  result =
    findDateNearLabel(
      /purchase\s*date/i
    );

  if (result) {
    return result;
  }

  /*
   * ==================================================
   * 3. PURCHASED ON
   * ==================================================
   */

  result =
    findDateNearLabel(
      /purchased\s*on/i
    );

  if (result) {
    return result;
  }

  /*
   * ==================================================
   * 4. ORDER DATE — fallback
   * ==================================================
   */

  result =
    findDateNearLabel(
      /order\s*date/i
    );

  if (result) {
    return result;
  }

  /*
   * ==================================================
   * 5. Generic Date
   * ==================================================
   */

  result =
    findDateNearLabel(
      /\bdate\b/i
    );

  if (result) {
    return result;
  }

  /*
   * ==================================================
   * 6. Last-resort date
   * ==================================================
   */

  const dates =
    text.match(
      /\b\d{1,4}[./-]\d{1,2}[./-]\d{2,4}\b/g
    ) || [];

  for (
    const date of dates
  ) {
    const normalized =
      normalizeOCRDate(
        date
      );

    if (normalized) {
      return normalized;
    }
  }

  return "";
}


/* ==========================================================================
   12. MONEY HELPERS
========================================================================== */

function parseMoney(value = "") {
  if (
    value === "" ||
    value == null
  ) {
    return 0;
  }

  const cleaned =
    String(value)
      .replace(/₹/g, "")
      .replace(/Rs\.?/gi, "")
      .replace(/,/g, "")
      .trim();

  const number =
    Number.parseFloat(cleaned);

  if (
    !Number.isFinite(number)
  ) {
    return 0;
  }

  return normalizeAmount(number);
}

function extractAmountsFromLine(
  line = ""
) {
  const matches =
    line.match(
      /(?:₹|Rs\.?)\s*[\d,]+(?:\.\d{1,2})?|\b\d[\d,]*\.\d{1,2}\b/g
    ) || [];

  return matches
    .map(parseMoney)
    .filter(
      (value) => value > 0
    );
}


/* ==========================================================================
   13. AMOUNT EXTRACTION
========================================================================== */

function extractAmount(text) {
  const lines =
    getLines(text);

  /*
   * ==================================================
   * LEVEL 1
   * STRONG EXPLICIT FINAL-VALUE LABELS
   * ==================================================
   */

  /*
 * ==================================================
 * LEVEL 1A
 * HANDWRITTEN / LOCAL BILL FINAL TOTAL
 * ==================================================
 *
 * OCR may read:
 *
 * G. Total 460-20
 * G Total 460-20
 *
 * Meaning:
 * ₹460.20
 */

const gTotalMatch =
  text.match(
    /\bG\.?\s*Total\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+)\s*[-–]\s*(\d{1,2})\b/i
  );

if (gTotalMatch) {
  const rupees =
    parseMoney(
      gTotalMatch[1]
    );

  const paise =
    Number(
      gTotalMatch[2]
    );

  if (
    rupees > 0 &&
    paise >= 0 &&
    paise <= 99
  ) {
    return Number(
      `${rupees}.${String(paise).padStart(2, "0")}`
    );
  }
}

  const explicitPatterns = [
    /grand\s*total\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,

    /amount\s*payable\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,

    /payable\s*amount\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,

    /net\s*amount\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,

    /invoice\s*value\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];

  for (
    const pattern of explicitPatterns
  ) {
    const match =
      text.match(pattern);

    if (match) {
      const amount =
        parseMoney(match[1]);

      if (amount > 0) {
        return amount;
      }
    }
  }

/*
 * ==================================================
 * LEVEL 2A
 * GRAND TOTAL
 * ==================================================
 *
 * Grand Total has highest priority.
 *
 * OCR may produce:
 *
 * Grand Total:
 * *57499
 *
 * Grand Total: 57499
 *
 * Grand Total: ₹57499
 */

for (
  let i = lines.length - 1;
  i >= 0;
  i--
) {
  const line =
    clean(lines[i]);

  if (
    !/\bgrand\s+total\b/i.test(line)
  ) {
    continue;
  }

  /*
   * Case 1:
   *
   * Grand Total: 57499
   * Grand Total: ₹57499
   * Grand Total: *57499
   */

  const directMatch =
    line.match(
      /(?:₹|Rs\.?|[*])\s*([\d,]+(?:\.\d{1,2})?)/i
    ) ||
    line.match(
      /\b(\d[\d,]*(?:\.\d{1,2})?)\b/
    );

  if (directMatch) {
    const amount =
      parseMoney(
        directMatch[1]
      );

    if (amount > 0) {
      return amount;
    }
  }

  /*
   * Case 2:
   *
   * Grand Total:
   * *57499
   */

  for (
    let j = i + 1;
    j < Math.min(
      lines.length,
      i + 5
    );
    j++
  ) {
    const next =
      clean(lines[j]);

    if (!next) {
      continue;
    }

    /*
     * Currency / OCR-star amount.
     */
    const prefixedMatch =
      next.match(
        /(?:₹|Rs\.?|[*])\s*([\d,]+(?:\.\d{1,2})?)/i
      );

    if (prefixedMatch) {
      const amount =
        parseMoney(
          prefixedMatch[1]
        );

      if (amount > 0) {
        return amount;
      }
    }

    /*
     * Plain number is safe here because
     * we are specifically inside Grand Total.
     */
    const plainMatch =
      next.match(
        /^\s*(\d[\d,]*(?:\.\d{1,2})?)\s*$/
      );

    if (plainMatch) {
      const amount =
        parseMoney(
          plainMatch[1]
        );

      if (amount > 0) {
        return amount;
      }
    }

    if (
      /^(?:paid\s+amount|terms?\b|notes?\b)/i.test(
        next
      )
    ) {
      break;
    }
  }
}

  /*
   * ==================================================
   * LEVEL 2
   * FINAL TOTAL SECTION
   * ==================================================
   *
   * Important:
   *
   * OCR may look like:
   *
   * Other Charges
   * Rs.16.00
   *
   * Total
   * Rs.64.83
   * Rs.425.00
   *
   * We MUST NOT select 16.
   *
   * For a standalone "Total" near the bottom,
   * choose the LAST monetary value belonging
   * to that total section.
   */

  for (
    let i = lines.length - 1;
    i >= 0;
    i--
  ) {
    const line =
      clean(lines[i]);

    /*
     * Only consider a standalone final Total.
     *
     * Do NOT treat:
     *
     * Other Charges
     * Subtotal
     * Grand Total + unrelated text
     *
     * as the same section.
     */
    if (
      !/^total$/i.test(line)
    ) {
      continue;
    }

    const amounts = [];

    /*
     * Collect values after Total.
     *
     * OCR can put several columns / values
     * between Total and the final amount.
     */
    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 15
      );
      j++
    ) {
      const next =
        clean(lines[j]);

      if (!next) {
        continue;
      }

      /*
       * Stop at another major section.
       */
      if (
        /^(?:payment|terms?\b|notes?\b|remarks?\b|thank\s+you\b)/i.test(
          next
        )
      ) {
        break;
      }

      /*
       * Ignore identifiers.
       */
      if (
        /\b(?:gstin|invoice\s*(?:no|number)|order\s*(?:no|number)|hsn|sku)\b/i.test(
          next
        )
      ) {
        continue;
      }

      amounts.push(
        ...extractAmountsFromLine(
          next
        )
      );
    }

    /*
     * The LAST amount after the final Total
     * is the strongest candidate.
     */
    if (amounts.length) {
      return amounts[
        amounts.length - 1
      ];
    }
  }


  /*
   * ==================================================
   * LEVEL 3
   * GRAND TOTAL / TOTAL LABEL ON SAME LINE
   * ==================================================
   */

  for (
    let i = lines.length - 1;
    i >= 0;
    i--
  ) {
    const line =
      clean(lines[i]);

    if (
      !/\bgrand\s+total\b/i.test(
        line
      )
    ) {
      continue;
    }

    const amounts =
      extractAmountsFromLine(
        line
      );

    if (amounts.length) {
      return amounts[
        amounts.length - 1
      ];
    }

    /*
     * OCR may separate label and value.
     */
    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 8
      );
      j++
    ) {
      const next =
        clean(lines[j]);

      const values =
        extractAmountsFromLine(
          next
        );

      if (values.length) {
        return values[
          values.length - 1
        ];
      }
    }
  }


  /*
   * ==================================================
   * LEVEL 4
   * OTHER EXPLICIT FINAL AMOUNT LABELS
   * ==================================================
   */

  const fallbackPatterns = [
    /final\s*amount\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,

    /total\s*value\s*:?\s*(?:₹|rs\.?)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];

  for (
    const pattern of fallbackPatterns
  ) {
    const match =
      text.match(pattern);

    if (match) {
      const amount =
        parseMoney(match[1]);

      if (amount > 0) {
        return amount;
      }
    }
  }


  /*
   * ==================================================
   * LEVEL 5
   * EXISTING GENERIC FALLBACK
   * ==================================================
   *
   * Keep the old conservative behaviour
   * for receipts where no final total can
   * be confidently detected.
   */

  const candidates = [];

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const line =
      lines[i];

    if (
      looksLikeDate(line)
    ) {
      continue;
    }

    if (
      /\b(?:gstin|order\s*(?:no|number|id)|invoice\s*(?:no|number|id))\b/i.test(
        line
      )
    ) {
      continue;
    }

    /*
     * IMPORTANT:
     * Do not let "Other Charges" become
     * the preferred amount.
     */
    if (
      /^other\s+charges\b/i.test(
        line
      )
    ) {
      continue;
    }

    const amounts =
      extractAmountsFromLine(
        line
      );

    for (
      const amount of amounts
    ) {
      let score = 0;

      const value =
        lower(line);

      if (
        /₹|rs\.?/i.test(line)
      ) {
        score += 5;
      }

      if (
        /\b(?:amount|price|value|total|payable)\b/i.test(
          value
        )
      ) {
        score += 8;
      }

      if (
        /\b(?:qty|quantity|hsn|sku)\b/i.test(
          value
        )
      ) {
        score -= 10;
      }

      /*
       * Explicitly penalize individual
       * charge rows.
       */
      if (
        /\b(?:other\s+charges|shipping|delivery|handling|hamali|tax|gst)\b/i.test(
          value
        )
      ) {
        score -= 8;
      }

      if (
        amount >= 100
      ) {
        score += 2;
      }

      candidates.push({
        amount,
        score,
        index: i,
      });
    }
  }

  candidates.sort(
    (a, b) =>
      b.score - a.score ||
      b.index - a.index
  );

  return (
    candidates[0]?.amount || 0
  );
}

/* ==========================================================================
   14. PAYMENT METHOD
========================================================================== */

function extractPaymentMethod(text) {
  const lines = getLines(text);

  const normalizePayment = (value = "") => {
    const payment = clean(value).toLowerCase();

    if (
      /\b(?:cash\s+on\s+delivery|cod|c\.?o\.?d\.?)\b/i.test(payment)
    ) {
      return "Cash on Delivery";
    }

    if (/\bcash\b/i.test(payment)) {
      return "Cash";
    }

    if (
      /\b(?:upi|gpay|google\s*pay|phonepe|paytm)\b/i.test(payment)
    ) {
      return "UPI";
    }

    if (/\bcredit\s+card\b/i.test(payment)) {
      return "Credit Card";
    }

    if (/\bdebit\s+card\b/i.test(payment)) {
      return "Debit Card";
    }

    if (
      /\b(?:visa|mastercard|rupay)\b/i.test(payment)
    ) {
      return "Card";
    }

    if (
      /\b(?:net\s+banking|internet\s+banking|online\s+banking)\b/i.test(
        payment
      )
    ) {
      return "Net Banking";
    }

    if (
      /\b(?:wallet|amazon\s+pay|mobikwik|freecharge)\b/i.test(
        payment
      )
    ) {
      return "Wallet";
    }

    return "";
  };

  /*
   * ==================================================
   * 1. EXPLICIT PAYMENT LABEL
   * ==================================================
   *
   * Examples:
   * Payment Method: CASH
   * Payment Mode: UPI
   * Payment Type: Credit Card
   * Paid Via: PhonePe
   */

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const match = line.match(
      /^(?:payment\s*(?:method|mode|type)|paid\s*(?:via|through|by)|payment)\s*:?\s*(.+)$/i
    );

    if (match) {
      const detected = normalizePayment(match[1]);

      if (detected) {
        console.log(
          "Payment Source: explicit-label"
        );

        console.log(
          "Payment Value:",
          detected
        );

        return detected;
      }
    }
  }

  /*
   * ==================================================
   * 2. STRONG PAYMENT PHRASES
   * ==================================================
   */

  const fullText = lower(text);

  if (
    /\b(?:cash\s+on\s+delivery|paid\s+in\s+cash|payment\s+received\s+in\s+cash)\b/i.test(
      fullText
    )
  ) {
    console.log(
      "Payment Source: strong-cash"
    );

    return "Cash";
  }

  if (
    /\b(?:paid\s+(?:via|through|by)\s+(?:upi|gpay|google\s*pay|phonepe|paytm))\b/i.test(
      fullText
    )
  ) {
    console.log(
      "Payment Source: strong-upi"
    );

    return "UPI";
  }

  if (
    /\b(?:paid\s+(?:via|through|by)\s+credit\s+card)\b/i.test(
      fullText
    )
  ) {
    return "Credit Card";
  }

  if (
    /\b(?:paid\s+(?:via|through|by)\s+debit\s+card)\b/i.test(
      fullText
    )
  ) {
    return "Debit Card";
  }

  /*
   * ==================================================
   * 3. STANDALONE PAYMENT EVIDENCE
   * ==================================================
   *
   * Only use this when no explicit payment
   * field was found.
   */

  for (const line of lines) {
    const payment = normalizePayment(line);

    if (payment) {
      /*
       * Avoid treating random invoice text as payment.
       */
      if (
        /^(?:upi|phonepe|paytm|gpay|google\s*pay|cash|cod|credit\s+card|debit\s+card|visa|mastercard|rupay|net\s+banking|internet\s+banking|wallet)$/i.test(
          clean(line)
        )
      ) {
        console.log(
          "Payment Source: standalone"
        );

        console.log(
          "Payment Value:",
          payment
        );

        return payment;
      }
    }
  }

  /*
   * ==================================================
   * 4. NEVER GUESS
   * ==================================================
   */

  console.log(
    "Payment Source: none"
  );

  return "";
}


/* ==========================================================================
   15. CATEGORY
========================================================================== */

function detectCategory(
  productName = "",
  text = ""
) {
  const product = lower(productName);
  const fullText = lower(text);

  if (!product) {
    return "Others";
  }

  /*
   * ==================================================
   * CATEGORY KNOWLEDGE
   * ==================================================
   *
   * These are PRODUCT KNOWLEDGE signals.
   *
   * They are NOT merchant-specific rules.
   *
   * Example:
   * Vivo FE      → Electronics
   * Samsung TV  → Electronics
   * Nike Shoes  → Fashion
   *
   * We never check for one exact receipt/product.
   */

  const knowledge = {
    Electronics: {
      types: [
        "iphone",
        "smartphone",
        "mobile phone",
        "mobile",
        "phone",
        "tablet",
        "ipad",
        "laptop",
        "notebook computer",
        "computer",
        "desktop",
        "monitor",
        "television",
        "tv",
        "smartwatch",
        "smart watch",
        "watch",
        "airpods",
        "earbuds",
        "earphone",
        "headphone",
        "headphones",
        "speaker",
        "soundbar",
        "camera",
        "dslr",
        "mirrorless",
        "printer",
        "keyboard",
        "mouse",
        "router",
        "modem",
        "charger",
        "power bank",
        "usb cable",
        "hdmi cable",
        "cable",
        "gaming console",
        "playstation",
        "xbox",
        "nintendo",
        "blender",
        "juicer",
        "mixer",
        "kettle",
        "microwave",
        "refrigerator",
        "fridge",
        "washing machine",
        "air conditioner",
        "ac",
        "appliance",
        "electronics",
      ],

      brands: [
        "vivo",
        "samsung",
        "apple",
        "oneplus",
        "xiaomi",
        "redmi",
        "realme",
        "oppo",
        "motorola",
        "nothing",
        "google pixel",
        "pixel",
        "iqoo",
        "poco",
        "asus",
        "acer",
        "lenovo",
        "hp",
        "dell",
        "msi",
        "sony",
        "wire",
"electrical wire",
"heater",
"heater rod",
"room heater",
"heating rod",
"heater rad",
"plug",
"electrical plug",
"socket",
"switch",
"3 pin",
"wikw",
"three pin",
"extension board",
        "lg",
        "panasonic",
        "philips",
        "boat",
        "jbl",
        "canon",
        "nikon",
        "nikon",
        "bose",
      ],
    },

    Fashion: {
      types: [
        "shirt",
        "t-shirt",
        "tshirt",
        "jeans",
        "trouser",
        "trousers",
        "pants",
        "pant",
        "shorts",
        "dress",
        "skirt",
        "kurta",
        "kurti",
        "saree",
        "sari",
        "lehenga",
        "dupatta",
        "hoodie",
        "jacket",
        "coat",
        "blazer",
        "sweater",
        "sweatshirt",
        "shoe",
        "shoes",
        "sneaker",
        "sneakers",
        "sandals",
        "slipper",
        "boots",
        "bangles",
        "jewellery",
        "jewelry",
        "bracelet",
        "necklace",
        "ring",
        "wallet",
        "handbag",
        "bag",
        "backpack",
        "fashion",
        "apparel",
        "clothing",
      ],

      brands: [
        "nike",
        "adidas",
        "puma",
        "reebok",
        "skechers",
        "levi's",
        "levis",
        "zara",
        "h&m",
        "hm",
        "uniqlo",
        "roadster",
        "max fashion",
        "allen solly",
        "peter england",
        "van heusen",
        "arrow",
        "louis philippe",
      ],
    },

    Home: {
      types: [
        "bedsheet",
        "bed sheet",
        "pillow",
        "curtain",
        "blanket",
        "towel",
        "cushion",
        "carpet",
        "mattress",
        "furniture",
        "chair",
        "table",
        "sofa",
        "home decor",
        "decor",
        "utensil",
        "cookware",
        "dinner set",
        "kitchen",
        "storage",
        "lamp",
        "lighting",
      ],

      brands: [
        "ikea",
        "wakefit",
        "pepperfry",
        "urban ladder",
      ],
    },

    Food: {
      types: [
        "grocery",
        "chocolate",
        "snack",
        "coffee",
        "tea",
        "biscuit",
        "biscuits",
        "dry fruit",
        "dry fruits",
        "food",
        "rice",
        "flour",
        "atta",
        "sugar",
        "salt",
        "spices",
        "masala",
        "oil",
        "juice",
        "milk",
        "bread",
      ],

      brands: [],
    },

    Travel: {
      types: [
        "flight",
        "airline",
        "hotel",
        "train ticket",
        "bus ticket",
        "travel booking",
        "reservation",
        "boarding pass",
        "air ticket",
      ],

      brands: [],
    },

    Health: {
      types: [
        "medicine",
        "tablet",
        "capsule",
        "syrup",
        "vitamin",
        "supplement",
        "medical",
        "thermometer",
        "blood pressure",
        "glucometer",
      ],

      brands: [],
    },
  };

  /*
   * ==================================================
   * SCORE CATEGORIES
   * ==================================================
   */

  const scores = {
    Electronics: 0,
    Fashion: 0,
    Home: 0,
    Food: 0,
    Travel: 0,
    Health: 0,
  };

  const hasPhrase = (
    value,
    phrase
  ) => {
    return value.includes(
      phrase.toLowerCase()
    );
  };

  /*
   * ==================================================
   * PRODUCT TYPE EVIDENCE
   * ==================================================
   *
   * Product type is stronger than a brand.
   */

  Object.entries(
    knowledge
  ).forEach(
    ([category, data]) => {
      data.types.forEach(
        (type) => {
          if (
            hasPhrase(
              product,
              type
            )
          ) {
            scores[category] += 10;
          }
        }
      );
    }
  );

  /*
   * ==================================================
   * BRAND EVIDENCE
   * ==================================================
   *
   * Brand alone is weaker than explicit
   * product type.
   */

  Object.entries(
    knowledge
  ).forEach(
    ([category, data]) => {
      data.brands.forEach(
        (brand) => {
          if (
            hasPhrase(
              product,
              brand
            )
          ) {
            scores[category] += 6;
          }
        }
      );
    }
  );

  /*
   * ==================================================
   * OCR CONTEXT EVIDENCE
   * ==================================================
   *
   * Useful when product title is short.
   *
   * Example:
   *
   * Vivo FE
   * 100X Zoom
   * MRP
   *
   * can provide additional electronics
   * context.
   */

  const contextSignals = {
    Electronics: [
      "camera",
      "zoom",
      "battery",
      "mah",
      "gb ram",
      "rom",
      "storage",
      "bluetooth",
      "wifi",
      "wireless",
      "imei",
      "sim",
      "android",
      "ios",
      "processor",
      "display",
      "amoled",
      "oled",
      "lcd",
      "usb",
      "type-c",
      "type c",
      "voltage",
      "watt",
      "w",
    ],

    Fashion: [
      "size",
      "colour",
      "color",
      "fabric",
      "cotton",
      "polyester",
      "waist",
      "sleeve",
      "fit",
      "medium",
      "large",
      "small",
    ],

    Home: [
      "home",
      "kitchen",
      "wood",
      "steel",
      "ceramic",
      "furniture",
      "dimension",
      "cm",
      "inch",
    ],

    Food: [
      "kg",
      "gram",
      "grams",
      "g",
      "ml",
      "litre",
      "liter",
      "expiry",
      "mfg",
      "manufactured",
      "ingredients",
      "nutrition",
    ],

    Travel: [
      "pnr",
      "boarding",
      "departure",
      "arrival",
      "check-in",
      "check in",
      "seat",
      "terminal",
    ],

    Health: [
      "dosage",
      "mg",
      "ml",
      "prescription",
      "doctor",
      "medicine",
      "expiry",
      "batch",
    ],
  };

  /*
 * ==================================================
 * OCR CONTEXT EVIDENCE
 * ==================================================
 *
 * Full OCR text is weak evidence because it can
 * contain unrelated invoice sections, tax text,
 * footer text, addresses, payment information, etc.
 *
 * Product evidence remains the primary signal.
 *
 * Context is only a supporting signal and is capped
 * so unrelated OCR text cannot overpower the product.
 */

Object.entries(
  contextSignals
).forEach(
  ([category, signals]) => {
    let contextScore = 0;

    signals.forEach(
      (signal) => {
        if (
          hasPhrase(
            fullText,
            signal
          )
        ) {
          contextScore += 1;
        }
      }
    );

    /*
     * Never allow noisy full-receipt OCR context
     * to dominate product evidence.
     */
    scores[category] += Math.min(
      contextScore,
      4
    );
  }
);

  /*
   * ==================================================
   * FIND WINNER
   * ==================================================
   */

  const ranked =
    Object.entries(scores)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );

      console.log(
  "================ CATEGORY DEBUG ================"
);

console.log("PRODUCT:", product);

console.log(
  "ELECTRONICS:",
  scores.Electronics
);

console.log(
  "FASHION:",
  scores.Fashion
);

console.log(
  "HOME:",
  scores.Home
);

console.log(
  "FOOD:",
  scores.Food
);

console.log(
  "TRAVEL:",
  scores.Travel
);

console.log(
  "HEALTH:",
  scores.Health
);

console.log(
  "RANKED:",
  ranked
);

console.log(
  "================================================="
);

  const best =
    ranked[0];

  const second =
    ranked[1];
    

  /*
   * ==================================================
   * CONFIDENCE / SAFETY
   * ==================================================
   *
   * Do not force a category when evidence
   * is weak or ambiguous.
   */

  if (
    !best ||
    best[1] < 4
  ) {
    return "Others";
  }

  if (
    second &&
    best[1] === second[1]
  ) {
    return "Others";
  }

  /*
   * Require stronger evidence when the
   * category comes only from weak context.
   */

  if (
    best[1] < 6
  ) {
    return "Others";
  }

  return best[0];
}


/* ==========================================================================
   16. CONFIDENCE
========================================================================== */

function calculateConfidence({
  storeName,
  productName,
  purchaseDate,
  amount,
  paymentMethod,
  category,
}) {
  let score = 0;

  if (
    storeName &&
    storeName !== "Unknown"
  ) {
    score += 0.2;
  }

  if (productName) {
    score += 0.25;
  }

  if (purchaseDate) {
    score += 0.2;
  }

  if (
    Number(amount) > 0
  ) {
    score += 0.2;
  }

  if (paymentMethod) {
    score += 0.05;
  }

  if (
    category &&
    category !== "Others"
  ) {
    score += 0.1;
  }

  return Number(
    Math.min(
      score,
      1
    ).toFixed(2)
  );
}


/* ==========================================================================
   17. MAIN PARSER
========================================================================== */

export function parseGenericReceipt(
  text
) {
  if (
    !text ||
    typeof text !== "string"
  ) {
    return {
      storeName: "",
      productName: "",
      purchaseDate: "",
      amount: 0,
      paymentMethod: "",
      category: "Others",
      confidence: 0,
    };
  }

  const normalizedText =
    String(text)
      .replace(/\r/g, "")
      .trim();

  const storeName =
    extractStore(
      normalizedText
    );

  const productName =
    extractProduct(
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
    detectCategory(
      productName,
      normalizedText
    );

  const confidence =
    calculateConfidence({
      storeName,
      productName,
      purchaseDate,
      amount,
      paymentMethod,
      category,
    });

  const result = {
    storeName,
    productName,
    purchaseDate,
    amount,
    paymentMethod,
    category,
    confidence,
  };

  console.log(
    "========== GENERIC OCR PARSER =========="
  );

  console.log(
    "Store:",
    storeName
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
    "========================================="
  );

  return result;
}

export default parseGenericReceipt;
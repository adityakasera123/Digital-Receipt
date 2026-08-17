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
  const text = lower(value);

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

  return locations.includes(text);
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
  return (
    /\b(?:igst|cgst|sgst|cess|gst)\b/i.test(value) &&
    /%|\d+(?:\.\d+)?/.test(value)
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
    isTableNoise(text)
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

  if (strongBusinessPattern.test(text)) {
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
   */
  if (
    /^[A-Za-z][A-Za-z0-9&.'-]{2,40}$/.test(text)
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

  /*
   * Priority 1:
   * Explicit seller / merchant context.
   */
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /^(?:sold\s*by|seller|merchant|billed\s*from|bill\s*from)\s*:?\s*(.*)$/i
    );

    if (!match) {
      continue;
    }

    const direct = clean(match[1])
      .split(",")[0]
      .trim();

    /*
     * Direct business:
     *
     * Sold by: TrendyDuniya
     */
    if (
      direct &&
      looksLikeBusinessName(direct) &&
      !looksLikePersonName(direct)
    ) {
      return direct;
    }

    /*
     * Person first, business nearby:
     *
     * Sold by: ADITYA KASERA
     * TrendyDuniya
     *
     * Sold by: Peekesh Kumar
     * Mahima Bangles
     */
    for (
      let offset = 1;
      offset <= 6;
      offset++
    ) {
      const candidate = clean(
        lines[i + offset] || ""
      )
        .split(",")[0]
        .trim();

      if (!candidate) {
        continue;
      }

      if (
        isAddress(candidate) ||
        isNumberOnly(candidate) ||
        isTableNoise(candidate)
      ) {
        continue;
      }

      if (
        isFooterNoise(candidate) ||
        isPaymentText(candidate) ||
        isCommonLocation(candidate)
      ) {
        continue;
      }

      if (
        looksLikeBusinessName(candidate) &&
        !looksLikePersonName(candidate)
      ) {
        return candidate;
      }
    }
  }

  /*
   * Priority 2:
   * GSTIN context.
   *
   * Merchant is commonly above GSTIN.
   */
  for (let i = 0; i < lines.length; i++) {
    if (
      !/\bgstin\b|\bgst\s*(?:no|number)\b/i.test(
        lines[i]
      )
    ) {
      continue;
    }

    for (
      let offset = 1;
      offset <= 5;
      offset++
    ) {
      const candidate = clean(
        lines[i - offset] || ""
      )
        .split(",")[0]
        .trim();

      if (!candidate) {
        continue;
      }

      if (
        isAddress(candidate) ||
        isNumberOnly(candidate) ||
        isTableNoise(candidate)
      ) {
        continue;
      }

      if (
        looksLikeBusinessName(candidate) &&
        !looksLikePersonName(candidate)
      ) {
        return candidate;
      }
    }
  }

  /*
   * Priority 3:
   * Top-of-invoice fallback.
   */
  for (
    const line of lines.slice(0, 60)
  ) {
    const candidate = clean(line)
      .split(",")[0]
      .trim();

    if (!candidate) {
      continue;
    }

    if (
      isAddress(candidate) ||
      isNumberOnly(candidate) ||
      isTableNoise(candidate)
    ) {
      continue;
    }

    if (
      isFooterNoise(candidate) ||
      isPaymentText(candidate) ||
      isCommonLocation(candidate)
    ) {
      continue;
    }

    if (
      looksLikeBusinessName(candidate) &&
      !looksLikePersonName(candidate)
    ) {
      return candidate;
    }
  }

  return "Unknown";
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

  for (let i = 0; i < lines.length; i++) {
    if (
      excludedRange &&
      i >= excludedRange.start &&
      i < excludedRange.end
    ) {
      continue;
    }

    /*
     * OCR may return table headers as:
     *
     * Description | HSN | Qty | ...
     *
     * OR split them over multiple lines.
     */

    const windows = [
      lines.slice(i, i + 1).join(" "),
      lines.slice(i, i + 2).join(" "),
      lines.slice(i, i + 3).join(" "),
    ];

    for (
      let size = 0;
      size < windows.length;
      size++
    ) {
      const score =
        scoreTableHeader(
          windows[size]
        );

      if (score < 10) {
        continue;
      }

      /*
       * A real invoice table MUST have
       * Description / Product / Item evidence.
       */

      if (
        !/\b(?:description|particulars|item|product)\b/i.test(
          windows[size]
        )
      ) {
        continue;
      }

      const candidate = {
        index: i,
        endIndex: i + size,
        score,
      };

      if (
        !best ||
        candidate.score > best.score ||
        (
          candidate.score === best.score &&
          candidate.index > best.index
        )
      ) {
        best = candidate;
      }
    }
  }

  return best;
}

function isLikelyTableColumnLine(
  value = ""
) {
  const text = lower(value);

  return /^(?:hsn|sku|qty|quantity|gross|gross\s+amount|discount|taxable|taxable\s+value|tax|taxes|total|rate|price|amount)\b/i.test(
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
  product = product.replace(
    /^(?:description|product(?:\s+name)?|item(?:\s+name)?|particulars)\s*:?\s*/i,
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
   * Invoice metadata must never become product.
   */
  if (
    /^(?:invoice|order|gstin|gst|total|subtotal|tax|discount|payment|terms|conditions|bill\s+to|ship\s+to|other\s+charges|customer\s+address|details)\b/i.test(
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

  const keywordHit =
    productKeywords.some(
      (keyword) =>
        lower(text).includes(keyword)
    );

  if (keywordHit) {
    score += 35;
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
   * Description header, NOT after the entire
   * multi-line header window.
   */
  let start = table.index + 1;

  /*
   * Skip invoice column headers.
   *
   * OCR may produce:
   *
   * Description
   * HSN
   * Qty
   * Gross Amount
   * Discount
   * Taxable Value
   * Taxes
   * Total
   */
  while (
    start < lines.length &&
    (
      isLikelyTableColumnLine(lines[start]) ||
      /^description$/i.test(clean(lines[start])) ||
      /^particulars$/i.test(clean(lines[start])) ||
      /^item(?:\s+name)?$/i.test(clean(lines[start])) ||
      /^product(?:\s+name)?$/i.test(clean(lines[start]))
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
     * HARD STOP:
     * These are invoice footer / summary sections.
     */
    if (
      /^(?:total|grand\s+total|subtotal|sub\s+total)$/i.test(line) ||
      /^other\s+charges\b/i.test(line) ||
      /^terms?\s*(?:&|and)\s*conditions\b/i.test(line) ||
      /^tax\s+is\s+not\s+payable\b/i.test(line) ||
      /^this\s+is\s+a\s+computer\s+generated\b/i.test(line) ||
      /^computer\s+generated\s+invoice\b/i.test(line) ||
      /^notes?\b/i.test(line) ||
      /^remarks?\b/i.test(line)
    ) {
      break;
    }

    /*
     * Stop when we reach tax lines.
     */
    if (isTaxLine(line)) {
      if (parts.length) break;
      continue;
    }

    /*
     * Ignore numeric / invoice-column lines.
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
     * Never accept PRODUCT DETAILS metadata.
     */
    if (
      isProductMetadataLine(line) ||
      isTableNoise(line)
    ) {
      if (parts.length) break;
      continue;
    }

    /*
     * Do not allow payment/footer/address text.
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
     * IMPORTANT:
     * Reject obvious legal/footer sentences.
     */
    if (
      /\b(?:applicable\s+to\s+your\s+order|computer\s+generated|does\s+not\s+require\s+signature|reverse\s+charge\s+basis|logistics?\s+fee|city\s+and\/or\s+online\s+payments?)\b/i.test(
        line
      )
    ) {
      break;
    }

    const candidate =
      cleanProductCandidate(line);

    if (!candidate) continue;

    if (
      looksLikeProduct(candidate)
    ) {
      parts.push(candidate);
      continue;
    }

    /*
     * Once we have started collecting a product,
     * the first invalid line means the product row
     * is finished.
     */
    if (parts.length) {
      break;
    }
  }

  return unique(parts).join(" ");
}

function extractProductDetails(
  text
) {
  const lines =
    getLines(text);

  const metadataRange =
    findProductDetailsSection(
      lines
    );

  const table =
    findDescriptionTable(
      lines,
      metadataRange
    );

  const candidates = [];

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
        ),
        source: "description-table",
      });
    }
  }

  /*
   * ==================================================
   * 2. EXPLICIT PRODUCT LABEL
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

    const match =
      lines[i].match(
        /^(?:product\s*name|product|item\s*name|item|description|particulars)\s*:?\s*(.*)$/i
      );

    if (!match) {
      continue;
    }

    const parts = [];

    const first =
      cleanProductCandidate(
        match[1]
      );

    if (
      looksLikeProduct(first)
    ) {
      parts.push(first);
    }

    /*
     * Collect wrapped multiline description.
     */

    for (
      let j = i + 1;
      j < Math.min(
        lines.length,
        i + 10
      );
      j++
    ) {
      const next =
        lines[j];

      if (
        /^(?:total|grand\s+total|other\s+charges|payment)\b/i.test(
          next
        )
      ) {
        break;
      }

      if (
        isTableNoise(next) ||
        isNumberOnly(next) ||
        isTaxLine(next)
      ) {
        if (parts.length) {
          break;
        }

        continue;
      }

      if (
        isLikelyTableColumnLine(
          next
        )
      ) {
        if (parts.length) {
          break;
        }

        continue;
      }

      const candidate =
        cleanProductCandidate(
          next
        );

      if (
        looksLikeProduct(
          candidate
        )
      ) {
        parts.push(candidate);
      } else if (parts.length) {
        break;
      }
    }

    if (parts.length) {
      const value =
        unique(parts).join(" ");

      candidates.push({
        value,
        score: productScore(
          value,
          {
            explicitLabel: true,
            afterDescription: true,
          }
        ),
        source: "explicit-label",
      });
    }
  }

  /*
   * ==================================================
   * 3. KEYWORD FALLBACK
   * For invoices without a clear table.
   * ==================================================
   */

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
  cleanProductCandidate(lines[i]);

if (
  /^(?:this\s+is|tax\s+is|applicable\s+to|other\s+charges|computer\s+generated|does\s+not\s+require|terms|conditions|charges\s+for\s+logistics?)\b/i.test(
    first
  )
) {
  continue;
}

if (
  /\b(?:applicable\s+to\s+your\s+order|include\s+charges\s+for\s+logistics|computer\s+generated\s+invoice)\b/i.test(
    first
  )
) {
  continue;
}

if (!looksLikeProduct(first)) {
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

      if (
        !next ||
        isTableNoise(next) ||
        isNumberOnly(next) ||
        isTaxLine(next)
      ) {
        break;
      }

      if (
        /^(?:total|grand\s+total|other\s+charges|payment)\b/i.test(
          next
        )
      ) {
        break;
      }

      if (
        isLikelyTableColumnLine(
          next
        )
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
      source: "keyword-fallback",
    });
  }

  /*
   * ==================================================
   * BEST CANDIDATE
   * ==================================================
   */

  candidates.sort(
    (a, b) =>
      b.score - a.score ||
      b.value.length - a.value.length
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

  console.log(
    "Product Candidates:",
    candidates
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

  /*
   * Invoice Date gets highest priority.
   */
  for (
    const line of lines
  ) {
    const match =
      line.match(
        /invoice\s*date\s*:?\s*(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/i
      );

    if (match) {
      return normalizeOCRDate(
        match[1]
      );
    }
  }

  /*
   * Purchase Date.
   */
  for (
    const line of lines
  ) {
    const match =
      line.match(
        /purchase\s*date\s*:?\s*(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/i
      );

    if (match) {
      return normalizeOCRDate(
        match[1]
      );
    }
  }

  /*
   * Purchased On.
   */
  for (
    const line of lines
  ) {
    const match =
      line.match(
        /purchased\s*on\s*:?\s*(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/i
      );

    if (match) {
      return normalizeOCRDate(
        match[1]
      );
    }
  }

  /*
   * Order Date fallback.
   */
  for (
    const line of lines
  ) {
    const match =
      line.match(
        /order\s*date\s*:?\s*(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/i
      );

    if (match) {
      return normalizeOCRDate(
        match[1]
      );
    }
  }

  /*
   * Generic date label.
   */
  for (
    const line of lines
  ) {
    const match =
      line.match(
        /\bdate\s*:?\s*(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})/i
      );

    if (match) {
      return normalizeOCRDate(
        match[1]
      );
    }
  }

  /*
   * Last fallback.
   */
  const dates =
    text.match(
      /\b\d{1,4}[./-]\d{1,2}[./-]\d{2,4}\b/g
    ) || [];

  for (
    const date of dates
  ) {
    const normalized =
      normalizeOCRDate(date);

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
   * LEVEL 1
   * Strong final-value labels.
   */
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
   * LEVEL 2
   *
   * Final Total section.
   *
   * Example:
   *
   * Total
   * Rs.64.83
   * Rs.425.00
   *
   * We choose 425.
   */
  const totalIndex =
    findTotalSectionIndex(lines);

  if (
    totalIndex !== -1
  ) {
    const amounts = [];

    for (
      let i = totalIndex;
      i < Math.min(
        lines.length,
        totalIndex + 8
      );
      i++
    ) {
      const line =
        lines[i];

      if (
        i > totalIndex &&
        /^payment\b|^terms?\b/i.test(
          line
        )
      ) {
        break;
      }

      amounts.push(
        ...extractAmountsFromLine(
          line
        )
      );
    }

    if (amounts.length) {
      return amounts[
        amounts.length - 1
      ];
    }
  }


  /*
   * LEVEL 3
   *
   * Any later line containing Total.
   */
  for (
    let i = lines.length - 1;
    i >= 0;
    i--
  ) {
    if (
      !/\btotal\b/i.test(
        lines[i]
      )
    ) {
      continue;
    }

    if (
      /\bsub\s*-?total\b/i.test(
        lines[i]
      )
    ) {
      continue;
    }

    const amounts =
      extractAmountsFromLine(
        lines[i]
      );

    if (amounts.length) {
      return amounts[
        amounts.length - 1
      ];
    }
  }


  /*
   * LEVEL 4
   * Other explicit final amount labels.
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
   * LEVEL 5
   *
   * Conservative generic fallback.
   *
   * We do NOT simply select the largest number.
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
  const value =
    lower(text);

  /*
   * COD first.
   */
  if (
    /\b(?:cod|c\.?o\.?d\.?|cash\s+on\s+delivery|cash\s+on\s+del)\b/i.test(
      value
    )
  ) {
    return "Cash on Delivery";
  }

  if (
    /\b(?:upi|gpay|google\s*pay|phonepe|paytm)\b/i.test(
      value
    )
  ) {
    return "UPI";
  }

  if (
    /\bcredit\s+card\b/i.test(
      value
    )
  ) {
    return "Credit Card";
  }

  if (
    /\bdebit\s+card\b/i.test(
      value
    )
  ) {
    return "Debit Card";
  }

  if (
    /\b(?:visa|mastercard|rupay)\b/i.test(
      value
    )
  ) {
    return "Card";
  }

  if (
    /\b(?:net\s+banking|internet\s+banking|online\s+banking)\b/i.test(
      value
    )
  ) {
    return "Net Banking";
  }

  if (
    /\b(?:wallet|amazon\s+pay|mobikwik|freecharge)\b/i.test(
      value
    )
  ) {
    return "Wallet";
  }

  if (
    /\b(?:cash\s+payment|paid\s+in\s+cash)\b/i.test(
      value
    )
  ) {
    return "Cash";
  }

  /*
   * Never guess a payment method.
   */
  return "";
}


/* ==========================================================================
   15. CATEGORY
========================================================================== */

function detectCategory(
  productName = "",
  text = ""
) {
  const product =
    lower(productName);

  const electronics = [
    "iphone",
    "ipad",
    "mobile",
    "phone",
    "smartphone",
    "laptop",
    "computer",
    "tablet",
    "airpods",
    "earbuds",
    "earphone",
    "headphone",
    "speaker",
    "charger",
    "power bank",
    "usb cable",
    "cable",
    "keyboard",
    "mouse",
    "camera",
    "television",
    "tv",
    "monitor",
    "printer",
    "watch",
    "smartwatch",
    "blender",
    "juicer",
    "mixer",
    "kettle",
    "microwave",
    "refrigerator",
    "fridge",
    "washing machine",
    "appliance",
    "electronics",
  ];

  const fashion = [
    "shirt",
    "t-shirt",
    "tshirt",
    "jeans",
    "trouser",
    "pants",
    "pant",
    "shorts",
    "dress",
    "skirt",
    "kurta",
    "kurti",
    "saree",
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
    "sandals",
    "slipper",
    "bangles",
    "jewellery",
    "jewelry",
    "bracelet",
    "necklace",
    "ring",
    "fashion",
    "apparel",
  ];

  const home = [
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
  ];

  const food = [
    "grocery",
    "chocolate",
    "snack",
    "coffee",
    "tea",
    "biscuit",
    "dry fruit",
    "dry fruits",
    "food",
  ];

  const travel = [
    "flight",
    "airline",
    "hotel",
    "train ticket",
    "bus ticket",
    "travel booking",
    "reservation",
  ];

  if (
    electronics.some(
      (keyword) =>
        product.includes(keyword)
    )
  ) {
    return "Electronics";
  }

  if (
    fashion.some(
      (keyword) =>
        product.includes(keyword)
    )
  ) {
    return "Fashion";
  }

  if (
    home.some(
      (keyword) =>
        product.includes(keyword)
    )
  ) {
    return "Home";
  }

  if (
    food.some(
      (keyword) =>
        product.includes(keyword)
    )
  ) {
    return "Food";
  }

  if (
    travel.some(
      (keyword) =>
        product.includes(keyword)
    )
  ) {
    return "Travel";
  }

  const invoice =
    lower(text);

  if (
    /\b(?:flight|airline|train ticket|bus ticket|hotel booking)\b/i.test(
      invoice
    )
  ) {
    return "Travel";
  }

  return "Others";
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
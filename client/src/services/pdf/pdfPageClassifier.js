// ==========================================
// PDF PAGE CLASSIFIER
// ==========================================
// Classifies each PDF page before parsing.
//
// IMPORTANT:
// This file does NOT extract receipt data.
// It only answers:
//
// "What kind of document/page is this?"
//
// Existing parsers remain untouched.
// ==========================================

export const PDF_PAGE_TYPES = {
  PRODUCT_INVOICE: "PRODUCT_INVOICE",
  CHARGE_INVOICE: "CHARGE_INVOICE",
  SERVICE_INVOICE: "SERVICE_INVOICE",
  TRANSPORT_DOCUMENT: "TRANSPORT_DOCUMENT",
  SUPPORTING_DOCUMENT: "SUPPORTING_DOCUMENT",
  UNKNOWN: "UNKNOWN",
};

// ==========================================
// Helpers
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

function hasAny(text, patterns) {
  return patterns.some((pattern) =>
    pattern.test(text)
  );
}

// ==========================================
// PRODUCT INVOICE
// ==========================================

// ==========================================
// PRODUCT INVOICE
// ==========================================

function detectProductInvoice(text, reasons) {
  let score = 0;

  // ------------------------------------------
  // Basic invoice signals
  // ------------------------------------------

  if (/\btax invoice\b/i.test(text)) {
    score += 20;
    reasons.push("tax invoice");
  }

  if (
    /\bnature of supply\s*:\s*goods\b/i.test(text)
  ) {
    score += 25;
    reasons.push("goods supply");
  }

  if (/\bitem description\b/i.test(text)) {
    score += 25;
    reasons.push("item description");
  }

  if (/\bqty\b/i.test(text)) {
    score += 15;
    reasons.push("qty");
  }

  if (/\bmrp\b/i.test(text)) {
    score += 10;
    reasons.push("mrp");
  }

  if (/\bhsn\b/i.test(text)) {
    score += 10;
    reasons.push("hsn");
  }

  if (/\btotal\b/i.test(text)) {
    score += 10;
    reasons.push("total");
  }

  if (/\bamount in words\b/i.test(text)) {
    score += 5;
    reasons.push("amount in words");
  }

  // ------------------------------------------
  // IMPORTANT:
  // Actual product evidence
  //
  // A charge-only invoice can contain:
  // tax invoice + item description + qty +
  // MRP + HSN + total.
  //
  // So those signals alone are NOT enough.
  // ------------------------------------------

  const chargeOnlyPattern =
    /\b(handling charge|delivery charge|platform fee|convenience fee|shipping charge|payment handling charges|other charges)\b/gi;

  const chargeMatches =
    text.match(chargeOnlyPattern) || [];

  const hasChargeItem =
    chargeMatches.length > 0;

  // ------------------------------------------
  // Product-like HSN evidence
  //
  // Product invoices generally contain
  // actual item descriptions with HSN codes.
  // ------------------------------------------

  const productHSNPattern =
    /\b[A-Za-z][A-Za-z0-9\s().,&/-]{2,80}\s*\(?HSN[-\s:]?\d{4,8}\)?/i;

  const hasProductHSN =
    productHSNPattern.test(text);

  if (hasProductHSN) {
    score += 25;
    reasons.push("product hsn description");
  }

  // ------------------------------------------
  // Strong product keywords
  // ------------------------------------------

  const productSignals = [
  "bottle",
  "packet",
  "pack",
  "kg",
  "gram",
  "ml",
  "litre",
  "liter",
  "rice",
  "milk",
  "bread",
  "biscuit",
  "noodles",
  "tomato",
  "onion",
  "chilli",
  "cucumber",
  "daliya",
];

  const hasProductKeyword =
    productSignals.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );

  if (hasProductKeyword) {
    score += 15;
    reasons.push("product evidence");
  }

  const isChargeOnlyPage =
  /\b(handling charge|delivery charge|platform fee|convenience fee|shipping charge|payment handling charges)\b/i.test(
    text
  );

if (isChargeOnlyPage) {
  score = Math.min(score, 30);
  reasons.push("charge-only content");
}

  // ------------------------------------------
  // IMPORTANT:
  // If page contains ONLY charge-type items,
  // remove product confidence.
  //
  // This prevents Page 4 of Blinkit from being
  // classified as PRODUCT_INVOICE.
  // ------------------------------------------

  if (
    hasChargeItem &&
    !hasProductHSN &&
    !hasProductKeyword
  ) {
    score = Math.min(score, 30);
    reasons.push("charge-only content");
  }

  return score;
}

// ==========================================
// CHARGE INVOICE
// ==========================================

function detectChargeInvoice(text, reasons) {
  let score = 0;

  if (
    /\bhandling charge\b/i.test(text)
  ) {
    score += 40;
    reasons.push("handling charge");
  }

  if (
    /\bdelivery charge\b/i.test(text)
  ) {
    score += 40;
    reasons.push("delivery charge");
  }

  if (
    /\bplatform fee\b/i.test(text)
  ) {
    score += 40;
    reasons.push("platform fee");
  }

  if (
    /\bpayment handling charges\b/i.test(text)
  ) {
    score += 35;
    reasons.push("payment handling charges");
  }

  if (
    /\bconvenience fee\b/i.test(text)
  ) {
    score += 35;
    reasons.push("convenience fee");
  }

  if (
    /\bother charges\b/i.test(text)
  ) {
    score += 20;
    reasons.push("other charges");
  }

  if (
    /\bnature of supply\s*:\s*service\b/i.test(text)
  ) {
    score += 20;
    reasons.push("service supply");
  }

  return score;
}

// ==========================================
// SERVICE INVOICE
// ==========================================

function detectServiceInvoice(text, reasons) {
  let score = 0;

  if (
    /\bnature of supply\s*:\s*service\b/i.test(text)
  ) {
    score += 30;
    reasons.push("service supply");
  }

  if (/\bsac\b/i.test(text)) {
    score += 20;
    reasons.push("sac");
  }

  if (
    /\bservice\b/i.test(text)
  ) {
    score += 10;
    reasons.push("service");
  }

  return score;
}

// ==========================================
// TRANSPORT DOCUMENT
// ==========================================

function detectTransportDocument(text, reasons) {
  let score = 0;

  if (
    /\bdetails of goods transported\b/i.test(text)
  ) {
    score += 50;
    reasons.push("goods transported");
  }

  if (
    /\bconsignor details\b/i.test(text)
  ) {
    score += 20;
    reasons.push("consignor");
  }

  if (
    /\bconsignee details\b/i.test(text)
  ) {
    score += 20;
    reasons.push("consignee");
  }

  if (
    /\bregistration no\.?\s*of goods carriage\b/i.test(
      text
    )
  ) {
    score += 25;
    reasons.push("goods carriage");
  }

  if (
    /\bplace of origin\b/i.test(text)
  ) {
    score += 10;
    reasons.push("place of origin");
  }

  if (
    /\bdestination\b/i.test(text)
  ) {
    score += 10;
    reasons.push("destination");
  }

  if (/\bgt charges\b/i.test(text)) {
    score += 20;
    reasons.push("gt charges");
  }

  return score;
}

// ==========================================
// SUPPORTING DOCUMENT
// ==========================================

function detectSupportingDocument(text, reasons) {
  let score = 0;

  if (
    /\be\.?\s*&\s*o\.?e\.?\b/i.test(text)
  ) {
    score += 5;
    reasons.push("footer");
  }

  if (
    /\bauthorized signatory\b/i.test(text)
  ) {
    score += 5;
    reasons.push("authorized signatory");
  }

  if (
    /\bdigital signature\b/i.test(text)
  ) {
    score += 10;
    reasons.push("digital signature");
  }

  if (
    /\bterms\s*(and|&)\s*conditions\b/i.test(text)
  ) {
    score += 10;
    reasons.push("terms and conditions");
  }

  return score;
}

// ==========================================
// MAIN CLASSIFIER
// ==========================================

export function classifyPDFPage(text) {
  const normalizedText = normalizeText(text);

  if (!normalizedText) {
    return {
      type: PDF_PAGE_TYPES.UNKNOWN,
      confidence: 0,
      score: 0,
      reasons: ["empty page"],
    };
  }

  const reasons = [];

  const productScore =
    detectProductInvoice(
      normalizedText,
      reasons
    );

  const chargeReasons = [];
  const serviceReasons = [];
  const transportReasons = [];
  const supportingReasons = [];

  const chargeScore =
    detectChargeInvoice(
      normalizedText,
      chargeReasons
    );

  const serviceScore =
    detectServiceInvoice(
      normalizedText,
      serviceReasons
    );

  const transportScore =
    detectTransportDocument(
      normalizedText,
      transportReasons
    );

  const supportingScore =
    detectSupportingDocument(
      normalizedText,
      supportingReasons
    );

  const candidates = [
    {
      type: PDF_PAGE_TYPES.PRODUCT_INVOICE,
      score: productScore,
      reasons,
    },
    {
      type: PDF_PAGE_TYPES.CHARGE_INVOICE,
      score: chargeScore,
      reasons: chargeReasons,
    },
    {
      type: PDF_PAGE_TYPES.SERVICE_INVOICE,
      score: serviceScore,
      reasons: serviceReasons,
    },
    {
      type: PDF_PAGE_TYPES.TRANSPORT_DOCUMENT,
      score: transportScore,
      reasons: transportReasons,
    },
    {
      type: PDF_PAGE_TYPES.SUPPORTING_DOCUMENT,
      score: supportingScore,
      reasons: supportingReasons,
    },
  ];

  candidates.sort(
    (a, b) => b.score - a.score
  );

  const best = candidates[0];

  if (!best || best.score < 20) {
    return {
      type: PDF_PAGE_TYPES.UNKNOWN,
      confidence: 0,
      score: best?.score || 0,
      reasons: best?.reasons || [],
    };
  }

  // ==========================================
  // Confidence
  // ==========================================

  const confidence = Number(
    Math.min(best.score / 100, 1).toFixed(2)
  );

  const result = {
    type: best.type,
    confidence,
    score: best.score,
    reasons: best.reasons,
  };

  // ==========================================
  // Debug
  // ==========================================

  console.log(
    "========== PDF PAGE CLASSIFICATION =========="
  );

  console.log(
    "Type:",
    result.type
  );

  console.log(
    "Score:",
    result.score
  );

  console.log(
    "Confidence:",
    result.confidence
  );

  console.log(
    "Reasons:",
    result.reasons
  );

  console.log(
    "============================================="
  );

  return result;
}
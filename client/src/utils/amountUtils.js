// src/utils/amountUtils.js

export function normalizeAmount(value) {
  if (value === null || value === undefined || value === "") return 0;

  let text = String(value).trim();

  // Remove currency symbols and spaces
  text = text.replace(/[₹$€£\\s]/g, "");

  // Remove commas used as thousand separators
  text = text.replace(/,/g, "");

  // OCR pattern: 1.195.00 -> 1195.00
  if (/^\\d+\\.\\d{3}\\.\\d{2}$/.test(text)) {
    text = text.replace(".", "");
  }

  // OCR pattern: 21.195.00 -> 1195.00
  if (/^\\d{2}\\.\\d{3}\\.\\d{2}$/.test(text)) {
    text = text.substring(2).replace(".", "");
  }

  // European format: 1195,00 -> 1195.00
  if (/^\\d+,\\d{2}$/.test(text)) {
    text = text.replace(",", ".");
  }

  const number = parseFloat(text);

  if (Number.isNaN(number)) return 0;

  return Number(number.toFixed(2));
}

// Check if a number looks like a realistic invoice amount
export function isReasonableAmount(amount) {
  if (!Number.isFinite(amount)) return false;

  // Ignore quantities
  if (amount <= 10) return false;

  // Ignore obvious PIN codes
  if (amount >= 100000 && amount <= 999999) return false;

  // Ignore impossible invoice values
  if (amount > 1000000) return false;

  return true;
}
// src/utils/amountUtils.js

export function normalizeAmount(value) {
  if (!value) return 0;

  let text = String(value).trim();

  // Remove currency symbols and spaces
  text = text.replace(/[₹,\\s]/g, "");

  // Fix OCR pattern: 1.195.00 -> 1195.00
  if (/^\\d+\\.\\d{3}\\.\\d{2}$/.test(text)) {
    text = text.replace(".", "");
  }

  // Fix OCR pattern: 21.195.00 -> 1195.00
  if (/^\\d{2}\\.\\d{3}\\.\\d{2}$/.test(text)) {
    text = text.substring(2).replace(".", "");
  }

  // European format: 1195,00
  if (/^\\d+,\\d{2}$/.test(text)) {
    text = text.replace(",", ".");
  }

  const number = parseFloat(text);

  if (Number.isNaN(number)) return 0;

  return Number(number.toFixed(2));
}
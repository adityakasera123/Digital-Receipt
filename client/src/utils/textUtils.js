// src/utils/textUtils.js

export function normalizeText(text) {
  if (!text) return "";

  return text
    .replace(/\\r/g, "")
    .replace(/\\t/g, " ")
    .replace(/\\s+/g, " ")
    .trim();
}

export function splitLines(text) {
  if (!text) return [];

  return text
    .split("\\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
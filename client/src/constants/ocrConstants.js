// src/constants/ocrConstants.js

export const OCR_STATES = {
  IDLE: "idle",
  PROCESSING: "processing",
  REVIEW: "review",
  FAILED: "failed",
};

export const OCR_PROCESSING_MESSAGES = [
  "Scanning your receipt...",
  "Extracting purchase details...",
  "Detecting store, date, and amount...",
  "Preparing your editable receipt...",
];

export const OCR_PROCESSING_DURATION = 2000; // 2 seconds
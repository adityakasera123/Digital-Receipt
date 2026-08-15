// src/hooks/useOCR.js

import { useState } from "react";
import { OCR_STATES } from "../constants/ocrConstants";
import { runOCR } from "../services/ocr";

export function useOCR() {
  const [ocrState, setOCRState] = useState(OCR_STATES.IDLE);
  const [ocrData, setOCRData] = useState(null);
  const [ocrError, setOCRError] = useState(null);

  const processReceipt = async (file) => {
    try {
      setOCRState(OCR_STATES.PROCESSING);
      setOCRError(null);

      const result = await runOCR(file);

      setOCRData(result);
      setOCRState(OCR_STATES.SUCCESS);

      return result;
    } catch (error) {
      console.error("OCR Error:", error);

      setOCRError(error.message || "OCR failed");
      setOCRState(OCR_STATES.ERROR);

      throw error;
    }
  };

  const resetOCR = () => {
    setOCRState(OCR_STATES.IDLE);
    setOCRData(null);
    setOCRError(null);
  };

  return {
    ocrState,
    setOCRState,
    ocrData,
    setOCRData,
    ocrError,
    setOCRError,
    processReceipt,
    resetOCR,
  };
}
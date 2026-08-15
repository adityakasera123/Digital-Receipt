// src/hooks/useOCR.js

import { useState } from "react";
import { OCR_STATES } from "../constants/ocrConstants";

export function useOCR() {
  const [ocrState, setOCRState] = useState(OCR_STATES.IDLE);
  const [ocrData, setOCRData] = useState(null);
  const [ocrError, setOCRError] = useState(null);

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
    resetOCR,
  };
}
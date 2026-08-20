import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ScannerAnimation from "../ui/ScannerAnimation";
import ProgressBar from "../ui/ProgressBar";
import { OCR_PROCESSING_MESSAGES } from "../../constants/ocrConstants";

export default function OCRProcessingScreen({ image, file }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // ==========================================
  // Preview URL
  // ==========================================

  const previewUrl = useMemo(() => {
    if (!image) {
      return null;
    }

    // If actual File object
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }

    // If already a blob/string URL
    return image;
  }, [image]);

  // ==========================================
  // Cleanup Object URL
  // ==========================================

  useEffect(() => {
    return () => {
      if (image instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image, previewUrl]);

  // ==========================================
  // Processing Animation
  // ==========================================

  useEffect(() => {
    setProgress(15);

    const p1 = setTimeout(() => {
      setProgress(40);
    }, 350);

    const p2 = setTimeout(() => {
      setProgress(70);
    }, 800);

    const p3 = setTimeout(() => {
      setProgress(100);
    }, 1500);

    const m1 = setTimeout(() => {
      setMessageIndex(1);
    }, 350);

    const m2 = setTimeout(() => {
      setMessageIndex(2);
    }, 800);

    const m3 = setTimeout(() => {
      setMessageIndex(3);
    }, 1400);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);

      clearTimeout(m1);
      clearTimeout(m2);
      clearTimeout(m3);
    };
  }, []);

  // ==========================================
  // Detect PDF
  // ==========================================

const isPDF =
  file instanceof File &&
  file.type === "application/pdf";

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.96,
        y: 10,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
        y: -10,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-3xl border border-default bg-surface p-4 shadow-lg sm:p-5"
    >
      {/* ==========================================
          Header
      ========================================== */}

      <div className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent shadow-[0_0_10px_rgba(59,130,246,0.45)]" />
        </div>

        <h2 className="text-lg font-semibold text-primary sm:text-xl">
          Scanning your receipt
        </h2>

        <p className="mt-1 text-xs text-secondary sm:text-sm">
          Billvora is extracting purchase details
        </p>
      </div>

      {/* ==========================================
          Receipt Preview
      ========================================== */}

      <div className="relative mt-3 overflow-hidden rounded-2xl border border-default bg-surface-secondary">
        <div className="h-56 w-full sm:h-64 md:h-72">

          {previewUrl ? (
  isPDF ? (
    <iframe
      src={previewUrl}
      title="Receipt PDF preview"
      className="h-full w-full border-0"
    />
  ) : (
    <img
      src={previewUrl}
      alt="Receipt preview"
      className="h-full w-full object-contain p-2"
    />
  )
) : (
            /* ==================================
               Empty Preview
            ================================== */

            <div className="flex h-full w-full items-center justify-center text-sm text-secondary">
              Receipt preview
            </div>
          )}

          {/* Scanner Animation */}
          <ScannerAnimation />
        </div>
      </div>

      {/* ==========================================
          Progress
      ========================================== */}

      <div className="mt-2.5">
        <ProgressBar progress={progress} />

        <div className="mt-2 min-h-[20px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              transition={{
                duration: 0.18,
              }}
              className="text-center text-xs font-medium text-primary sm:text-sm"
            >
              {OCR_PROCESSING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <p className="mt-1 text-center text-[11px] text-secondary">
          Usually takes 1–3 seconds
        </p>
      </div>
    </motion.div>
  );
}
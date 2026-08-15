import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScannerAnimation from "../ui/ScannerAnimation";
import ProgressBar from "../ui/ProgressBar";
import { OCR_PROCESSING_MESSAGES } from "../../constants/ocrConstants";

export default function OCRProcessingScreen({ image }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setProgress(15);

    const p1 = setTimeout(() => setProgress(40), 350);
    const p2 = setTimeout(() => setProgress(70), 800);
    const p3 = setTimeout(() => setProgress(100), 1500);

    const m1 = setTimeout(() => setMessageIndex(1), 350);
    const m2 = setTimeout(() => setMessageIndex(2), 800);
    const m3 = setTimeout(() => setMessageIndex(3), 1400);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(m1);
      clearTimeout(m2);
      clearTimeout(m3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-default bg-surface p-4 sm:p-5 shadow-lg"
    >
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10">
          <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shadow-[0_0_10px_rgba(59,130,246,0.45)]" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-primary">
          Scanning your receipt
        </h2>

        <p className="mt-1 text-xs sm:text-sm text-secondary">
          Billvora is extracting purchase details
        </p>
      </div>

      {/* Receipt Preview */}
      <div className="relative mt-3 overflow-hidden rounded-2xl border border-default bg-surface-secondary">
        <div className="h-56 sm:h-64 md:h-72 w-full">
          {image ? (
            <img
              src={image}
              alt="Receipt preview"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary text-sm">
              Receipt preview
            </div>
          )}

          <ScannerAnimation />
        </div>
      </div>

      {/* Progress */}
      <div className="mt-2.5">
        <ProgressBar progress={progress} />

        <div className="mt-2 min-h-[20px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="text-center text-xs sm:text-sm font-medium text-primary"
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
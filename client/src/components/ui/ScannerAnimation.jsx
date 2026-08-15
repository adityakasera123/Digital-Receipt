import { motion } from "framer-motion";

/**
 * Billvora OCR Scanner Animation
 * A subtle animated scanner line that moves vertically
 * across the receipt preview area.
 */

export default function ScannerAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
      {/* Soft glow */}
      <motion.div
        className="absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"
        animate={{
          y: ["-20%", "120%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Scanner line */}
      <motion.div
        className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_rgba(96,165,250,0.8)]"
        animate={{
          y: ["-10%", "110%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
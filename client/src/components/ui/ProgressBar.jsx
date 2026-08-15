import { motion } from "framer-motion";

export default function ProgressBar({ progress = 0 }) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
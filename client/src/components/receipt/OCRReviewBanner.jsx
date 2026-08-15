import { CheckCircle, Sparkles } from "lucide-react";

export default function OCRReviewBanner({ confidence = 0.91 }) {
  const percentage = Math.round(confidence * 100);

  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-primary">
              Receipt details extracted
            </h3>

            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <CheckCircle className="h-3.5 w-3.5" />
              {percentage}% confidence
            </span>
          </div>

          <p className="mt-1 text-sm text-secondary">
            Billvora automatically detected receipt information. Please review the
            fields below and correct anything that looks incorrect before saving.
          </p>
        </div>
      </div>
    </div>
  );
}
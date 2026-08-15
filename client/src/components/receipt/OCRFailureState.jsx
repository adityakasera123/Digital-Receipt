import { AlertCircle, RefreshCw, PenSquare } from "lucide-react";

export default function OCRFailureState({
  image,
  onRetry,
  onManualEntry,
}) {
  return (
    <div className="rounded-3xl border border-default bg-surface p-6 shadow-sm">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>

        <h2 className="text-xl font-semibold text-primary">
          We couldn't read this receipt
        </h2>

        <p className="mt-2 text-sm text-secondary">
          Billvora couldn't extract enough information from this image. You can
          try scanning again or continue with manual entry.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-default bg-surface-secondary">
        <div className="aspect-[4/5] w-full">
          {image ? (
            <img
              src={image}
              alt="Receipt preview"
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary">
              Receipt preview
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-default bg-surface px-4 py-3 text-sm font-medium text-primary transition-theme hover:bg-surface-hover"
        >
          <RefreshCw className="h-4 w-4" />
          Retry OCR
        </button>

        <button
          type="button"
          onClick={onManualEntry}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <PenSquare className="h-4 w-4" />
          Enter Manually
        </button>
      </div>
    </div>
  );
}
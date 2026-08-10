import { ArrowLeft } from "lucide-react";

function ReceiptHeader({ onBack }) {
  return (
    <div className="flex items-center gap-4 transition-theme">
      <button
        onClick={onBack}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-default bg-surface text-primary transition-theme hover:bg-surface-hover"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mt-1">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Receipt Details
        </h1>

        <p className="mt-2 text-secondary">
          View complete purchase information and receipt preview.
        </p>
      </div>
    </div>
  );
}

export default ReceiptHeader;
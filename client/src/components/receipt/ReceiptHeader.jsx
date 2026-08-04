import { ArrowLeft } from "lucide-react";

function ReceiptHeader({ onBack }) {
  return (
    <div className="mb-6 -mt-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="mt-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Receipt Details
        </h1>

        <p className="mt-2 text-slate-500">
          View complete purchase information and receipt preview.
        </p>
      </div>
    </div>
  );
}

export default ReceiptHeader;
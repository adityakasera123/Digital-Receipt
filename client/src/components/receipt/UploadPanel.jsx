import { useRef } from "react";
import {
  ArrowUpFromLine,
  ScanText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Card from "../ui/Card";

const UploadPanel = ({ onFileChange, errors }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Pass the original event so Upload.jsx can
    // keep preview behavior and start OCR automatically
    onFileChange(e);
  };

  return (
    <Card className="transition-theme">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Upload Receipt</h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-secondary">
            Billvora will automatically scan your receipt, extract purchase
            details, and let you review everything before saving.
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          OCR Auto-Fill
        </span>
      </div>

      {/* Upload Area */}
      <div className="group rounded-2xl border-2 border-dashed border-default bg-surface px-8 py-10 text-center transition-theme hover:bg-surface-hover">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-surface shadow-surface transition-transform duration-300 group-hover:scale-105">
          <ArrowUpFromLine size={26} className="text-primary" />
        </div>

        {/* Heading */}
        <h3 className="mt-5 text-2xl font-semibold text-primary">
          Drag & Drop Receipt
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-secondary">
          Drop your receipt here or browse from your computer. Billvora will
          automatically start OCR and prepare your receipt for review.
        </p>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="button-secondary mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-theme"
        >
          Browse Files
          <ArrowUpFromLine size={16} />
        </button>

        {errors?.receiptImage && (
          <p className="mt-3 text-sm text-red-500">{errors.receiptImage}</p>
        )}

        {/* Formats */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {[
            "PNG",
            "JPG",
            "JPEG",
            "PDF",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-default bg-surface px-3 py-1 text-xs font-medium text-secondary"
            >
              {item}
            </span>
          ))}

          <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium text-secondary">
            Max 10 MB
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700">
          <ScanText size={15} />
          OCR Ready
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-3 py-2 text-xs font-medium text-green-700">
          <ShieldCheck size={15} />
          Warranty Tracking
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-purple-100 px-3 py-2 text-xs font-medium text-purple-700">
          <Sparkles size={15} />
          AI Insights
        </div>
      </div>
    </Card>
  );
};

export default UploadPanel;
import {
  ArrowUpFromLine,
  ScanText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const UploadPanel = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Upload Receipt
          </h2>

          <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
            Securely upload invoices and receipts for OCR extraction,
            warranty tracking and AI insights.
          </p>

        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Ready
        </span>

      </div>

      {/* Upload Area */}

      <div
        className="
          group
          rounded-2xl
          border-2
          border-dashed
          border-slate-200
          bg-slate-50
          px-8
          py-10
          text-center
          transition-all
          duration-300
          hover:border-indigo-400
          hover:bg-indigo-50/30
        "
      >

        {/* Icon */}

        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            bg-white
            shadow-sm
            transition-transform
            duration-300
            group-hover:scale-105
          "
        >
          <ArrowUpFromLine
            size={26}
            className="text-indigo-600"
          />
        </div>

        {/* Heading */}

        <h3 className="mt-5 text-2xl font-semibold text-slate-900">
          Drag & Drop Receipt
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Drop your receipt here or browse from your computer.
          Billvora will securely store it and prepare it for OCR.
        </p>

        {/* Button */}

        <button
          type="button"
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-200
            bg-white
            px-5
            py-3
            text-sm
            font-medium
            text-slate-700
            transition-all
            hover:border-indigo-500
            hover:text-indigo-600
            hover:shadow-sm
          "
        >
          Browse Files
          <ArrowUpFromLine size={16} />
        </button>

        {/* Formats */}

        <div className="mt-7 flex flex-wrap justify-center gap-2">

          {["PNG", "JPG", "JPEG", "PDF"].map((item) => (
            <span
              key={item}
              className="
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-1
                text-xs
                font-medium
                text-slate-500
              "
            >
              {item}
            </span>
          ))}

          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            Max 10 MB
          </span>

        </div>

      </div>

      {/* Features */}

      <div className="mt-6 flex flex-wrap gap-3">

        <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">

          <ScanText size={15} />

          OCR Ready

        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">

          <ShieldCheck size={15} />

          Warranty Tracking

        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-medium text-violet-700">

          <Sparkles size={15} />

          AI Insights

        </div>

      </div>

    </div>
  );
};

export default UploadPanel;
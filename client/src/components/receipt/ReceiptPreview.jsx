import { FileImage } from "lucide-react";

function ReceiptPreview({ receipt }) {
  return (
    <div className=" rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Receipt Preview
      </h2>

      <p className="mt-2 text-slate-500">
        Uploaded receipt image
      </p>

      <div className="mt-6 flex h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

        {receipt.image ? (
          <img
            src={receipt.image}
            alt={receipt.product}
            className="h-full w-full rounded-2xl object-contain"
          />
        ) : (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <FileImage className="h-10 w-10 text-slate-400" />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-slate-800">
              No Receipt Preview
            </h3>

            <p className="mt-2 max-w-xs text-center text-sm text-slate-500">
              Upload a receipt image or PDF to preview it here.
            </p>

            <span className="mt-6 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
              JPG • PNG • PDF
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default ReceiptPreview;
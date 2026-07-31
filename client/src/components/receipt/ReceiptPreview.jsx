import { FileImage, X } from "lucide-react";
import { useState } from "react";

function ReceiptPreview({ receipt }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className=" rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        Receipt Preview
      </h2>

      <p className="mt-2 text-slate-500">
        Uploaded receipt image
      </p>

      <div className="mt-6 flex h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

     {receipt.receiptImage ? (
   <img
  src={receipt.receiptImage}
  alt={receipt.storeName}
  onClick={() => setIsOpen(true)}
  className="h-full w-full cursor-zoom-in rounded-2xl object-contain transition hover:scale-[1.02]"
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
      {isOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
    onClick={() => setIsOpen(false)}
  >
    <button
      onClick={() => setIsOpen(false)}
      className="absolute top-6 right-6 rounded-full bg-white p-2 shadow-lg"
    >
      <X size={22} />
    </button>

    <img
      src={receipt.receiptImage}
      alt={receipt.storeName}
      className="max-h-[90vh] max-w-[90vw] rounded-2xl bg-white object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
    </div>
    
  );
}

export default ReceiptPreview;
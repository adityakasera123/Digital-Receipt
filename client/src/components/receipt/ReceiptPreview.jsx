import { FileImage, X } from 'lucide-react';
import { useState } from 'react';
import Card from '../ui/Card';

function ReceiptPreview({ receipt }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="transition-theme">
        <h2 className="text-2xl font-bold text-primary">
          Receipt Preview
        </h2>

        <p className="mt-2 text-secondary">
          Uploaded receipt image
        </p>

        <div className="bg-surface mt-6 flex h-75 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-default transition-theme">
          {receipt.receiptImage ? (
            <img
              src={receipt.receiptImage}
              alt={receipt.storeName}
              onClick={() => setIsOpen(true)}
              className="h-full w-full cursor-zoom-in rounded-2xl object-contain transition hover:scale-[1.02]"
            />
          ) : (
            <>
              <div className="bg-surface-hover flex h-20 w-20 items-center justify-center rounded-2xl">
                <FileImage size={36} className="text-secondary" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-primary">
                No Receipt Preview
              </h3>

              <p className="mt-2 max-w-xs text-center text-sm text-secondary">
                Upload a receipt image or PDF to preview it here.
              </p>

              <span className="bg-surface-hover mt-6 rounded-full px-4 py-2 text-xs font-medium text-secondary">
                JPG • PNG • PDF
              </span>
            </>
          )}
        </div>
      </Card>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="bg-surface border-default text-primary absolute right-6 top-6 rounded-full border p-2 shadow-lg transition-theme"
          >
            <X size={22} />
          </button>

          <img
            src={receipt.receiptImage}
            alt={receipt.storeName}
            className="bg-surface max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default ReceiptPreview;
import { FileImage, ImageIcon } from "lucide-react";

const ReceiptPreviewCard = ({ receiptData }) => {
  const previewUrl = receiptData.receiptImage
    ? typeof receiptData.receiptImage === "string"
      ? receiptData.receiptImage
      : URL.createObjectURL(receiptData.receiptImage)
    : null;
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

      {/* Header */}

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-semibold text-slate-900">
            Receipt Preview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Preview your uploaded receipt before saving.
          </p>

        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Empty
        </span>

      </div>

      {/* Preview Area */}

      <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8">
  {previewUrl ? (
    <img
      src={previewUrl}
      alt="Receipt Preview"
      className="h-[360px] w-full rounded-xl object-contain"
    />
  ) : (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
        <FileImage size={30} className="text-slate-400" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-900">
        No Receipt Selected
      </h3>

      <p className="mt-3 max-w-xs text-center text-sm leading-6 text-slate-500">
        Upload a receipt to preview it before saving it to your
        digital receipt vault.
      </p>

      <div className="my-8 h-px w-full bg-slate-200" />

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <ImageIcon size={16} />
        PNG • JPG • JPEG • PDF
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Waiting for upload...
      </p>
    </div>
  )}
</div>

    </div>
  );
};

export default ReceiptPreviewCard;
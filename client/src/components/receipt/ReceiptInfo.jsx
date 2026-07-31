import {
  Store,
  IndianRupee,
  CalendarDays,
  Folder,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

function ReceiptInfo({ receipt }) {
  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold text-slate-900">
        {receipt.storeName}
      </h2>

      <p className="mt-2 text-slate-500">
        Complete purchase information
      </p>

      <div className="mt-8 grid grid-cols-2 gap-6">

        {/* Store */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <Store size={18} />
            <span className="text-sm">Store</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {receipt.storeName}
          </p>
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <IndianRupee size={18} />
            <span className="text-sm">Amount</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {receipt.amount}
          </p>
        </div>

        {/* Purchase Date */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <CalendarDays size={18} />
            <span className="text-sm">Purchase Date</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {receipt.purchaseDate}
          </p>
        </div>

        {/* Category */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <Folder size={18} />
            <span className="text-sm">Category</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {receipt.category}
          </p>
        </div>

        {/* Payment */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <CreditCard size={18} />
            <span className="text-sm">Payment Method</span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {receipt.paymentMethod}
          </p>
        </div>

        {/* Warranty */}
        <div>
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={18} />
            <span className="text-sm">Warranty</span>
          </div>

          <span
  className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
    receipt.hasWarranty
      ? "bg-emerald-100 text-emerald-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {receipt.hasWarranty ? "Active" : "No Warranty"}
</span>
        </div>

      </div>

    </div>
  );
}

export default ReceiptInfo;
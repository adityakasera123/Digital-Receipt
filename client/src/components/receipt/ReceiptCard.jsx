import { CalendarDays, ShieldCheck } from "lucide-react";

function ReceiptCard({
  product,
  store,
  category,
  amount,
  purchaseDate,
  warrantyStatus,
}) {
  const isWarrantyActive = warrantyStatus === "Active";

  return (
    <div className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      {/* Top */}
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
          {category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isWarrantyActive
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {warrantyStatus}
        </span>
      </div>

      {/* Product */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {product}
        </h3>

        <p className="text-sm text-gray-500">
          {store}
        </p>
      </div>

      {/* Price */}
      <div className="mt-6">
        <p className="text-2xl font-bold text-gray-900">
          {amount}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />
          <span>{purchaseDate}</span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck
            size={16}
            className={isWarrantyActive ? "text-green-500" : "text-red-500"}
          />
          <span>Warranty</span>
        </div>
      </div>
    </div>
  );
}

export default ReceiptCard;
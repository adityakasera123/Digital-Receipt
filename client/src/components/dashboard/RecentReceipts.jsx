import { ChevronRight, Receipt } from "lucide-react";
import EmptyState from "../common/EmptyState";

function RecentReceipts({ receipts = [] }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Receipts
        </h2>

        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700">
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Empty State */}
     {receipts.length === 0 ? (
  <EmptyState
    icon={Receipt}
    title="No Receipts Yet"
    description="Upload your first receipt to start managing your purchases."
  />
) : (
        <div className="space-y-4">
          {receipts
            .slice()
            .sort((a, b) => {
              if (!a.createdAt || !b.createdAt) return 0;
              return b.createdAt.seconds - a.createdAt.seconds;
            })
            .slice(0, 5)
            .map((receipt) => (
              <div
                key={receipt.id}
                className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Receipt size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {receipt.productName}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {receipt.storeName}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    ₹{Number(receipt.amount || 0).toLocaleString("en-IN")}
                  </p>

                  <p className="text-sm text-gray-500">
                    {receipt.purchaseDate}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default RecentReceipts;
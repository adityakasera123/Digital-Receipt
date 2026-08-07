import { Receipt } from "lucide-react";

function RecentActivity({ receipts = [] }) {
  const recentReceipts = [...receipts].slice(0, 5);

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">
        Recent Activity
      </h2>

      {recentReceipts.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center text-gray-500">
          No recent activity
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {recentReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">
                  <Receipt
                    size={20}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Receipt Uploaded
                  </h3>

                  <p className="text-sm text-gray-500">
                    {receipt.productName || "Untitled Product"} • ₹
                    {Number(receipt.amount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <span className="text-sm text-gray-500">
                {receipt.purchaseDate || "--"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
import { ChevronRight, Receipt } from "lucide-react";

function RecentReceipts() {
    const receipts = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    store: "Apple Store",
    amount: "₹1,29,900",
    date: "Today",
  },
  {
    id: 2,
    title: "Boat Airdopes",
    store: "Amazon",
    amount: "₹2,999",
    date: "Yesterday",
  },
  {
    id: 3,
    title: "Samsung Monitor",
    store: "Flipkart",
    amount: "₹18,499",
    date: "2 days ago",
  },
];
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Receipts
        </h2>

        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700">
          View All
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="space-y-4">
  {receipts.map((receipt) => (
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
            {receipt.title}
          </h3>

          <p className="text-sm text-gray-500">
            {receipt.store}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">
          {receipt.amount}
        </p>

        <p className="text-sm text-gray-500">
          {receipt.date}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}

export default RecentReceipts;
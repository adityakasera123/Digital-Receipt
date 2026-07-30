import ReceiptCard from "./ReceiptCard";
import { receiptData } from "../../data/receiptData";

function ReceiptGrid({ searchTerm, activeCategory }) {
  const filteredReceipts = receiptData.filter((receipt) => {
    const matchesSearch = receipt.product
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      receipt.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Empty State
  if (filteredReceipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-5xl">🔍</div>

        <h3 className="text-xl font-semibold text-gray-900">
          No receipts found
        </h3>

        <p className="mt-2 text-gray-500">
          Try changing your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {filteredReceipts.map((receipt) => (
        <ReceiptCard
          key={receipt.id}
          product={receipt.product}
          store={receipt.store}
          category={receipt.category}
          amount={receipt.amount}
          purchaseDate={receipt.purchaseDate}
          warrantyStatus={receipt.warrantyStatus}
        />
      ))}
    </div>
  );
}

export default ReceiptGrid;
import ReceiptCard from "./ReceiptCard";

function ReceiptGrid({
  receipts,
  loading,
  searchTerm,
  activeCategory,
}) {
  const filteredReceipts = receipts.filter((receipt) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      (receipt.productName || "")
        .toLowerCase()
        .includes(search) ||
      (receipt.storeName || "")
        .toLowerCase()
        .includes(search) ||
      (receipt.category || "")
        .toLowerCase()
        .includes(search);

    const matchesCategory =
      activeCategory === "All" ||
      receipt.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading receipts...
      </div>
    );
  }

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
          id={receipt.id}
          product={receipt.productName}
          store={receipt.storeName}
          category={receipt.category}
          amount={receipt.amount}
          purchaseDate={receipt.purchaseDate}
          warrantyStatus={
            receipt.hasWarranty
              ? "Active"
              : "No Warranty"
          }
        />
      ))}
    </div>
  );
}

export default ReceiptGrid;
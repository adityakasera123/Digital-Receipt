// ===============================
// Search Receipts
// Reusable Search + Filter + Sort Logic
// ===============================

export const searchReceipts = ({
  receipts = [],
  query = '',
  category = 'All',
  store = 'All',
  startDate = '',
  endDate = '',
  minAmount = '',
  maxAmount = '',
  warrantyStatus = 'All',
  returnStatus = 'All',
  sortBy = 'newest',
}) => {
  let filtered = [...receipts];

  // ===============================
  // Category Filter
  // ===============================
  if (category && category !== 'All') {
    filtered = filtered.filter(
      (receipt) => receipt.category === category
    );
  }

  // ===============================
  // Store Filter
  // ===============================
  if (store && store !== 'All') {
    filtered = filtered.filter(
      (receipt) => receipt.storeName === store
    );
  }

  // ===============================
  // Text Search
  // ===============================
  if (query.trim()) {
    const search = query.trim().toLowerCase();

    filtered = filtered.filter((receipt) => {
      return (
        receipt.productName?.toLowerCase().includes(search) ||
        receipt.storeName?.toLowerCase().includes(search) ||
        receipt.category?.toLowerCase().includes(search)
      );
    });
  }

  // ===============================
  // Date Range Filter
  // ===============================
  if (startDate) {
    filtered = filtered.filter(
      (receipt) =>
        receipt.purchaseDate &&
        new Date(receipt.purchaseDate) >= new Date(startDate)
    );
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    filtered = filtered.filter(
      (receipt) =>
        receipt.purchaseDate &&
        new Date(receipt.purchaseDate) <= end
    );
  }

  // ===============================
  // Minimum Amount
  // ===============================
  if (minAmount !== '') {
    filtered = filtered.filter(
      (receipt) =>
        Number(receipt.amount) >= Number(minAmount)
    );
  }

  // ===============================
  // Maximum Amount
  // ===============================
  if (maxAmount !== '') {
    filtered = filtered.filter(
      (receipt) =>
        Number(receipt.amount) <= Number(maxAmount)
    );
  }

  // ===============================
  // Warranty Status
  // ===============================
  if (warrantyStatus && warrantyStatus !== 'All') {
    filtered = filtered.filter(
      (receipt) =>
        receipt.warrantyStatus === warrantyStatus
    );
  }

  // ===============================
  // Return Status
  // ===============================
  if (returnStatus && returnStatus !== 'All') {
    filtered = filtered.filter(
      (receipt) =>
        receipt.returnStatus === returnStatus
    );
  }

  // ===============================
  // Sorting
  // ===============================
  switch (sortBy) {
    case 'highest':
      filtered.sort(
        (a, b) =>
          Number(b.amount) - Number(a.amount)
      );
      break;

    case 'lowest':
      filtered.sort(
        (a, b) =>
          Number(a.amount) - Number(b.amount)
      );
      break;

    case 'oldest':
      filtered.sort(
        (a, b) =>
          new Date(a.purchaseDate) -
          new Date(b.purchaseDate)
      );
      break;

    case 'newest':
    default:
      filtered.sort(
        (a, b) =>
          new Date(b.purchaseDate) -
          new Date(a.purchaseDate)
      );
      break;
  }

  return filtered;
};
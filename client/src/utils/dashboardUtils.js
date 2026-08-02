// ===============================
// Dashboard Utility Functions
// ===============================

// Total Spending
export const getTotalSpending = (receipts) => {
  return receipts.reduce(
    (total, receipt) => total + Number(receipt.amount || 0),
    0
  );
};

// Total Saved Documents
export const getSavedDocuments = (receipts, warranties) => {
  return receipts.length + warranties.length;
};

// Active Warranties
export const getActiveWarranties = (warranties) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return warranties.filter((warranty) => {
    if (!warranty.expiryDate) return false;

    const expiry = new Date(warranty.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    return expiry >= today;
  }).length;
};

// Expiring Within Next 7 Days
export const getExpiringSoon = (warranties) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return warranties.filter((warranty) => {
    if (!warranty.expiryDate) return false;

    const expiry = new Date(warranty.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 && diffDays <= 7;
  }).length;
};
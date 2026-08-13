import { getReturnStatus, getRemainingReturnDays } from "./returnUtils";

// ===============================
// Existing Dashboard Helpers
// ===============================

export const getTotalSpending = (receipts = []) =>
  receipts.reduce((total, receipt) => total + Number(receipt.amount || 0), 0);

export const getActiveWarranties = (warranties = []) =>
  warranties.filter((warranty) => {
    if (!warranty.expiryDate) return false;
    return new Date(warranty.expiryDate) >= new Date();
  }).length;

export const getSavedDocuments = (receipts = []) => receipts.length;

export const getExpiringSoon = (warranties = []) => {
  const today = new Date();

  return warranties.filter((warranty) => {
    if (!warranty.expiryDate) return false;

    const expiry = new Date(warranty.expiryDate);
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return diff >= 0 && diff <= 30;
  }).length;
};

// ===============================
// Return Window Dashboard Helpers (6.5)
// ===============================

export const getActiveReturnWindows = (receipts = []) =>
  receipts.filter(
    (receipt) =>
      receipt.returnTracking &&
      receipt.returnEndDate &&
      getReturnStatus(receipt.returnEndDate) === "Active"
  ).length;

export const getEndingSoonReturns = (receipts = []) =>
  receipts.filter(
    (receipt) =>
      receipt.returnTracking &&
      receipt.returnEndDate &&
      getReturnStatus(receipt.returnEndDate) === "Ending Soon"
  ).length;

export const getExpiredReturns = (receipts = []) =>
  receipts.filter(
    (receipt) =>
      receipt.returnTracking &&
      receipt.returnEndDate &&
      getReturnStatus(receipt.returnEndDate) === "Expired"
  ).length;

export const getReturnAlerts = (receipts = []) =>
  receipts
    .filter((receipt) => {
      if (!receipt.returnTracking || !receipt.returnEndDate) return false;

      const days = getRemainingReturnDays(receipt.returnEndDate);

      return days >= 0 && days <= 3;
    })
    .sort(
      (a, b) =>
        getRemainingReturnDays(a.returnEndDate) -
        getRemainingReturnDays(b.returnEndDate)
    );
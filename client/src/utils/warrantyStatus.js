// ===============================
// Warranty Status Utility
// Single Source of Truth
// ===============================

export const getWarrantyStatus = (
  expiryDate,
  duration
) => {
  // Lifetime Warranty
  if (duration?.toLowerCase() === 'lifetime') {
    return 'lifetime';
  }

  // Invalid expiry date
  if (!expiryDate) {
    return 'active';
  }

  const today = new Date();
  const expiry = new Date(expiryDate);

  // Expired
  if (expiry < today) {
    return 'expired';
  }

  // Remaining days
  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  // Expiring within 30 days
  if (diffDays <= 30) {
    return 'expiring';
  }

  // Active
  return 'active';
};
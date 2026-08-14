export function calculateReturnEndDate(startDate, durationDays, deliveryDate = "") {
  // Use delivery date if available, otherwise use return start date
  const baseDate = deliveryDate || startDate;

  if (!baseDate || !durationDays) return "";

  const date = new Date(baseDate);
  date.setDate(date.getDate() + Number(durationDays));

  return date.toISOString().split("T")[0];
}

export function getRemainingReturnDays(endDate) {
  if (!endDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const diff = end - today;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getReturnStatus(endDate) {
  const days = getRemainingReturnDays(endDate);

  if (days === null) return "Unknown";
  if (days < 0) return "Expired";
  if (days <= 3) return "Ending Soon";

  return "Active";
}
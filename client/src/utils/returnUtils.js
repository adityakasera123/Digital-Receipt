export function calculateReturnEndDate(startDate, durationDays) {
  if (!startDate || !durationDays) return "";

  const date = new Date(startDate);
  date.setDate(date.getDate() + Number(durationDays));

  return date.toISOString().split("T")[0];
}
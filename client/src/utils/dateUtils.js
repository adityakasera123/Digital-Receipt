/**
 * Convert Firestore Timestamp / Date / ISO string into JavaScript Date
 */
export const toDate = (value) => {
  if (!value) return null;

  // Firestore Timestamp
  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  // Already a Date object
  if (value instanceof Date) {
    return new Date(value);
  }

  // ISO string
  return new Date(value);
};

/**
 * Returns a copy of today at local midnight (00:00:00)
 */
export const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Normalize any date to local midnight
 */
export const normalizeDate = (value) => {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Returns remaining calendar days between today and expiry date
 *
 * Examples:
 * Today        -> 0
 * Tomorrow     -> 1
 * After 7 days -> 7
 * Yesterday    -> -1
 */
export const getDaysRemaining = (expiryDate) => {
  const expiry = normalizeDate(expiryDate);
  const today = startOfToday();

  if (!expiry) return null;

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor((expiry.getTime() - today.getTime()) / millisecondsPerDay);
};

/**
 * Check whether expiry date is already expired
 */
export const isExpired = (expiryDate) => {
  const days = getDaysRemaining(expiryDate);
  return days !== null && days < 0;
};

/**
 * Check whether expiry date is today
 */
export const isToday = (expiryDate) => {
  const days = getDaysRemaining(expiryDate);
  return days === 0;
};

/**
 * Check whether expiry date is tomorrow
 */
export const isTomorrow = (expiryDate) => {
  const days = getDaysRemaining(expiryDate);
  return days === 1;
};

/**
 * Check whether expiry date is within the next N days
 *
 * Example:
 * isWithinDays(expiryDate, 7)
 */
export const isWithinDays = (expiryDate, daysLimit) => {
  const days = getDaysRemaining(expiryDate);

  return (
    days !== null &&
    days >= 0 &&
    days <= daysLimit
  );
};

/**
 * Format a date for UI display
 *
 * Example:
 * 8 Aug 2026
 */
export const formatDisplayDate = (value) => {
  const date = toDate(value);

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * OCR parser helper
 * Converts receipt dates like:
 * 28.10.2019
 * 28-10-2019
 * 28/10/19
 * into ISO format: 2019-10-28
 */
export const normalizeOCRDate = (dateString) => {
  if (!dateString) return "";

  const cleaned = String(dateString)
    .trim()
    .replace(/\./g, "/")
    .replace(/-/g, "/");

  const parts = cleaned.split("/");

  if (parts.length !== 3) return "";

  let [day, month, year] = parts;

  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  if (year.length === 2) {
    year = `20${year}`;
  }

  return `${year}-${month}-${day}`;
};
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
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
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
 */
export const getDaysRemaining = (expiryDate) => {
  const expiry = normalizeDate(expiryDate);
  const today = startOfToday();

  if (!expiry) return null;

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return Math.floor(
    (expiry.getTime() - today.getTime()) / millisecondsPerDay
  );
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
 */
export const isWithinDays = (expiryDate, daysLimit) => {
  const days = getDaysRemaining(expiryDate);

  return days !== null && days >= 0 && days <= daysLimit;
};

/**
 * Format a date for UI display
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
 * OCR date normalizer
 *
 * Converts receipt/invoice dates into ISO format:
 *
 * Numeric formats:
 * 28.10.2019  → 2019-10-28
 * 28-10-2019  → 2019-10-28
 * 28/10/2019  → 2019-10-28
 * 28/10/19    → 2019-10-28
 *
 * Prefixed formats:
 * DT:07-11-2018
 * Invoice Date: 10/08/2026
 * Order Date: 07.11.2018
 *
 * Month-name formats:
 * 12 Jun 2025  → 2025-06-12
 * 12 June 2025 → 2025-06-12
 * 7 Aug 2026   → 2026-08-07
 *
 * Returns:
 * YYYY-MM-DD
 */
export const normalizeOCRDate = (dateString) => {
  if (!dateString) return "";

  const text = String(dateString).trim();

  /*
   * --------------------------------------------------
   * 1. Numeric date formats
   * --------------------------------------------------
   *
   * Supports:
   * DD/MM/YYYY
   * DD-MM-YYYY
   * DD.MM.YYYY
   * DD/MM/YY
   */

  const numericMatch = text.match(
    /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/
  );

  if (numericMatch) {
    const cleaned = numericMatch[1]
      .replace(/\./g, "/")
      .replace(/-/g, "/");

    const parts = cleaned.split("/");

    if (parts.length !== 3) {
      return "";
    }

    let [day, month, year] = parts;

    day = day.padStart(2, "0");
    month = month.padStart(2, "0");

    // Convert 2-digit years.
    if (year.length === 2) {
      year = Number(year) >= 70
        ? `19${year}`
        : `20${year}`;
    }

    return `${year}-${month}-${day}`;
  }

  /*
   * --------------------------------------------------
   * 2. Month-name date formats
   * --------------------------------------------------
   *
   * Supports:
   * 12 Jun 2025
   * 12 June 2025
   * 7 Aug 2026
   * 07 September 2026
   */

  const monthNameMatch = text.match(
    /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/
  );

  if (monthNameMatch) {
    const [, day, monthName, year] = monthNameMatch;

    const months = {
      jan: "01",
      january: "01",

      feb: "02",
      february: "02",

      mar: "03",
      march: "03",

      apr: "04",
      april: "04",

      may: "05",

      jun: "06",
      june: "06",

      jul: "07",
      july: "07",

      aug: "08",
      august: "08",

      sep: "09",
      sept: "09",
      september: "09",

      oct: "10",
      october: "10",

      nov: "11",
      november: "11",

      dec: "12",
      december: "12",
    };

    const month = months[monthName.toLowerCase()];

    if (!month) {
      return "";
    }

    return `${year}-${month}-${day.padStart(2, "0")}`;
  }

  return "";
};
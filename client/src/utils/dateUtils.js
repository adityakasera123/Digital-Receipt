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

* OCR parser helper
* Converts receipt dates like:
* 28.10.2019
* 28-10-2019
* 28/10/19
* DT:07-11-2018
* Invoice Date: 10/08/2026
* into ISO format: YYYY-MM-DD
  */
  export const normalizeOCRDate = (dateString) => {
  if (!dateString) return "";

let text = String(dateString).trim();

// Extract the date portion from strings like:
// DT:07-11-2018
// Invoice Date: 10/08/2026
// Order Date 07.11.2018
const match = text.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/);

if (match) {
text = match[1];
}

const cleaned = text
.replace(/\./g, "/")
.replace(/-/g, "/");

const parts = cleaned.split("/");

if (parts.length !== 3) return "";

let [day, month, year] = parts;

day = day.padStart(2, "0");
month = month.padStart(2, "0");

if (year.length === 2) {
year = Number(year) >= 70 ? `19${year}` : `20${year}`;
}

return `${year}-${month}-${day}`;
};

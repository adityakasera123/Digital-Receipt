import {
  getDaysRemaining,
  formatDisplayDate,
} from "./dateUtils";

/**
 * Notification priority levels
 */
export const NOTIFICATION_PRIORITY = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

/**
 * Priority mapping (Production)
 * 30d  - Low
 * 15d  - Medium
 * 7d   - High
 * 3d   - High
 * 1d   - Critical
 * 0d   - Critical
 */
const getPriority = (daysRemaining) => {
  if (daysRemaining === 0) return NOTIFICATION_PRIORITY.CRITICAL;
  if (daysRemaining === 1) return NOTIFICATION_PRIORITY.CRITICAL;
  if (daysRemaining <= 3) return NOTIFICATION_PRIORITY.HIGH;
  if (daysRemaining === 7) return NOTIFICATION_PRIORITY.HIGH;
  if (daysRemaining === 15) return NOTIFICATION_PRIORITY.MEDIUM;
  return NOTIFICATION_PRIORITY.LOW; // 30 days
};

/**
 * Notification title
 */
const getTitle = (daysRemaining) => {
  if (daysRemaining === 0) return "Warranty expires today";
  if (daysRemaining === 1) return "Warranty expires tomorrow";
  return `Warranty expires in ${daysRemaining} days`;
};

/**
 * Convert a warranty into a notification object
 */
const createNotification = (warranty, daysRemaining) => ({
  id: warranty.id,
  warrantyId: warranty.id,
  receiptId: warranty.receiptId,
  userId: warranty.userId,

  type: "warranty_expiry",

  productName: warranty.productName,
  storeName: warranty.storeName,

  expiryDate: warranty.expiryDate,
  formattedExpiryDate: formatDisplayDate(warranty.expiryDate),

  daysRemaining,
  reminderDays: daysRemaining,

  priority: getPriority(daysRemaining),

  title: getTitle(daysRemaining),
  message: `${warranty.productName} warranty expires on ${formatDisplayDate(
    warranty.expiryDate
  )}`,

  createdAt: new Date(),
});

/**
 * Generate warranty notifications
 */
export const getWarrantyNotifications = (warranties = []) => {
  const notifications = [];

  warranties.forEach((warranty) => {
    const daysRemaining = getDaysRemaining(warranty.expiryDate);

    if (daysRemaining === null) return;
    if (daysRemaining < 0) return;

    // Reminder windows
    const reminderDays = [30, 15, 7, 3, 1, 0];

    if (reminderDays.includes(daysRemaining)) {
      notifications.push(createNotification(warranty, daysRemaining));
    }
  });

  // Sort by priority then by days remaining
  notifications.sort((a, b) => {
    const priorityOrder = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return a.daysRemaining - b.daysRemaining;
  });

  return notifications;
};

/**
 * Dashboard notification summary
 */
export const getNotificationSummary = (warranties = []) => {
  const notifications = getWarrantyNotifications(warranties);

  return {
    notifications,

    unreadCount: notifications.length,

    urgentCount: notifications.filter(
      (n) =>
        n.priority === NOTIFICATION_PRIORITY.CRITICAL ||
        n.priority === NOTIFICATION_PRIORITY.HIGH
    ).length,

    expiringToday: notifications.filter((n) => n.daysRemaining === 0).length,

    expiringTomorrow: notifications.filter((n) => n.daysRemaining === 1).length,

    expiringThisWeek: notifications.filter((n) => n.daysRemaining <= 7).length,

    // Popup triggers only for High & Critical (7d, 3d, 1d, 0d)
    popupNotification:
      notifications.find(
        (n) =>
          n.priority === NOTIFICATION_PRIORITY.CRITICAL ||
          n.priority === NOTIFICATION_PRIORITY.HIGH
      ) || null,
  };
};
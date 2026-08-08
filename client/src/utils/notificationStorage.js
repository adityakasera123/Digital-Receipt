const STORAGE_KEY = "billvora_read_notifications";

/**
 * Get all read notification IDs
 */
export const getReadNotifications = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to read notification storage:", error);
    return [];
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = (notificationId) => {
  try {
    const readIds = getReadNotifications();

    if (!readIds.includes(notificationId)) {
      readIds.push(notificationId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds));
    }
  } catch (error) {
    console.error("Failed to save read notification:", error);
  }
};

/**
 * Mark multiple notifications as read
 */
export const markNotificationsAsRead = (notificationIds = []) => {
  try {
    const readIds = getReadNotifications();

    const merged = [...new Set([...readIds, ...notificationIds])];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (error) {
    console.error("Failed to save notifications:", error);
  }
};

/**
 * Check whether notification is already read
 */
export const isNotificationRead = (notificationId) => {
  return getReadNotifications().includes(notificationId);
};

/**
 * Mark all current notifications as read
 */
export const markAllNotificationsAsRead = (notifications = []) => {
  const ids = notifications.map((n) => n.id);
  markNotificationsAsRead(ids);
};

/**
 * Clear all read notifications (useful for testing)
 */
export const clearReadNotifications = () => {
  localStorage.removeItem(STORAGE_KEY);
};
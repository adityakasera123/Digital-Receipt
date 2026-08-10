import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getNotificationSummary } from "../utils/warrantyReminder";

const notificationsRef = collection(db, "notifications");

/**
 * Fetch all warranties for the current user
 */
export const fetchUserWarranties = async (userId) => {
  if (!userId) return [];

  const warrantiesRef = collection(db, "warranties");

  const q = query(
    warrantiesRef,
    where("userId", "==", userId),
    orderBy("expiryDate", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};

/**
 * Create or update notification
 */
export const createOrUpdateNotification = async (userId, notification) => {
  const notificationId = `${userId}_${notification.warrantyId}_${notification.reminderDays}_${notification.type}`;

  const notificationRef = doc(db, "notifications", notificationId);

  const existing = await getDoc(notificationRef);
  const existingData = existing.exists() ? existing.data() : {};

  await setDoc(
    notificationRef,
    {
      ...notification,
      userId,
      isRead: existingData.isRead ?? false,
      readAt: existingData.readAt ?? null,
      snoozedUntil: existingData.snoozedUntil ?? null,
      lastPopupShownAt: existingData.lastPopupShownAt ?? null,
      createdAt: existingData.createdAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return notificationId;
};

/**
 * Get notifications
 * Automatically restores snoozed notifications after snooze expires
 */
export const getNotifications = async (userId) => {
  if (!userId) return [];

  const snapshot = await getDocs(collection(db, "notifications"));

  const now = new Date();
  const notifications = [];

  for (const document of snapshot.docs) {
    const notification = {
      id: document.id,
      ...document.data(),
    };

    if (notification.userId !== userId) continue;

    // Normal notification
    if (!notification.snoozedUntil) {
      notifications.push(notification);
      continue;
    }

    const snoozedDate =
      notification.snoozedUntil.toDate?.() ||
      new Date(notification.snoozedUntil);

    // Snooze expired - restore notification automatically
    if (snoozedDate <= now) {
      await updateDoc(doc(db, "notifications", notification.id), {
        snoozedUntil: null,
        lastPopupShownAt: null,
        isRead: false,
        readAt: null,
        updatedAt: serverTimestamp(),
      });

      notifications.push({
        ...notification,
        snoozedUntil: null,
        lastPopupShownAt: null,
        isRead: false,
        readAt: null,
      });
    }
  }

  return notifications.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;
    return bTime - aTime;
  });
};

/**
 * Dashboard notifications
 */
export const getDashboardNotifications = async (userId) => {
  if (!userId) {
    return {
      notifications: [],
      unreadCount: 0,
      criticalCount: 0,
      hasUrgent: false,
      nextUrgent: null,
    };
  }

 const warranties = await fetchUserWarranties(userId);
console.log("WARRANTIES:", warranties);

const summary = getNotificationSummary(warranties);
console.log("SUMMARY:", summary);
console.log("SUMMARY.NOTIFICATIONS:", summary.notifications);
console.log("SUMMARY LENGTH:", summary.notifications.length);

  // Generate / sync notifications
  for (const notification of summary.notifications) {
    await createOrUpdateNotification(userId, {
      warrantyId: notification.warrantyId || notification.id || null,
      receiptId: notification.receiptId || null,
      type: "warranty_expiry",
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      reminderDays:
        notification.reminderDays ?? notification.daysRemaining ?? 0,
      productName: notification.productName,
      storeName: notification.storeName,
      formattedExpiryDate: notification.formattedExpiryDate,
      expiryDate: notification.expiryDate,
    });
  }

  const persistedNotifications = await getNotifications(userId);

  const urgentNotifications = persistedNotifications.filter(
    (n) =>
     (n.priority === "critical" || n.priority === "high") &&
      !n.isRead
  );

  return {
    notifications: persistedNotifications,
    unreadCount: persistedNotifications.filter((n) => !n.isRead).length,
    criticalCount: persistedNotifications.filter(
      (n) => n.priority === "critical" && !n.isRead
    ).length,
    hasUrgent: urgentNotifications.length > 0,
    nextUrgent: urgentNotifications[0] || null,
  };
};

/**
 * Mark one notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  await updateDoc(doc(db, "notifications", notificationId), {
    isRead: true,
    readAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (userId) => {
  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    where("isRead", "==", false)
  );

  const snapshot = await getDocs(q);

  const batch = writeBatch(db);

  snapshot.docs.forEach((document) => {
    batch.update(document.ref, {
      isRead: true,
      readAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

/**
 * PRODUCTION MODE: Snooze for days
 * Example:
 * snoozeNotification(id, 1) = 24 hours
 * snoozeNotification(id, 3) = 3 days
 * snoozeNotification(id, 7) = 7 days
 */
export const snoozeNotification = async (notificationId, days = 1) => {
  const snoozedUntil = new Date();
  snoozedUntil.setDate(snoozedUntil.getDate() + days);

  await updateDoc(doc(db, "notifications", notificationId), {
    snoozedUntil: Timestamp.fromDate(snoozedUntil),
    lastPopupShownAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Popup eligibility
 * Show popup only once per day
 */
export const shouldShowPopup = async (notificationId) => {
  const notificationRef = doc(db, "notifications", notificationId);
  const snapshot = await getDoc(notificationRef);

  if (!snapshot.exists()) return false;

  const data = snapshot.data();

  if (!data.lastPopupShownAt) return true;

  const lastShown =
    data.lastPopupShownAt.toDate?.() ||
    new Date(data.lastPopupShownAt);

  const today = new Date();

  return (
    lastShown.getFullYear() !== today.getFullYear() ||
    lastShown.getMonth() !== today.getMonth() ||
    lastShown.getDate() !== today.getDate()
  );
};

export const markPopupShown = async (notificationId) => {
  await updateDoc(doc(db, "notifications", notificationId), {
    lastPopupShownAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};
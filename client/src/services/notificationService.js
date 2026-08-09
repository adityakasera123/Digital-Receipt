import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  writeBatch,
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

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Create or update a notification using a deterministic document ID.
 * Preserves read state across refreshes.
 */
export const createOrUpdateNotification = async (userId, notification) => {
  const notificationId = `${userId}_${notification.warrantyId}_${notification.reminderDays}_${notification.type}`;

  const notificationDocRef = doc(db, "notifications", notificationId);

  const existingSnapshot = await getDocs(
    query(
      notificationsRef,
      where("userId", "==", userId),
      where("warrantyId", "==", notification.warrantyId),
      where("reminderDays", "==", notification.reminderDays),
      where("type", "==", notification.type)
    )
  );

  // If notification already exists, preserve read state
  if (!existingSnapshot.empty) {
    const existingData = existingSnapshot.docs[0].data();

    await setDoc(
      notificationDocRef,
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
  }

  // Create new notification
  await setDoc(notificationDocRef, {
    ...notification,
    userId,
    isRead: false,
    readAt: null,
    snoozedUntil: null,
    lastPopupShownAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return notificationId;
};

/**
 * Fetch persisted notifications from Firestore
 */
export const getNotifications = async (userId) => {
  if (!userId) return [];

  const q = query(
    notificationsRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Returns dashboard-ready notification data
 * and syncs generated notifications to Firestore.
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

  // Fetch warranties
  const warranties = await fetchUserWarranties(userId);

  // Generate runtime notification summary
  const summary = getNotificationSummary(warranties);

  // Sync each notification to Firestore
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

  // Read persisted notifications
  const persistedNotifications = await getNotifications(userId);

  return {
    notifications: persistedNotifications,
    unreadCount: persistedNotifications.filter((n) => !n.isRead).length,
    criticalCount: persistedNotifications.filter(
      (n) => n.priority === "critical" && !n.isRead
    ).length,
    hasUrgent: persistedNotifications.some(
      (n) => n.priority === "critical" && !n.isRead
    ),
    nextUrgent:
      persistedNotifications.find(
        (n) => n.priority === "critical" && !n.isRead
      ) || null,
  };
};

/**
 * Mark a single notification as read
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
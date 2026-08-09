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

const existing = await getDoc(notificationDocRef);

const existingData = existing.exists() ? existing.data() : {};

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
};


/**

* Fetch persisted notifications from Firestore
* Snoozed notifications remain hidden until their snooze time expires.
  */
  export const getNotifications = async (userId) => {
  if (!userId) return [];

// Fetch all notifications first
const snapshot = await getDocs(collection(db, "notifications"));

const now = new Date();

return snapshot.docs
.map((doc) => ({
id: doc.id,
...doc.data(),
}))
.filter((notification) => notification.userId === userId)
.filter((notification) => {
if (!notification.snoozedUntil) return true;


  const snoozedDate =
    notification.snoozedUntil.toDate?.() ||
    new Date(notification.snoozedUntil);

  return snoozedDate <= now;
})
.sort((a, b) => {
  const aTime = a.createdAt?.toMillis?.() || 0;
  const bTime = b.createdAt?.toMillis?.() || 0;
  return bTime - aTime;
});


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

const warranties = await fetchUserWarranties(userId);

const summary = getNotificationSummary(warranties);


// Sync generated notifications to Firestore
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

// High and Critical are both considered urgent
const urgentNotifications = persistedNotifications.filter(
  (n) =>
    (n.priority === "critical" ||
      n.priority === "high" ||
      n.priority === "medium") &&
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

/**

* Snooze a notification for a number of days.
* Example: 1 = 24h, 3 = 3 days
  */
  export const snoozeNotification = async (notificationId, days) => {
  const snoozedUntil = new Date();
  snoozedUntil.setDate(snoozedUntil.getDate() + days);

await updateDoc(doc(db, "notifications", notificationId), {
snoozedUntil: Timestamp.fromDate(snoozedUntil),
updatedAt: serverTimestamp(),
});
};

/**

* Popup frequency control
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

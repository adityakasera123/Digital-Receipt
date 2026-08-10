import {
collection,
getDocs,
query,
where,
deleteDoc,
doc,
} from 'firebase/firestore';
import { db, storage } from '../firebase/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';

function downloadJson(filename, data) {
const blob = new Blob([JSON.stringify(data, null, 2)], {
type: 'application/json',
});

const url = URL.createObjectURL(blob);

const link = document.createElement('a');
link.href = url;
link.download = filename;

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(url);
}

export async function exportReceipts(userId) {
const receiptsRef = collection(db, 'receipts');

const receiptsQuery = query(
receiptsRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(receiptsQuery);

const receipts = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const payload = {
exportedAt: new Date().toISOString(),
totalReceipts: receipts.length,
receipts,
};

downloadJson('billvora-receipts-backup.json', payload);
}

export async function exportWarranties(userId) {
const warrantiesRef = collection(db, 'warranties');

const warrantiesQuery = query(
warrantiesRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(warrantiesQuery);

const warranties = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const payload = {
exportedAt: new Date().toISOString(),
totalWarranties: warranties.length,
warranties,
};

downloadJson('billvora-warranties-backup.json', payload);
}

export async function exportNotifications(userId) {
const notificationsRef = collection(db, 'notifications');

const notificationsQuery = query(
notificationsRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(notificationsQuery);

const notifications = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const payload = {
exportedAt: new Date().toISOString(),
totalNotifications: notifications.length,
notifications,
};

downloadJson('billvora-notifications-backup.json', payload);
}

export async function exportCompleteBackup(userId) {
const receiptsRef = collection(db, 'receipts');
const warrantiesRef = collection(db, 'warranties');
const notificationsRef = collection(db, 'notifications');

const [receiptsSnap, warrantiesSnap, notificationsSnap] =
await Promise.all([
getDocs(query(receiptsRef, where('userId', '==', userId))),
getDocs(query(warrantiesRef, where('userId', '==', userId))),
getDocs(query(notificationsRef, where('userId', '==', userId))),
]);

const receipts = receiptsSnap.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const warranties = warrantiesSnap.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const notifications = notificationsSnap.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

const payload = {
exportedAt: new Date().toISOString(),
version: '6.0',
totalReceipts: receipts.length,
totalWarranties: warranties.length,
totalNotifications: notifications.length,
receipts,
warranties,
notifications,
};

downloadJson('billvora-complete-backup.json', payload);
}

export async function deleteAllNotifications(userId) {
const notificationsRef = collection(db, 'notifications');

const notificationsQuery = query(
notificationsRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(notificationsQuery);

const deletePromises = snapshot.docs.map((notificationDoc) =>
deleteDoc(notificationDoc.ref)
);

await Promise.all(deletePromises);

return snapshot.size;
}

export async function deleteAllReceipts(userId) {
const receiptsRef = collection(db, 'receipts');

const receiptsQuery = query(
receiptsRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(receiptsQuery);

let deletedCount = 0;

for (const receiptDoc of snapshot.docs) {
const receiptData = receiptDoc.data();


// Delete linked warranties
const warrantiesRef = collection(db, 'warranties');
const warrantiesQuery = query(
  warrantiesRef,
  where('receiptId', '==', receiptDoc.id)
);

const warrantiesSnap = await getDocs(warrantiesQuery);

const warrantyDeletes = warrantiesSnap.docs.map((warrantyDoc) =>
  deleteDoc(warrantyDoc.ref)
);

await Promise.all(warrantyDeletes);

// Delete receipt image from Firebase Storage
if (receiptData.receiptImage) {
  try {
    const imageRef = ref(storage, receiptData.receiptImage);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('Receipt image delete skipped:', error);
  }
}

// Delete receipt document
await deleteDoc(receiptDoc.ref);
deletedCount++;


}

return deletedCount;
}

export async function deleteAllWarranties(userId) {
const warrantiesRef = collection(db, 'warranties');

const warrantiesQuery = query(
warrantiesRef,
where('userId', '==', userId)
);

const snapshot = await getDocs(warrantiesQuery);

const deletePromises = snapshot.docs.map((warrantyDoc) =>
deleteDoc(warrantyDoc.ref)
);

await Promise.all(deletePromises);

return snapshot.size;
}

export async function deleteAccount(user) {
if (!user) {
throw new Error('User not found');
}

const userId = user.uid;

// Delete notifications
await deleteAllNotifications(userId);

// Delete receipts (also deletes linked warranties and receipt images)
await deleteAllReceipts(userId);

// Delete any remaining warranties
await deleteAllWarranties(userId);

// Delete notification settings document
try {
await deleteDoc(doc(db, 'users', userId, 'settings', 'notifications'));
} catch (error) {
console.warn('Notification settings delete skipped:', error);
}

// Delete user profile document
try {
await deleteDoc(doc(db, 'users', userId));
} catch (error) {
console.warn('User profile delete skipped:', error);
}

// Finally delete Firebase Authentication account
await deleteUser(user);
}

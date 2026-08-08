import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

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

import { db, auth } from "../firebase/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

// Save Warranty
export const saveWarranty = async (warrantyData) => {
  const docRef = await addDoc(collection(db, "warranties"), {
    ...warrantyData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// Get Warranties (Current Logged-in User Only)
export const getWarranties = async () => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "warranties"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get Warranty By ID
export const getWarrantyById = async (id) => {
  const docRef = doc(db, "warranties", id);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
};

// Update Warranty
export const updateWarranty = async (id, warrantyData) => {
  const docRef = doc(db, "warranties", id);

  await updateDoc(docRef, {
    ...warrantyData,
  });
};

// Delete Warranty
export const deleteWarranty = async (warrantyId) => {
// Delete linked notifications
const notificationsRef = collection(db, 'notifications');
const notificationsQuery = query(
notificationsRef,
where('warrantyId', '==', warrantyId)
);

const notificationsSnap = await getDocs(notificationsQuery);

await Promise.all(
notificationsSnap.docs.map((notificationDoc) =>
deleteDoc(notificationDoc.ref)
)
);

// Delete the warranty document
const warrantyRef = doc(db, 'warranties', warrantyId);
await deleteDoc(warrantyRef);

// Refresh notification UI (bell icon, popup, etc.)
window.dispatchEvent(new Event('notifications-updated'));
};

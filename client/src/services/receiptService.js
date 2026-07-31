import { db } from "../firebase/firebase";

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
} from "firebase/firestore";

export const saveReceipt = async (receiptData) => {
  const docRef = await addDoc(collection(db, "receipts"), {
    ...receiptData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getReceipts = async () => {
  const q = query(
    collection(db, "receipts"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getReceiptById = async (id) => {
  
  const docRef = doc(db, "receipts", id);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  };

};

export const updateReceipt = async (id, receiptData) => {
  const docRef = doc(db, "receipts", id);

  await updateDoc(docRef, {
    ...receiptData,
  });
};
export const deleteReceipt = async (receiptId) => {
  const receiptRef = doc(db, "receipts", receiptId);

  await deleteDoc(receiptRef);
};
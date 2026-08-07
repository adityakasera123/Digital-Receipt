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
  where,
} from "firebase/firestore";

// Save Receipt
export const saveReceipt = async (receiptData) => {
  const docRef = await addDoc(collection(db, "receipts"), {
    ...receiptData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// Get All Receipts (Current Logged-in User Only)
export const getReceipts = async (userId) => {
  console.log("=== getReceipts called ===");
  console.log("User ID passed:", userId);

  if (!userId) {
    console.log("No userId received");
    return [];
  }

  const q = query(
    collection(db, "receipts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  console.log("Fetched receipts count:", querySnapshot.size);

  querySnapshot.docs.forEach((doc) => {
    console.log("Receipt:", doc.id, doc.data());
  });

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get Receipt By ID
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

// Update Receipt
export const updateReceipt = async (id, receiptData) => {
  const docRef = doc(db, "receipts", id);

  await updateDoc(docRef, {
    ...receiptData,
  });
};

// Delete Receipt
export const deleteReceipt = async (receiptId) => {
  const receiptRef = doc(db, "receipts", receiptId);

  await deleteDoc(receiptRef);
};
import { db } from "../firebase/firebase";
import { deleteReceiptImage } from "./storageService";

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

// ===============================
// Save Receipt
// ===============================
export const saveReceipt = async (receiptData) => {
  const docRef = await addDoc(collection(db, "receipts"), {
    ...receiptData,

    // Return Window Tracking (6.5)
    returnTracking: receiptData.returnTracking || false,
    platform: receiptData.platform || "",
    returnType: receiptData.returnType || "Return",
    returnDurationDays: Number(receiptData.returnDurationDays || 7),
    returnStartDate: receiptData.returnStartDate || "",
    returnEndDate: receiptData.returnEndDate || "",

    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// ===============================
// Get All Receipts (Current User)
// ===============================
export const getReceipts = async (userId) => {
  if (!userId) return [];

  const q = query(
    collection(db, "receipts"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ===============================
// Get Receipt By ID
// ===============================
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

// ===============================
// Update Receipt
// ===============================
export const updateReceipt = async (id, receiptData) => {
  const docRef = doc(db, "receipts", id);

  await updateDoc(docRef, {
    ...receiptData,

    // Return Window Tracking (6.5)
    returnTracking: receiptData.returnTracking || false,
    platform: receiptData.platform || "",
    returnType: receiptData.returnType || "Return",
    returnDurationDays: Number(receiptData.returnDurationDays || 7),
    returnStartDate: receiptData.returnStartDate || "",
    returnEndDate: receiptData.returnEndDate || "",
  });
};

// ===============================
// Delete Receipt + Storage Image + Linked Warranty
// ===============================
export const deleteReceipt = async (receiptId) => {
  const receiptRef = doc(db, "receipts", receiptId);

  // Get receipt document first
  const receiptSnap = await getDoc(receiptRef);

  if (!receiptSnap.exists()) {
    throw new Error("Receipt not found");
  }

  const receiptData = receiptSnap.data();

  // Delete image from Firebase Storage
  if (receiptData.receiptImage) {
    try {
      await deleteReceiptImage(receiptData.receiptImage);
      console.log("Storage image deleted successfully");
    } catch (error) {
      console.error("Failed to delete image from Storage:", error);
    }
  }

  // Delete linked warranty documents
  try {
    const warrantyQuery = query(
      collection(db, "warranties"),
      where("receiptId", "==", receiptId)
    );

    const warrantySnapshot = await getDocs(warrantyQuery);

    const deletePromises = warrantySnapshot.docs.map((warrantyDoc) =>
      deleteDoc(doc(db, "warranties", warrantyDoc.id))
    );

    await Promise.all(deletePromises);

    console.log(`Deleted ${warrantySnapshot.size} linked warranty(s)`);
  } catch (error) {
    console.error("Failed to delete linked warranties:", error);
  }

  // Delete Firestore receipt document
  await deleteDoc(receiptRef);

  console.log(
    "Receipt, storage image, and linked warranty deleted successfully"
  );
};
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Fetch all receipts for analytics calculations.
 */
export const getAllReceipts = async () => {
  const snapshot = await getDocs(collection(db, "receipts"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
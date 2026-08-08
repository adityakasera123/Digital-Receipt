import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getNotificationSummary } from "../utils/warrantyReminder";

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
 * Returns dashboard-ready notification data
 */
export const getDashboardNotifications = async (userId) => {
  const warranties = await fetchUserWarranties(userId);

  return getNotificationSummary(warranties);
};
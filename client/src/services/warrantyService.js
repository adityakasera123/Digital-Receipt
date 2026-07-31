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

export const saveWarranty = async (warrantyData) => {
  const docRef = await addDoc(collection(db, "warranties"), {
    ...warrantyData,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getWarranties = async () => {
  const q = query(
    collection(db, "warranties"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

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

export const updateWarranty = async (id, warrantyData) => {
  const docRef = doc(db, "warranties", id);

  await updateDoc(docRef, {
    ...warrantyData,
  });
};

export const deleteWarranty = async (warrantyId) => {
  const warrantyRef = doc(db, "warranties", warrantyId);

  await deleteDoc(warrantyRef);
};
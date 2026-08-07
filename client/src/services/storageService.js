import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../firebase/firebase";

// Upload Receipt Image
export const uploadReceiptImage = (file, userId) => {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}-${file.name}`;

    const storageRef = ref(
      storage,
      `receipts/${userId}/${fileName}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",

      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        console.log("Upload Progress:", progress + "%");
      },

      (error) => {
        console.error("Upload Error:", error);
        reject(error);
      },

      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Delete Receipt Image
export const deleteReceiptImage = async (imageUrl) => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};
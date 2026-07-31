import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "../firebase/firebase";

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

          console.log("Download URL:", downloadURL);

          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
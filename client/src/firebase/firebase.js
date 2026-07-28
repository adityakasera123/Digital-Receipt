import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0M00eTdiwB_pPpu24-0PPyZOHvpSizAQ",
  authDomain: "billvora-e91e7.firebaseapp.com",
  projectId: "billvora-e91e7",
  storageBucket: "billvora-e91e7.firebasestorage.app",
  messagingSenderId: "712164582482",
  appId: "1:712164582482:web:0a30add6552660005bab8b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/cordova";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyA9p6taFh3NHxxTsaG3Qdeoi2iluV4pVpg",
  authDomain: "invoice-app-4bd54.firebaseapp.com",
  projectId: "invoice-app-4bd54",
  storageBucket: "invoice-app-4bd54.appspot.com",
  messagingSenderId: "581422230567",
  appId: "1:581422230567:web:577cac03099b5477067202",
  measurementId: "G-9S5G86ST6X",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);

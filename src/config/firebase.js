import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration using environment variables with project fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDuuBxRvJHHvgUXqr_Br2mR3sg9PEDXRZA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mobus-musicplayer.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mobus-musicplayer",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mobus-musicplayer.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "531990871313",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:531990871313:web:f1c8827ff93e08fdc2a0b0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PC7YFG6LWD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

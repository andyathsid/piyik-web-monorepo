import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

let app: ReturnType<typeof initializeApp>;

const getFirebaseApp = () => {
  if (!app) {
    app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  return app;
};

const FIREBASE_APP = getFirebaseApp();
export const storage = getStorage(FIREBASE_APP);
export const auth = getAuth(FIREBASE_APP);
export const database = getDatabase(FIREBASE_APP);
export const functions = getFunctions(FIREBASE_APP);
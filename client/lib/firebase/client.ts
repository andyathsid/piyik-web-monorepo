import { initializeApp, getApp, FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { validateFirebaseConfig } from "./config";

let clientApp: FirebaseApp;

function initializeClientApp() {
  if (clientApp) {
    return clientApp;
  }

  try {

    clientApp = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });

    return clientApp;
  } catch (error: any) {
    // Check if the error is about the app already existing
    if (error.code === 'app/duplicate-app') {
      return getApp();
    }
    console.error('Firebase client initialization error:', error);
    throw error;
  }
}

// Initialize app and export services
const app = initializeClientApp();
export const storage = getStorage(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const functions = getFunctions(app);

// // Export app for testing purposes
// export const getClientApp = () => app;
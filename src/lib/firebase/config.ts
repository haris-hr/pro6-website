import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { FirebaseStorage } from "firebase/storage";

// Firebase configuration - values must be set via environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy-loaded Firebase instances
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Lazily initialize Firebase - only loads the SDK when actually needed
 * This reduces initial bundle size significantly
 */
async function initializeFirebase(): Promise<void> {
  if (typeof window === "undefined") return;
  
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getAuth } = await import("firebase/auth");
    const { getFirestore } = await import("firebase/firestore");
    const { getStorage } = await import("firebase/storage");
    
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Validate config in development
    if (process.env.NODE_ENV === "development") {
      const missingKeys = Object.entries(firebaseConfig)
        .filter(([, value]) => !value)
        .map(([key]) => key);
      
      if (missingKeys.length > 0) {
        console.warn(
          `⚠️ Missing Firebase config: ${missingKeys.join(", ")}. ` +
          "Please check your .env.local file."
        );
      }
    }
  })();
  
  return initPromise;
}

/**
 * Get Firebase App instance (lazy loaded)
 */
export async function getApp(): Promise<FirebaseApp> {
  await initializeFirebase();
  if (!app) throw new Error("Firebase app not initialized");
  return app;
}

/**
 * Get Firebase Auth instance (lazy loaded)
 */
export async function getAuthInstance(): Promise<Auth> {
  await initializeFirebase();
  if (!auth) throw new Error("Firebase auth not initialized");
  return auth;
}

/**
 * Get Firestore instance (lazy loaded)
 */
export async function getDb(): Promise<Firestore> {
  await initializeFirebase();
  if (!db) throw new Error("Firestore not initialized");
  return db;
}

/**
 * Get Firebase Storage instance (lazy loaded)
 */
export async function getStorageInstance(): Promise<FirebaseStorage> {
  await initializeFirebase();
  if (!storage) throw new Error("Firebase storage not initialized");
  return storage;
}

// For backwards compatibility - these will be null until initialized
export { app, auth, db, storage };
export default firebaseConfig;

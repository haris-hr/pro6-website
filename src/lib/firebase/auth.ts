import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getAuthInstance } from "./config";

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
  const auth = await getAuthInstance();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const auth = await getAuthInstance();
  await firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  let unsubscribe: () => void = () => {};
  
  getAuthInstance().then((auth) => {
    unsubscribe = onAuthStateChanged(auth, callback);
  }).catch((error) => {
    console.error("Error setting up auth listener:", error);
    callback(null);
  });
  
  return () => unsubscribe();
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const auth = await getAuthInstance();
  return auth.currentUser;
}

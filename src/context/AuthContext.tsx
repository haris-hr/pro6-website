"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        const { getAuthInstance } = await import("@/lib/firebase/config");
        const { onAuthStateChanged } = await import("firebase/auth");
        
        const auth = await getAuthInstance();
        
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { getAuthInstance } = await import("@/lib/firebase/config");
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    
    const auth = await getAuthInstance();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    const { getAuthInstance } = await import("@/lib/firebase/config");
    const { signOut: firebaseSignOut } = await import("firebase/auth");
    
    const auth = await getAuthInstance();
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

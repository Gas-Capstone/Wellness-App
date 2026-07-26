import { useState, useEffect, createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
};

export const userContext = createContext<UserContextType | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <userContext.Provider value={{ user, setUser, logout }}>
      {children}
    </userContext.Provider>
  );
};

// Use this instead of `useContext(userContext)` — narrows away the `| null` and throws a clear error if <UserProvider> isn't mounted.
export function useUserContext() {
  const ctx = useContext(userContext);
  if (!ctx) {
    throw new Error("useUserContext must be used within a <UserProvider>");
  }
  return ctx;
}

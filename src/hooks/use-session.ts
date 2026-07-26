import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export function useSession(): { session: Session | null; user: User | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

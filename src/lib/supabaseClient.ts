import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// AsyncStorage's web shim reads window.localStorage unconditionally, which
// crashes during Expo Router's SSR pass (window is undefined in that Node
// context). Only use it on native; on web, omit `storage` so supabase-js
// falls back to its own SSR-safe default (in-memory during SSR, real
// localStorage once hydrated in the browser).
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      ...(Platform.OS !== "web" && { storage: AsyncStorage }),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

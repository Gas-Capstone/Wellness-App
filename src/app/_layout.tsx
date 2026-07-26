import { Slot, Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserProvider } from "@/components/context/userContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { WorkoutSessionProvider } from "@/components/context/workoutSessionContext";
import { HabitsProvider } from "@/components/context/habitsContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { useColorScheme } from "react-native";
import "@/global.css"
import { WorkoutsDataProvider } from "@/components/context/workoutsDataContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark";
  const curTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const themeProviderTheme = isDark ? DarkTheme : DefaultTheme;
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }

      setReady(true);
      SplashScreen.hideAsync();
    };

    init();
  }, []);

  if (!ready) return null;

  return(
    <SafeAreaProvider>
    <UserProvider>
      <WorkoutSessionProvider>
        <WorkoutsDataProvider>
          <HabitsProvider>
        <GluestackUIProvider mode="dark">
          <PaperProvider theme={curTheme}>
            <ThemeProvider value={themeProviderTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(subpages)" />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </GluestackUIProvider>
        </HabitsProvider>
        </WorkoutsDataProvider>
      </WorkoutSessionProvider>
    </UserProvider>
  </SafeAreaProvider>
  
  );
}

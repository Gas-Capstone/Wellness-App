import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const curTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  const themeProviderTheme = isDark ? DarkTheme : DefaultTheme;
  return (
    <GluestackUIProvider mode="dark">
      <PaperProvider theme={curTheme}>
        <ThemeProvider value={themeProviderTheme}>
          <AnimatedSplashOverlay />
          <AppTabs />
        </ThemeProvider>
      </PaperProvider>
    </GluestackUIProvider>
  );
}

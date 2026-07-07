import { usePathname } from "expo-router";
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { Colors, MaxContentWidth, Spacing } from "@/constants/theme";

// ---- Config -----------------------------------------------------------
// Add / Remove tabs here. `icon` is typed directly off SymbolView's
// `name` prop, so `ios`/`web` are checked as literal symbol names
// instead of being widened to `string` and rejected later.

type SymbolIcon = React.ComponentProps<typeof SymbolView>["name"];
type TabHref = React.ComponentProps<typeof TabTrigger>["href"];

type TabConfig = {
  name: string;
  href: TabHref;
  label: string;
  icon: SymbolIcon;
};

const TABS: TabConfig[] = [
  {
    name: "home",
    href: "/",
    label: "Home",
    icon: { ios: "bed.double.fill", web: "apartment" },
  },
  {
    name: "explore",
    href: "/explore",
    label: "Explore",
    icon: { ios: "globe", web: "globe" },
  },
  /*{
    name: "habits",
    href: "/habits",
    label: "Habits",
    icon: { ios: "timer", web: "timer" },
  },*/
];

// ---- Root ---------------------------------------------------------------

export default function AppTabs() {
  const pathname = usePathname();
  const activeTab = TABS.find((t) => t.href === pathname) ?? TABS[0];

  return (
    <Tabs>
      <TopBadge activeTab={activeTab} />
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <BottomBar />
      </TabList>
    </Tabs>
  );
}

// ---- Top badge: fixed at the very top of the screen ---------------------

function TopBadge({ activeTab }: { activeTab: TabConfig }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" || !scheme ? "light" : scheme];
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="none"
      style={[styles.topBadgeContainer, { top: insets.top + Spacing.two }]}
    >
      <ThemedView type="backgroundElement" style={styles.topBadgeInner}>
        <SymbolView tintColor={colors.text} name={activeTab.icon} size={14} />
        <ThemedText type="smallBold" style={styles.topBadgeLabel}>
          {activeTab.label}
        </ThemedText>
      </ThemedView>
    </View>
  );
}

// ---- Bottom bar: TabList wrapper, holds one TabTrigger per tab ----------

function BottomBar(props: TabListProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        styles.bottomBarContainer,
        { paddingBottom: insets.bottom || Spacing.two },
      ]}
    >
      <ThemedView type="backgroundElement" style={styles.bottomBarInner}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
            <TabIcon tab={tab} />
          </TabTrigger>
        ))}
      </ThemedView>
    </View>
  );
}

// ---- Individual tab icon: raises itself above the bar when focused -----

function TabIcon({
  tab,
  isFocused,
  ...props
}: TabTriggerSlotProps & { tab: TabConfig }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" || !scheme ? "light" : scheme];

  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.tabIconWrapper,
        isFocused && styles.tabIconWrapperRaised,
        pressed && styles.pressed,
      ]}
    >
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={[styles.tabIconInner, isFocused && styles.tabIconInnerRaised]}
      >
        <SymbolView
          tintColor={isFocused ? colors.text : colors.textSecondary}
          name={tab.icon}
          size={isFocused ? 22 : 18}
        />
      </ThemedView>
    </Pressable>
  );
}

// ---- Styles ---------------------------------------------------------------

const styles = StyleSheet.create({
  // Top badge
  topBadgeContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  topBadgeInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  topBadgeLabel: {
    marginLeft: Spacing.one,
  },

  // Bottom bar
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: Spacing.three,
  },
  bottomBarInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-evenly",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    width: "100%",
    maxWidth: MaxContentWidth,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  // Individual icons
  tabIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapperRaised: {
    transform: [{ translateY: -Spacing.four }],
  },
  tabIconInner: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.four,
  },
  tabIconInnerRaised: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.7,
  },
});

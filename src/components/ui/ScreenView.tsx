import { ThemedView } from "../themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ScrollViewProps, View, StyleSheet } from "react-native"
import { styles } from "@/constants/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabInset, Spacing, TopBadgeInset } from "@/constants/theme";
import React from "react";

type ScreenViewProps = {
  children: React.ReactNode;
  header?: React.ReactNode; // header context is above the scroll area
  overlay?: React.ReactNode; // modals, floating buttons, etc
  onScroll?: ScrollViewProps["onScroll"]
}

export function ScreenView({
  children,
  header,
  overlay,
  onScroll
 }: ScreenViewProps) {
    // this component is used to provide a consistent styling throughout the app
    // provides safe areas, theme view, and scroll areas in one component
    const insets = useSafeAreaInsets();
    return (
      <ThemedView style={styles.screen}>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          {header}
          <ScrollView style={{ flex: 1, width: "100%" }}
           contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: BottomTabInset + insets.bottom + Spacing.four,
              paddingTop: header ? Spacing.three : TopBadgeInset
            }]
           }
            onScroll={onScroll}
            scrollEventThrottle={16}>
            {children}
          </ScrollView>
        </SafeAreaView>
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {overlay}
        </View>
      </ThemedView>
    );
  }
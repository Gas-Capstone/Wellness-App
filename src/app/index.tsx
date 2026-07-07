import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";

// ---- Mock data ------------------------------------------------------
// Placeholder content only — swap these for real state/data once the
// habit-tracking logic is wired up.

const MOCK_USER_NAME = "Fake Person";

const MOCK_STATS = [
  { label: "Day streak", value: "999" },
  { label: "Done today", value: "1/69" },
  { label: "Days Left Alive", value: "3" },
];

const MOCK_HABITS = [
  { id: "1", name: "Rick and Morty Marathon", time: "3:00 AM", done: true },
  { id: "2", name: "Go to Bed", time: "2:00 PM", done: true },
  { id: "3", name: "Wake Up", time: "2:15 PM", done: false },
  { id: "4", name: "Rick and Morty Marathon", time: "2:20 PM", done: false },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="small">{getGreeting()},</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {MOCK_USER_NAME}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statsRow}>
          {MOCK_STATS.map((stat) => (
            <ThemedView
              key={stat.label}
              type="backgroundElement"
              style={styles.statCard}
            >
              <ThemedText type="smallBold" style={styles.statValue}>
                {stat.value}
              </ThemedText>
              <ThemedText type="small">{stat.label}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.listSection}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>
            Today's habits
          </ThemedText>

          <ThemedView style={styles.habitList}>
            {MOCK_HABITS.map((habit) => (
              <ThemedView
                key={habit.id}
                type={habit.done ? "backgroundSelected" : "backgroundElement"}
                style={styles.habitCard}
              >
                <ThemedView style={styles.checkCircleWrapper}>
                  <ThemedView
                    style={[
                      styles.checkCircle,
                      habit.done && styles.checkCircleDone,
                    ]}
                  />
                </ThemedView>

                <ThemedView style={styles.habitTextGroup}>
                  <ThemedText style={habit.done && styles.habitNameDone}>
                    {habit.name}
                  </ThemedText>
                  <ThemedText type="small">{habit.time}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
  title: {
    marginTop: 0,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderRadius: Spacing.four,
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 18,
  },
  listSection: {
    flex: 1,
    gap: Spacing.three,
  },
  sectionLabel: {
    marginBottom: Spacing.one,
  },
  habitList: {
    gap: Spacing.two,
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  checkCircleWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
  },
  checkCircleDone: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  habitTextGroup: {
    flex: 1,
    gap: 2,
  },
  habitNameDone: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
});

import { useCallback, useContext, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ActivityIndicator, Card, IconButton, Text } from "react-native-paper";

import { userContext } from "@/components/context/userContext";
import { getCompletedWorkouts } from "@/lib/supabaseFunctions";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ScreenView } from "@/components/ui/ScreenView";
import { Spacing } from "@/constants/theme";

// Shape returned by getCompletedWorkouts — matches the fields already
// relied on in CompletedWorkoutsModal.tsx (name, duration_min, completed_at).
type CompletedWorkout = {
  id: string;
  name: string;
  duration_min: number;
  completed_at: string;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Counts consecutive days (including today) with at least one completed
// workout, walking backward from today until a day with none is found.
function getWorkoutStreak(completedWorkouts: CompletedWorkout[]) {
  if (!completedWorkouts.length) return 0;

  const completedDays = new Set(
    completedWorkouts.map((w) => new Date(w.completed_at).toDateString()),
  );

  let streak = 0;
  const cursor = new Date();

  while (completedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWorkoutsThisWeek(completedWorkouts: CompletedWorkout[]) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return completedWorkouts.filter(
    (w) => new Date(w.completed_at) >= startOfWeek,
  ).length;
}

// One row in the "Jump back in" section — a pressable card linking to
// another tab. No fabricated stats here; only shows real data when passed.
function QuickLinkCard({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  const router = useRouter();
  const goTo = () => router.navigate(href as any);

  return (
    <Card mode="contained" onPress={goTo}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        right={(props) => (
          <IconButton {...props} icon="chevron-right" onPress={goTo} />
        )}
      />
    </Card>
  );
}

export default function HomeScreen() {
  const { user } = useContext(userContext) ?? {};
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadWorkoutData = useCallback(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getCompletedWorkouts(user)
      .then((data) => setCompletedWorkouts(data ?? []))
      .catch((error) => {
        console.log(
          "Error fetching completed workouts on home screen: ",
          error,
        );
        setCompletedWorkouts([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Refetch whenever the Home tab regains focus, so a workout completed
  // elsewhere updates the streak/count here without a manual refresh.
  useFocusEffect(
    useCallback(() => {
      loadWorkoutData();
    }, [loadWorkoutData]),
  );

  const streak = useMemo(
    () => getWorkoutStreak(completedWorkouts),
    [completedWorkouts],
  );
  const workoutsThisWeek = useMemo(
    () => getWorkoutsThisWeek(completedWorkouts),
    [completedWorkouts],
  );

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <ScreenView
      header={
        <VStack space="xs" style={styles.header}>
          <Text variant="bodyLarge">{getGreeting()},</Text>
          <Text variant="displaySmall">{displayName}</Text>
        </VStack>
      }
    >
      <HStack space="sm" style={styles.statsRow}>
        <Card mode="contained" style={styles.statCard}>
          <Card.Content style={styles.statCardContent}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text variant="headlineMedium">{streak}</Text>
            )}
            <Text variant="labelMedium">Day streak</Text>
          </Card.Content>
        </Card>

        <Card mode="contained" style={styles.statCard}>
          <Card.Content style={styles.statCardContent}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text variant="headlineMedium">{workoutsThisWeek}</Text>
            )}
            <Text variant="labelMedium">Workouts this week</Text>
          </Card.Content>
        </Card>
      </HStack>

      <VStack space="sm" style={styles.linksSection}>
        <Text variant="titleMedium">Jump back in</Text>

        <QuickLinkCard
          title="Today's habits"
          subtitle="Check off what you've done today"
          href="/habits"
        />
        <QuickLinkCard
          title="Workouts"
          subtitle={
            workoutsThisWeek > 0
              ? `${workoutsThisWeek} completed this week`
              : "Find something to do today"
          }
          href="/workouts"
        />
        <QuickLinkCard
          title="Meals"
          subtitle="Plan or log what you're eating"
          href="/meals"
        />
      </VStack>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignSelf: "flex-start",
  },
  statsRow: {
    width: "100%",
  },
  statCard: {
    flex: 1,
  },
  statCardContent: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  linksSection: {
    alignSelf: "stretch",
  },
});

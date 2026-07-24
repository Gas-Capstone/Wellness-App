import { Stack } from "expo-router";
import { UserProvider } from "@/components/context/userContext";
import { WorkoutSessionProvider } from "@/components/context/workoutSessionContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function SubpagesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="workouttimer"
        options={{ title: "Workout Timer", presentation: "modal" }}
      />
    </Stack>

  );
}
import { useState, useEffect } from "react";
import { useUserContext } from "../../context/userContext";
import { useWorkoutSessionContext } from "@/components/context/workoutSessionContext";
import { ScreenView } from "../../ui/ScreenView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "react-native-paper";
import { styles } from "@/constants/styles";
import { Center } from "@/components/ui/center";

import { IconButton, Button } from "react-native-paper";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { CircleTimer } from "@/components/ui/CircleTimer";

import { setWorkoutComplete } from "@/lib/supabaseFunctions";

export default function WorkoutTimerPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const {
    workoutSession,
    completeSession,
    pauseSession,
    resumeSession,
    clearSession,
    getElapsedTime,
  } = useWorkoutSessionContext();

  // vars for timer
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // sets a "tick" every second to force a re-render of the timer, and keep the timecheck going
    if (workoutSession?.status !== "active") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [workoutSession?.status]);

  useEffect(() => {
    // fires when timer is finished
    if (workoutSession?.status !== "active") return;
    if (workoutSession.plannedDuration * 60 * 1000 - getElapsedTime() <= 0) {
      setWorkoutComplete(user, workoutSession.workout);
      completeSession();
    }
  }, [workoutSession?.status, getElapsedTime, now]);

  // workoutSession can be null; this guard sits after all hooks (Rules of Hooks) since useEffect above must run unconditionally.
  if (!workoutSession) {
    return null;
  }

  const totalMS = workoutSession.plannedDuration * 60 * 1000;
  const elapsedMS = getElapsedTime();
  const remainingMS = Math.max(totalMS - elapsedMS, 0);
  const remainingMins =
    workoutSession.status === "complete" ? 0 : Math.floor(remainingMS / 60000);
  const remainingSecs =
    workoutSession.status === "complete"
      ? 0
      : Math.floor((remainingMS % 60000) / 1000);
  const timerLabel = `${remainingMins}:${remainingSecs.toString().padStart(2, "0")}`;
  const timerProgress =
    workoutSession.status === "complete"
      ? 0
      : totalMS > 0
        ? remainingMS / totalMS
        : 0;

  return (
    <ScreenView
      header={
        <HStack style={{ alignContent: "flex-start", width: "100%" }}>
          <IconButton
            icon="arrow-left"
            size={25}
            onPress={() => router.back()}
          />
        </HStack>
      }
    >
      <VStack
        style={{ width: "100%", alignContent: "center", alignItems: "center" }}
        space="sm"
      >
        <CircleTimer
          progress={timerProgress}
          label={timerLabel}
          duration={1000}
        />
        <Text variant="headlineMedium">{workoutSession.workout.name}</Text>
        <Button mode="contained" onPress={() => pauseSession()}>
          Pause Session
        </Button>
        <Button mode="contained" onPress={() => resumeSession()}>
          Resume Session
        </Button>
        <Button mode="contained" onPress={() => completeSession()}>
          Complete Session
        </Button>
      </VStack>
    </ScreenView>
  );
}

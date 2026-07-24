import { useState, useEffect, useContext } from "react"
import { userContext } from "../../context/userContext";
import { workoutSessionContext } from "@/components/context/workoutSessionContext";
import { ScreenView } from "../../ui/ScreenView"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Text } from "react-native-paper"
import { styles } from "@/constants/styles";
import { Center } from "@/components/ui/center";

import { IconButton, Button } from "react-native-paper"
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { CircleTimer } from "@/components/ui/CircleTimer";

export default function WorkoutTimerPage() {
    const router = useRouter()
    const { user } = useContext(userContext)
    const { workoutSession, completeSession, pauseSession, resumeSession, clearSession, getElapsedTime } = useContext(workoutSessionContext)
    const [ secondsLeft, setSecondsLeft ] = useState(0);
    const { workoutId } = useLocalSearchParams<{
        workoutId: string;
    }>();

    useEffect(() => {
        setSecondsLeft(workoutSession.duration_min * 60)

    })
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
            <VStack style={{ width: "100%", alignContent: "center", alignItems: "center" }} space="sm">
                <Text>{workoutSession.workout.name}</Text>
                <Text>{workoutSession.plannedDuration}</Text>
                <Text>{workoutSession.status}</Text>
                <Button mode="contained" onPress={() => pauseSession()}>Pause Session</Button>
                <Button mode="contained" onPress={() => resumeSession()}>Resume Session</Button>
                <Button mode="contained" onPress={() => completeSession()}>Complete Session</Button>
            </VStack>
        </ScreenView>
    )
}
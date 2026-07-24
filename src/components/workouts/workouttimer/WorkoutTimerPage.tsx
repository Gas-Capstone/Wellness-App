import { useState, useEffect, useContext } from "react"
import { userContext } from "../../context/userContext";
import { workoutSessionContext } from "@/components/context/workoutSessionContext";
import { ScreenView } from "../../ui/ScreenView"
import { useLocalSearchParams } from "expo-router"
import { Text } from "react-native-paper"

export default function WorkoutTimerPage() {
    const { user } = useContext(userContext)
    const { workoutSession, completeSession } = useContext(workoutSessionContext)
    const { workoutId } = useLocalSearchParams<{
        workoutId: string;
    }>();
    return (
        <ScreenView>
            <Text>Placeholder</Text>
        </ScreenView>
    )
}
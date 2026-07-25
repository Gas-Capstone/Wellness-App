import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";

type WorkoutSession = {
    workout: {
        id: string;
        name: string;
        difficulty: string;
        target: string;
        duration_min: number;
    }
    plannedDuration: number;
    startedAt: number | null;
    pausedAt: number | null;
    accumulatedTime: number; // time left on timer at pause
    status: "active" | "idle" | "paused" | "complete"
}

const workoutSessionContext = createContext(null);

const WorkoutSessionProvider = ({ children }) => {
    const [ workoutSession, setWorkoutSession ] = useState<WorkoutSession | null>(null)

    const startSession = (workout, plannedDuration: number) => {
        setWorkoutSession({
            workout: {
                id: workout.id,
                name: workout.name,
                difficulty: workout.difficulty,
                target: workout.target,
                duration_min: plannedDuration
            },
            plannedDuration: plannedDuration,
            startedAt: Date.now(),
            pausedAt: null,
            accumulatedTime: 0,
            status: "idle"
        })
    }

    const pauseSession = () => {
        setWorkoutSession((prevSession) => {
            if (!prevSession || prevSession.status !== "active" || prevSession.startedAt == null) return prevSession
            return {
                ...prevSession,
                pausedAt: Date.now(),
                accumulatedTime: prevSession.accumulatedTime + (Date.now() - prevSession.startedAt),
                startedAt: null,
                status: "paused",
            }
        })
    }

    const resumeSession = () => {
        setWorkoutSession((session) => {
            if (!session || session.status !== "paused" && session.status !== "idle") return session;
            return {
                ...session,
                startedAt: Date.now(),
                pausedAt: null,
                status: "active"
            }
        })
    }

    const completeSession = () => {
        setWorkoutSession((session) => {
            if (!session) return session
            return {
                ...session,
                status: "complete",
                startedAt: null,
                pausedAt: null
            }
        })
    }

    const clearSession = () => {
        setWorkoutSession(null)
    }
    
    const getElapsedTime = () => {
        // returns elapsed time in milliseconds
        if (!workoutSession) return 0
        if (workoutSession.status === "active" && workoutSession.startedAt != null) {
            return workoutSession.accumulatedTime + (Date.now() - workoutSession.startedAt)
        }
        return workoutSession.accumulatedTime
    }

    const contextValue = {
        workoutSession, startSession, completeSession, clearSession,
        pauseSession, resumeSession, getElapsedTime,
    }

    return (
        <workoutSessionContext.Provider value={contextValue}>
            {children}
        </workoutSessionContext.Provider>
    )
}

export { workoutSessionContext, WorkoutSessionProvider }
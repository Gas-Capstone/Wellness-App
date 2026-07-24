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
                duration_min: workout.duration_min,
            },
            plannedDuration: plannedDuration,
            status: "active"
        })
    }

    const completeSession = () => {
        setWorkoutSession((prevSession) => {
            if (!prevSession) return prevSession
            return { ...prevSession, status: "complete"}
        })
    }

    const clearSession = () => {
        setWorkoutSession(null)
    }
    
    const contextValue = {
        workoutSession, startSession, completeSession, clearSession
    }

    return (
        <workoutSessionContext.Provider value={contextValue}>
            {children}
        </workoutSessionContext.Provider>
    )
}

export { workoutSessionContext, WorkoutSessionProvider }
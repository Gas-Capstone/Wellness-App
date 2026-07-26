import React, { createContext, useCallback, useContext, useState, useEffect } from "react";
import { getCompletedWorkouts, getWorkouts } from "@/lib/supabaseFunctions";
import { userContext } from "./userContext";

// Lifted out of WorkoutsPage's local useState so index.tsx can read the same data.

// A full workout definition (from getWorkouts()) — has difficulty/target and an optional tag list.
export type Workout = {
  id: string;
  name: string;
  difficulty: string;
  target: string;
  duration_min: number;
  goal_tags?: string[];
};

// A logged completion record (from getCompletedWorkouts()) — different shape than Workout, has required completed_at.
export type CompletedWorkout = {
  id: string;
  name: string;
  duration_min: number;
  completed_at: string;
};

export type WorkoutsDataContextType = {
  workoutList: Workout[];
  completedWorkouts: CompletedWorkout[];
  loading: boolean;
  refreshWorkouts: () => void;
  refreshCompletedWorkouts: () => void;
};

export const workoutsDataContext =
  createContext<WorkoutsDataContextType | null>(null);

type WorkoutsDataProviderProps = {
  children: React.ReactNode;
};

export const WorkoutsDataProvider = ({
  children,
}: WorkoutsDataProviderProps) => {
  const { user } = useContext(userContext) ?? {};
  const [workoutList, setWorkoutList] = useState<Workout[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);
  const [loading, setLoading] = useState(true);

  const refreshWorkouts = useCallback(() => {
    getWorkouts()
      .then((data) => setWorkoutList(data ?? []))
      .catch((error) => {
        console.log("Error fetching workouts: ", error);
        setWorkoutList([]);
      });
  }, []);

  const refreshCompletedWorkouts = useCallback(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getCompletedWorkouts(user)
      .then((data) => setCompletedWorkouts(data ?? []))
      .catch((error) => {
        console.log("Error fetching completed workouts: ", error);
        setCompletedWorkouts([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    refreshWorkouts();
    refreshCompletedWorkouts();
  }, [user, refreshWorkouts, refreshCompletedWorkouts]);

  const contextValue: WorkoutsDataContextType = {
    workoutList,
    completedWorkouts,
    loading,
    refreshWorkouts,
    refreshCompletedWorkouts,
  };

  return (
    <workoutsDataContext.Provider value={contextValue}>
      {children}
    </workoutsDataContext.Provider>
  );
};

// Use this instead of `useContext(workoutsDataContext)` — throws a clear error if <WorkoutsDataProvider> isn't mounted.
export function useWorkoutsData() {
  const ctx = useContext(workoutsDataContext);
  if (!ctx) {
    throw new Error(
      "useWorkoutsData must be used within a <WorkoutsDataProvider>",
    );
  }
  return ctx;
}

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  CompletionsByDate,
  Habit,
  Weekday,
  addHabitToList,
  removeHabitFromList,
} from "@/lib/habits/habits";
import { getTodaysDate } from "@/lib/time_management/week";

// Lifted out of HabitsScreen's local useState so index.tsx can read the same data.

type ToggleHabitArgs = {
  habitId: number;
  habitDate: string;
};

type AddHabitArgs = {
  title: string;
  time: string;
  weekdays: Weekday[];
};

export type HabitsContextType = {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  habitArray: Habit[];
  habitCompletions: CompletionsByDate;
  addHabit: (habit: AddHabitArgs) => void;
  removeHabit: (habitId: number) => void;
  toggleHabit: (args: ToggleHabitArgs) => void;
};

export const habitsContext = createContext<HabitsContextType | null>(null);

type HabitsProviderProps = {
  children: React.ReactNode;
};

export const HabitsProvider = ({ children }: HabitsProviderProps) => {
  const [selectedDate, setSelectedDate] = useState(getTodaysDate());
  const [habitArray, setHabitArray] = useState<Habit[]>([]);
  const [habitCompletions, setHabitCompletions] = useState<CompletionsByDate>(
    {},
  );

  const toggleHabit = useCallback(({ habitId, habitDate }: ToggleHabitArgs) => {
    setHabitCompletions((prev) => {
      const cur = prev[habitDate] ?? [];
      const next = cur.includes(habitId)
        ? cur.filter((id) => id !== habitId)
        : [...cur, habitId];
      return { ...prev, [habitDate]: next };
    });
  }, []);

  const addHabit = useCallback(({ title, time, weekdays }: AddHabitArgs) => {
    setHabitArray((prev) => addHabitToList(prev, title, time, weekdays));
  }, []);

  const removeHabit = useCallback((habitId: number) => {
    setHabitArray((prev) => removeHabitFromList(prev, habitId));
  }, []);

  const contextValue: HabitsContextType = {
    selectedDate,
    setSelectedDate,
    habitArray,
    habitCompletions,
    addHabit,
    removeHabit,
    toggleHabit,
  };

  return (
    <habitsContext.Provider value={contextValue}>
      {children}
    </habitsContext.Provider>
  );
};

// Use this instead of `useContext(habitsContext)` — throws a clear error if <HabitsProvider> isn't mounted.
export function useHabitsContext() {
  const ctx = useContext(habitsContext);
  if (!ctx) {
    throw new Error("useHabitsContext must be used within a <HabitsProvider>");
  }
  return ctx;
}

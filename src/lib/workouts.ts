import { getDay, parseISO } from "date-fns";
import type { Workout } from "@/components/context/workoutsDataContext";

// `workouts: []` was an empty-tuple type (typo for `Workout[]`), which broke every real call site.
export function getWorkoutsWithTag(
  workouts: Workout[],
  tag: string,
): Workout[] {
  if (tag === "all") return workouts;
  else
    return workouts.filter(
      (workout) => workout.goal_tags?.includes(tag) ?? false,
    );
}

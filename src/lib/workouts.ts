import { getDay, parseISO } from "date-fns";

export function getWorkoutsWithTag(workouts: [], tag: string){
    if (tag === "all") return workouts
    else return workouts.filter((workout) => workout.goal_tags.includes(tag))
}
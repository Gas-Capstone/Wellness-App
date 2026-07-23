import { useState, useEffect, useContext } from "react"
import { userContext } from "../context/userContext";
import { getCompletedWorkouts, getWorkouts, setWorkoutComplete } from "@/lib/supabaseFunctions";
import { WorkoutCard } from "./WorkoutCard";
import { ScreenView } from "../ui/ScreenView";
import { Chip, Divider } from "react-native-paper";
import { styles } from "@/constants/styles";
import { HStack } from "../ui/hstack";
import { WorkoutFilterChip } from "./WorkoutFilterChip";
import { getWorkoutsWithTag } from "@/lib/workouts";
import { ScrollView } from "react-native";
import { Spacing, TopBadgeInset } from "@/constants/theme";
import { WorkoutsAnimatedFAB } from "./WorkoutsAnimatedFAB";
import { CompletedWorkoutsModal } from "./CompletedWorkoutsModal";
import { StartWorkoutModal } from "./StartWorkoutModal";

export default function WorkoutsPage() {
    const { user } = useContext(userContext)
    const [ workoutList, setWorkoutList ] = useState([])
    const [ workoutTags, setWorkoutTags ] = useState([])
    const [ selectedTag, setSelectedTag ] = useState<String>("all")
    const [ completedWorkouts, setCompletedWorkouts ] = useState([])
    const [ fabExtended, setFabExtended ] = useState(true);
    const [ completedModalVisible, setCompletedModalVisible ] = useState(false)
    const [ startModalVisible, setStartModalVisible ] = useState(false)
    const [ selectedWorkout, setSelectedWorkout ] = useState<Object>({})

    const onScroll = ({ nativeEvent }) => {
        const currentPos = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
        setFabExtended(currentPos <= 0)
    }

    const setFilter = (tag) => {
        setSelectedTag(tag)
    }

    const getAndSetCompletedWorkouts = async () => {
        getCompletedWorkouts(user).then((data) => {
            setCompletedWorkouts(data)
        }).catch((error) => {
            console.log("Error fetching completed workouts: ", error)
            setCompletedWorkouts([])
        }
        )}

    const handleStart = (workout) => {
        setSelectedWorkout(workout)
        setStartModalVisible(true)
    }

    const handleCompletion = async (workout, mins) => {
        const completedWorkout = {...workout, duration_min: mins}
        setWorkoutComplete(user, completedWorkout)
        console.log("Workout completed: ", workout.name, workout.duration_min)
        setStartModalVisible(false)
        await getAndSetCompletedWorkouts()
    }

    useEffect(() => {
        if (!user?.id) return

        getWorkouts().then((data) => {
            setWorkoutList(data)
            let tags = [... new Set(data?.flatMap((workout) => workout.goal_tags ?? []))].sort()
            setWorkoutTags(tags)
        }).catch((error) => console.log("Error while fetching workouts on workouts page: ", error))

        getAndSetCompletedWorkouts()
    }, [user])

    const filteredWorkouts = getWorkoutsWithTag(workoutList, selectedTag)
    return (
        <>
        {/* TODO: 
            1. add workout display cards DONE
            2. add ability to filter workouts DONE
            3. add ability to add workout to "completed" WIP
            4. add ability to view completed workouts
            5. add "settings" modal before starting workout
            6. add workout timer
            7. Add calendar
            */}
            <ScreenView
                onScroll={onScroll}

                overlay={
                    <>
                        <WorkoutsAnimatedFAB
                            extended={fabExtended}
                            onPress={() => setCompletedModalVisible(true)}
                        />
                        <CompletedWorkoutsModal
                            visible={completedModalVisible}
                            onDismiss={() => setCompletedModalVisible(false)}
                            workouts={completedWorkouts}
                        />
                        {selectedWorkout?.id &&(
                        <StartWorkoutModal
                            visible={startModalVisible}
                            user={user}
                            onDismiss={() => setStartModalVisible(false)}
                            workout={selectedWorkout}
                            onStart={(workout, mins) => handleCompletion(workout, mins)}
                        />)}
                    </>
                }

                header={
                    <>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ flexGrow: 0, paddingTop: TopBadgeInset, paddingBottom: Spacing.two}}
                            contentContainerStyle={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                paddingHorizontal: Spacing.four
                            }}
                        >
                            {workoutTags.map((tag) => 
                            <WorkoutFilterChip
                                key={tag}
                                tag={tag}
                                isSelected={selectedTag === tag}
                                onSelect={(tag) => setFilter(tag)}
                            />
                            )}
                        </ScrollView>
                        <Divider bold style={{width: "100%"}}></Divider>
                    </>
                }
            >
                {filteredWorkouts.map((workout) => ( 
                    <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onPress={() => handleStart(workout)}
                    />
                ))}
            </ScreenView>
        </>

    )
}
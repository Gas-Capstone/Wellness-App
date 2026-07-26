import { useState, useEffect, useContext, useCallback } from "react"
import { userContext } from "../context/userContext";
import { workoutSessionContext } from "../context/workoutSessionContext";
import { getCompletedWorkouts, getWorkouts, setWorkoutComplete } from "@/lib/supabaseFunctions";
import { WorkoutCard } from "./WorkoutCard";
import { ScreenView } from "../ui/ScreenView";
import { useRouter, usePathname, useFocusEffect } from "expo-router"
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
    const router = useRouter();
    const { user } = useContext(userContext)
    const { startSession, clearSession } = useContext(workoutSessionContext)
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

    const handleTimer = (workout, mins) => {
        const completedWorkout= {...workout, duration_min: mins}
        startSession(workout, mins)
        setStartModalVisible(false)
        router.navigate({
            pathname: "/workouttimer",
            params: { workoutId: String(workout.id) }
        })
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
    
    useFocusEffect(
        // grabs completed workouts whenever page is focused
        useCallback(() => {
            if (!user?.id) return
            clearSession()
            getAndSetCompletedWorkouts()
        }, [user?.id])
    )

    const filteredWorkouts = getWorkoutsWithTag(workoutList, selectedTag)
    return (
        <>
        {/* TODO: 
            1. add workout display cards DONE
            2. add ability to filter workouts DONE
            3. add ability to add workout to "completed" WIP
            4. add ability to view completed workouts DONE
            5. add "settings" modal before starting workout DONE
            6. add workout timer WIP
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
                            onStart={(workout, mins) => handleTimer(workout, mins)}
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
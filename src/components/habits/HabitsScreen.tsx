import { HStack } from "@/components/ui/hstack";
import { styles } from "@/constants/styles";
import { useEffect, useState } from "react";
import { Divider, Text, AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import { WeekStrip } from "./WeekStrip";
import { View } from "react-native";
import { HabitAnimatedFAB } from "./HabitAnimatedFAB";
import { HabitCard } from "./HabitCard";
import { getTodaysDate } from "@/lib/time_management/week";
import { CompletionsByDate, Habit, isHabitDone, addHabitToList, removeHabitFromList, getHabitsForDate } from "@/lib/habits/habits";
import { AddHabitModal } from "./AddHabitModal";


export default function HabitsScreen() {
  const [ selectedDate, setSelectedDate ] = useState(getTodaysDate())
  const [ fabExtended, setFabExtended ] = useState(true);
  const [ habitArray, setHabitArray ] = useState<Habit[]>([])
  const [ habitCompletions, setHabitCompletions ] = useState<CompletionsByDate>({});
  const [ modalVisible, setModalVisible ] = useState(false)

  const toggleHabit = ({habitId, habitDate}) => {
    setHabitCompletions((prev) => {
      const cur = prev[habitDate] ?? []

      const next = cur.includes(habitId)
        ? cur.filter((id) => id !== habitId)
        : [...cur, habitId]

      return { ...prev, [habitDate]: next}
    })
  }

  const addHabit = ({ title, time, weekdays }) => {
    setHabitArray((prev) => addHabitToList(prev, title, time, weekdays))
  }

  const removeHabit = (habitId: number) => {
    setHabitArray((prev) => removeHabitFromList(prev, habitId))
  }

  const habitsForDay = getHabitsForDate(habitArray, selectedDate)
  const habitNumber = habitsForDay.length;
  // use .filter to grab number of habits complete based on result of isHabitDone() for given habit
  const habitsComplete = habitsForDay.filter((habit) =>
    isHabitDone(habit.id, selectedDate, habitCompletions)
  ).length

  const onScroll = ({ nativeEvent }) => {
    const currentPos = Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    setFabExtended(currentPos <= 0)
  }

    return (
        <>
          <SafeAreaView style={styles.safeArea}>
            <View />
                <HStack style={styles.rowBox}>
                    <Text variant="headlineLarge">Habits</Text>
                    <Text variant="titleMedium">{habitsComplete}/{habitNumber} complete</Text>
                </HStack>
                <VStack style={styles.columnContainer} space="md">
                  <WeekStrip
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                  />
                  <Divider bold style={{ width: "100%" }}/>
                  {habitsForDay.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      title={habit.title}
                      time={habit.time}
                      isDone={isHabitDone(habit.id, selectedDate, habitCompletions)}
                      onToggle={() => toggleHabit({ habitId: habit.id, habitDate: selectedDate })}
                      onDelete={() => removeHabit(habit.id)}
                    />
                  ))}
                </VStack>
            </SafeAreaView>

            <HabitAnimatedFAB
              extended={fabExtended}
              onPress={() => setModalVisible(true)}
            />

            <AddHabitModal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              onSave={(habit) => {
                addHabit(habit)
              }}
            />
        </>
    )
}

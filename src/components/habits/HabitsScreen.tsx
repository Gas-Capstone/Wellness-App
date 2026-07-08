import { HStack } from "@/components/ui/hstack";
import { styles } from "@/constants/styles";
import { useEffect, useState } from "react";
import { Divider, Text, AnimatedFAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import { WeekStrip } from "./WeekStrip";
import { View } from "react-native";

export default function HabitsScreen() {
  const [ habitsComplete, setHabitsComplete ] = useState(0)
  const [ habitNumber, setHabitNumber ] = useState(0)
  const [ selectedDate, setSelectedDate ] = useState("")
  useEffect(() => {
    setHabitNumber(3)
  }, [])
    return (
        <>
          <SafeAreaView style={styles.safeArea}>
            <View />
                <HStack style={styles.rowBox}>
                    <Text variant="headlineLarge">Habits</Text>
                    <Text variant="titleMedium">{habitsComplete}/{habitNumber} complete</Text>
                </HStack>
                <VStack style={styles.columnContainer} space="md">
                  <WeekStrip/>
                  <Divider bold style={{ width: "100%" }}/>
                  <Text>test</Text>
                </VStack>
            </SafeAreaView>
        </>
    )
}

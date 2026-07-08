import { styles } from "@/constants/styles";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center"
import { startOfWeek, addDays } from "date-fns"
import { Text, Button, Avatar, TouchableRipple, useTheme } from "react-native-paper"
import { useState, useContext } from "react";
import { WeekButton } from "./WeekButton";
import { getWeekArray } from "@/lib/time_management/week";

type weekStripProps = {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

export function WeekStrip({ selectedDate, onSelectDate }: weekStripProps) {
    const weekArray = getWeekArray()
    const days = weekArray.map((day) => day.dayNumber)
    return (
        <>
        <HStack space="sm" style={styles.rowBox}>
            {weekArray.map((day) => (
                <WeekButton 
                    key={day.fullDate}
                    day={day} 
                    isSelected={selectedDate === day.fullDate}
                    onPress={() => onSelectDate(day.fullDate)}
                />
            ))}
        </HStack>
        </>
    )
}
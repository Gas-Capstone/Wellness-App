import { styles } from "@/constants/styles";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center"
import { startOfWeek, addDays } from "date-fns"
import { Text, Button, Avatar, TouchableRipple, useTheme } from "react-native-paper"
import { useState, useContext } from "react";
import { WeekButton } from "./WeekButton";

function getWeek() {
    // using Date() and date-fns to get current week, returning array of objects
    const sunday = startOfWeek(new Date())
    const weekArray = Array.from({length: 7}, (_, cur) => {
        const date = addDays(sunday, cur)
        /* return format:
            dayOfWeek: "Sunday/Monday/Tuesday/etc..."
            fullDate: "mm/dd/yyyy"
            dayNumber: "dd"
            label: String containing first letter of day of week ("S"/"M"/"T"/etc...)
        */
        return {
            dayOfWeek: date.toLocaleString('default', {weekday: "long"}),
            fullDate: date.toLocaleString('default', {year: "numeric", day: "numeric", month: "numeric"}),
            dayNumber: date.toLocaleString('default', {day: "numeric"}),
            label: date.toLocaleString('default', {weekday: "narrow"})
        }
    })

    return weekArray
}


export function WeekStrip() {
    const [ selectedDate, setSelectedDate ] = useState("")
    const weekArray = getWeek()
    const days = weekArray.map((day) => day.dayNumber)
    return (
        <>
        <HStack space="sm" style={styles.rowBox}>
            {weekArray.map((day) => (
                    <WeekButton key={day.fullDate} day={day} selectedDate={selectedDate} onPress={() => setSelectedDate(day.dayNumber)} />
            ))}
        </HStack>
        </>
    )
}
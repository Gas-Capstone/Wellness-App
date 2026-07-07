import { Button, Text, Avatar, useTheme } from "react-native-paper"
import { useState, useEffect } from "react"
import { Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";

type weekButtonProps = {
    day: {
        dayOfWeek: string;
        fullDate: string;
        dayNumber: string;
        label: string;
    }
    selectedDate: string;
    onPress?: () => void;
}

export function WeekButton({ day, selectedDate, onPress }: weekButtonProps) {
    const isSelected = (selectedDate === day.dayNumber)
    const SIZE = 40
    const theme = useTheme();
    return (
        <VStack style={{ alignItems: "center" }} space="xs">
            <Text variant="labelMedium" style={{ textAlign: "center" }}>{day.label}</Text>
            <Pressable onPress={onPress} style={{
                borderRadius: SIZE/2
            }}
            >
                <Avatar.Text
                    size={SIZE}
                    label={day.dayNumber}
                    style={{
                        backgroundColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.surface
                    }}
                />
            </Pressable>
        </VStack>
    )
}

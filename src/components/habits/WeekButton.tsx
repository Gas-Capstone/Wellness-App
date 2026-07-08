import { Button, Text, Avatar, useTheme } from "react-native-paper"
import { useState, useEffect } from "react"
import { Pressable } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { WeekDay } from "@/lib/time_management/week";

type weekButtonProps = {
    day: WeekDay;
    isSelected: boolean;
    onPress?: () => void;
}

export function WeekButton({ day, isSelected, onPress }: weekButtonProps) {
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

import React from "react";
import { AnimatedFAB } from "react-native-paper";
import { styles } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { StyleProp, ViewStyle } from "react-native";


type habitAnimatedFABProps = {
    extended: boolean;
    label?: string;
    visible?: boolean;
    animateFrom?: "left" | "right";
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
};

export function HabitAnimatedFAB({
    extended,
    label="Add habit",
    visible=true,
    animateFrom="right",
    onPress,
    style,
}: habitAnimatedFABProps) {
    const fabStyle = { [animateFrom]: 16 }
    return (
        <AnimatedFAB
            icon="plus"
            label={label}
            extended={extended}
            visible={visible}
            style={[styles.animatedFABStyle, fabStyle, style
            ]}
            onPress={onPress}
        />
    )
}

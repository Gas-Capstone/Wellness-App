import React from "react";
import { AnimatedFAB } from "react-native-paper";
import { styles } from "@/constants/styles";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


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
    const insets = useSafeAreaInsets()
    return (
        <AnimatedFAB
            icon="plus"
            label={label}
            extended={extended}
            visible={visible}
            style={[styles.animatedFABStyle, 
            {
                right: Spacing.three,
                bottom: BottomTabInset + insets.bottom + Spacing.four
            }, style
            ]}
            onPress={onPress}
        />
    )
}

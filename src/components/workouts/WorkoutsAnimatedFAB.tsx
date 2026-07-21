import { AnimatedFAB } from "react-native-paper";
import { styles } from "@/constants/styles";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { StyleProp, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type workoutsAnimatedFABProps = {
    extended: boolean;
    label?: string;
    visible?: boolean;
    animateFrom?: "left" | "right";
    style?: StyleProp<ViewStyle>;
    onPress: () => void;
}

export function WorkoutsAnimatedFAB({
    extended,
    label="View completed workouts",
    visible=true,
    animateFrom="right",
    onPress,
    style,
}: workoutsAnimatedFABProps) {
    const insets = useSafeAreaInsets()
    return (
        <AnimatedFAB    
            icon="view-list"
            label={label}
            extended={extended}
            visible={visible}
            animateFrom="left"
            style={[
                {
                    left: Spacing.three,
                    bottom: BottomTabInset + insets.bottom + Spacing.four,
                    position: "absolute",
                    ...(extended ? {} : {width: 56})
                }, style
            ]}
            onPress={onPress}
        />
    )
}
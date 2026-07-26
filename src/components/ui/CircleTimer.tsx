import { useEffect } from "react"
import { StyleSheet } from "react-native"
import Svg, { Circle } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from "react-native-reanimated"
import { Text, useTheme } from "react-native-paper"
import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type CircleTimerProps = {
    progress: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    duration?: number;
}

export function CircleTimer({
    progress,
    size=240,
    strokeWidth=14,
    label,
    duration=400,
}: CircleTimerProps) {
    const theme = useTheme()
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animated = useSharedValue(0);
    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - animated.value),
    }))

    useEffect(() => {
        animated.value = withTiming(progress, {
            duration,
            easing: Easing.out(Easing.cubic),
        })
    }, [progress, duration])

    return (
        <Box style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    stroke={theme.colors.surfaceVariant}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    stroke={theme.colors.primary}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </Svg>

            <Center style={StyleSheet.absoluteFill} pointerEvents="none">
                <Text variant="displaySmall">
                    {label ?? `${Math.round(progress*100)}%`}
                </Text>
            </Center>
        </Box>
    )
}
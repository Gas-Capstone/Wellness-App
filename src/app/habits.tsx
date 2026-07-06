import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HabitsScreen() {
    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.safeArea}>
                    <Text variant="headlineMedium">Habits</Text>
                    <Button mode="contained">New Habit</Button>
                </View>
            </SafeAreaView>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'row',
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: Spacing.four,
      alignItems: 'center',
      gap: Spacing.three,
      paddingBottom: BottomTabInset + Spacing.three,
      maxWidth: MaxContentWidth,
    },
    heroSection: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingHorizontal: Spacing.four,
      gap: Spacing.four,
    },
    title: {
      textAlign: 'center',
    },
    code: {
      textTransform: 'uppercase',
    },
    stepContainer: {
      gap: Spacing.three,
      alignSelf: 'stretch',
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.four,
      borderRadius: Spacing.four,
    },
  });
  
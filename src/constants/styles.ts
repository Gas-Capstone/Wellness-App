import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
      },
      columnContainer: {
        flex: 1,
        flexDirection: "column",
        flexWrap: "wrap",
        alignSelf: "stretch",
        alignItems: "center"
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
      rowBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
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
      centerContent: {
        flex: 1,
        gap: Spacing.three,
      },
      animatedFABStyle: {
        bottom: 16,
        right: 16,
        position: "absolute",
      }
})
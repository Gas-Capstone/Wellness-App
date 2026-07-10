import { TextInput, StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { TextInputProps } from "react-native-paper";

export function Input(props: TextInputProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <TextInput {...props} placeholderTextColor="#888" style={styles.input} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  input: {
    fontSize: 16,
    color: "white",
  },
});

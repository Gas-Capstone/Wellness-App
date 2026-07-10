// app/(auth)/register.tsx
import { useState } from "react";
import { View, useColorScheme } from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Colors, Spacing, MaxContentWidth } from "@/constants/theme";
import { supabase } from "@/lib/supabaseClient";

export default function Register() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirm;

  async function handleRegister() {
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.replace("/");
    }

    setLoading(false);
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
      }}
    >
      <ThemedView
        type="backgroundElement"
        style={{
          width: "100%",
          maxWidth: MaxContentWidth,
          padding: Spacing.four,
          borderRadius: Spacing.five,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <ThemedText type="title" style={{ marginBottom: Spacing.four }}>
          Create Account
        </ThemedText>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{ marginBottom: Spacing.four }}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ marginBottom: Spacing.four }}
        />

        <Input
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={{ marginBottom: Spacing.four }}
        />

        {!passwordsMatch && confirm.length > 0 && (
          <ThemedText
            type="smallBold"
            style={{ color: "red", marginBottom: Spacing.two }}
          >
            Passwords do not match
          </ThemedText>
        )}

        {error.length > 0 && (
          <ThemedText
            type="smallBold"
            style={{ marginBottom: Spacing.two, color: "#ff4d4f" }}
          >
            {error}
          </ThemedText>
        )}

        <Button onPress={handleRegister} isDisabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </ThemedView>
    </View>
  );
}

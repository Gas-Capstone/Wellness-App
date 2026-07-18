import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Chip, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { styles } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { INGREDIENTS, INITIAL_FRIDGE_IDS, RECIPES, matchRecipes } from "@/lib/meals/meals";

import { RecipeCard } from "./RecipeCard";

export default function MealsScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [fridge, setFridge] = useState<ReadonlySet<number>>(new Set(INITIAL_FRIDGE_IDS));

  const removeIngredient = (id: number) => {
    setFridge((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const fridgeItems = INGREDIENTS.filter((i) => fridge.has(i.id));
  const { ready, almost } = useMemo(() => matchRecipes(RECIPES, fridge), [fridge]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View />
        <ScrollView style={{ alignSelf: "stretch" }} showsVerticalScrollIndicator={false}>
          <VStack style={styles.columnContainer} space="md">
            {/* Adds ingredients to the fridge; autocomplete against the
                ingredients catalog comes with the Supabase wiring. */}
            <Searchbar
              placeholder="Search ingredients to add"
              value={query}
              onChangeText={setQuery}
              style={{ alignSelf: "stretch" }}
            />

            <VStack space="sm" style={{ alignSelf: "stretch" }}>
              <HStack style={styles.rowBox}>
                <Text variant="titleMedium">In my fridge</Text>
                <Text>{fridgeItems.length} {fridgeItems.length === 1 ? "item" : "items"}</Text>
              </HStack>

              {fridgeItems.length > 0 ? (
                <HStack space="sm" style={{ flexWrap: "wrap" }}>
                  {fridgeItems.map((item) => (
                    <Chip
                      key={item.id}
                      mode="flat"
                      onClose={() => removeIngredient(item.id)}
                      textStyle={{ color: theme.accentMeals }}>
                      {item.name}
                    </Chip>
                  ))}
                </HStack>
              ) : (
                <Text>Your fridge is empty — search above to add ingredients.</Text>
              )}
            </VStack>

            <VStack space="sm" style={{ alignSelf: "stretch" }}>
              <Text variant="titleMedium">Ready to cook</Text>
              {ready.length > 0 ? (
                ready.map(({ recipe, missingIds }) => (
                  <RecipeCard
                    key={recipe.id}
                    name={recipe.name}
                    prepTimeMin={recipe.prepTimeMin}
                    missingIds={missingIds}
                    totalIngredients={recipe.ingredientIds.length}
                  />
                ))
              ) : (
                <Center><Text>Nothing fully stocked yet...</Text></Center>
              )}
            </VStack>

            <VStack space="sm" style={{ alignSelf: "stretch", marginBottom: Spacing.four }}>
              <Text variant="titleMedium">Almost there</Text>
              {almost.length > 0 ? (
                almost.map(({ recipe, missingIds }) => (
                  <RecipeCard
                    key={recipe.id}
                    name={recipe.name}
                    prepTimeMin={recipe.prepTimeMin}
                    missingIds={missingIds}
                    totalIngredients={recipe.ingredientIds.length}
                  />
                ))
              ) : (
                <Center><Text>You can cook every recipe on the list.</Text></Center>
              )}
            </VStack>
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

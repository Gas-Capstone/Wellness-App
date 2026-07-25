import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Chip, Searchbar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { styles } from "@/constants/styles";
import { Spacing } from "@/constants/theme";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { Ingredient, Recipe, matchRecipes } from "@/lib/meals/meals";
import {
  addFridgeItem,
  fetchFridgeItemIds,
  fetchIngredients,
  fetchRecipes,
  removeFridgeItem,
} from "@/lib/meals/queries";

import { RecipeCard } from "./RecipeCard";

const ERROR_COLOR = "#ff4d4f";

export default function MealsScreen() {
  const theme = useTheme();
  const { user, loading: sessionLoading } = useSession();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  const [fridgeIds, setFridgeIds] = useState<ReadonlySet<number>>(new Set());
  const [fridgeLoading, setFridgeLoading] = useState(false);
  const [mutationError, setMutationError] = useState("");

  const [query, setQuery] = useState("");

  const loadCatalog = () => {
    setCatalogLoading(true);
    setCatalogError("");
    Promise.all([fetchIngredients(), fetchRecipes()])
      .then(([ingredientRows, recipeRows]) => {
        setIngredients(ingredientRows);
        setRecipes(recipeRows);
      })
      .catch((error: Error) => setCatalogError(error.message))
      .finally(() => setCatalogLoading(false));
  };

  useEffect(loadCatalog, []);

  useEffect(() => {
    if (!user) {
      setFridgeIds(new Set());
      return;
    }

    setFridgeLoading(true);
    fetchFridgeItemIds(user.id)
      .then((ids) => setFridgeIds(new Set(ids)))
      .catch((error: Error) => setMutationError(error.message))
      .finally(() => setFridgeLoading(false));
  }, [user]);

  const ingredientName = (id: number) => ingredients.find((i) => i.id === id)?.name ?? "Unknown";

  const handleAddIngredient = async (ingredientId: number) => {
    if (!user) return;
    setMutationError("");
    setFridgeIds((prev) => new Set(prev).add(ingredientId));
    setQuery("");
    try {
      await addFridgeItem(user.id, ingredientId);
    } catch (error) {
      setFridgeIds((prev) => {
        const next = new Set(prev);
        next.delete(ingredientId);
        return next;
      });
      setMutationError(error instanceof Error ? error.message : "Couldn't add that ingredient");
    }
  };

  const handleRemoveIngredient = async (ingredientId: number) => {
    if (!user) return;
    setMutationError("");
    setFridgeIds((prev) => {
      const next = new Set(prev);
      next.delete(ingredientId);
      return next;
    });
    try {
      await removeFridgeItem(user.id, ingredientId);
    } catch (error) {
      setFridgeIds((prev) => new Set(prev).add(ingredientId));
      setMutationError(error instanceof Error ? error.message : "Couldn't remove that ingredient");
    }
  };

  const fridgeItems = ingredients.filter((i) => fridgeIds.has(i.id));

  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return ingredients.filter(
      (i) => !fridgeIds.has(i.id) && i.name.toLowerCase().includes(trimmed),
    );
  }, [query, ingredients, fridgeIds]);

  const { ready, almost } = useMemo(() => matchRecipes(recipes, fridgeIds), [recipes, fridgeIds]);

  if (!sessionLoading && !user) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <Center style={{ flex: 1 }}>
            <Text variant="titleMedium">Log in to build your fridge</Text>
          </Center>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View />
        <ScrollView style={{ alignSelf: "stretch" }} showsVerticalScrollIndicator={false}>
          <VStack style={styles.columnContainer} space="md">
            {sessionLoading || catalogLoading ? (
              <Center style={{ paddingVertical: Spacing.five }}>
                <ActivityIndicator />
              </Center>
            ) : catalogError ? (
              <VStack space="sm" style={{ alignSelf: "stretch" }}>
                <Text style={{ color: ERROR_COLOR }}>{catalogError}</Text>
                <Text onPress={loadCatalog} style={{ color: theme.accentMeals }}>
                  Try again
                </Text>
              </VStack>
            ) : (
              <>
                <Searchbar
                  placeholder="Search ingredients to add"
                  value={query}
                  onChangeText={setQuery}
                  style={{ alignSelf: "stretch" }}
                />

                {searchResults.length > 0 && (
                  <HStack space="sm" style={{ flexWrap: "wrap" }}>
                    {searchResults.map((item) => (
                      <Chip key={item.id} mode="outlined" onPress={() => handleAddIngredient(item.id)}>
                        {item.name}
                      </Chip>
                    ))}
                  </HStack>
                )}

                {mutationError.length > 0 && (
                  <Text style={{ color: ERROR_COLOR }}>{mutationError}</Text>
                )}

                <VStack space="sm" style={{ alignSelf: "stretch" }}>
                  <HStack style={styles.rowBox}>
                    <Text variant="titleMedium">In my fridge</Text>
                    <Text>
                      {fridgeLoading
                        ? "Loading..."
                        : `${fridgeItems.length} ${fridgeItems.length === 1 ? "item" : "items"}`}
                    </Text>
                  </HStack>

                  {fridgeItems.length > 0 ? (
                    <HStack space="sm" style={{ flexWrap: "wrap" }}>
                      {fridgeItems.map((item) => (
                        <Chip
                          key={item.id}
                          mode="flat"
                          onClose={() => handleRemoveIngredient(item.id)}
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
                        missingNames={missingIds.map(ingredientName)}
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
                        missingNames={missingIds.map(ingredientName)}
                        totalIngredients={recipe.ingredientIds.length}
                      />
                    ))
                  ) : (
                    <Center><Text>You can cook every recipe on the list.</Text></Center>
                  )}
                </VStack>
              </>
            )}
          </VStack>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

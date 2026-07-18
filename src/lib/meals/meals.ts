// Placeholder catalog + fridge-matching logic for the meals feature.
// Shapes mirror the Supabase tables (ingredients, recipes, recipe_ingredients,
// fridge_items) so swapping this for real queries later is mechanical: same
// ids, same set comparison over ingredient ids. The "can I cook this?" check
// belongs in a Postgres function callable via supabase.rpc() once the catalog
// is live; matchRecipes below is the client-side stand-in for that function.

export type Ingredient = {
  id: number;
  name: string;
  category: string;
};

export type Recipe = {
  id: number;
  name: string;
  prepTimeMin: number;
  ingredientIds: number[];
};

export type RecipeMatch = {
  recipe: Recipe;
  missingIds: number[];
};

export const INGREDIENTS: Ingredient[] = [
  { id: 1, name: "Chicken", category: "protein" },
  { id: 2, name: "Rice", category: "grains" },
  { id: 3, name: "Bell pepper", category: "produce" },
  { id: 4, name: "Eggs", category: "protein" },
  { id: 5, name: "Onion", category: "produce" },
  { id: 6, name: "Garlic", category: "produce" },
  { id: 7, name: "Soy sauce", category: "pantry" },
  { id: 8, name: "Spinach", category: "produce" },
  { id: 9, name: "Broccoli", category: "produce" },
  { id: 10, name: "Cheese", category: "dairy" },
];

export const RECIPES: Recipe[] = [
  { id: 1, name: "Chicken stir-fry", prepTimeMin: 25, ingredientIds: [1, 2, 3, 5, 6] },
  { id: 2, name: "Veggie fried rice", prepTimeMin: 20, ingredientIds: [2, 3, 4, 5, 7] },
  { id: 3, name: "Spinach omelette", prepTimeMin: 10, ingredientIds: [4, 8, 10] },
  { id: 4, name: "Garlic broccoli bowl", prepTimeMin: 15, ingredientIds: [2, 6, 9] },
];

/** what's "in the fridge" on first load, until fridge_items is wired up */
export const INITIAL_FRIDGE_IDS = [1, 2, 3, 4, 5, 6];

export function ingredientName(id: number): string {
  return INGREDIENTS.find((i) => i.id === id)?.name ?? "Unknown";
}

export function toggleFridgeItem(fridge: ReadonlySet<number>, ingredientId: number): Set<number> {
  const next = new Set(fridge);
  if (next.has(ingredientId)) {
    next.delete(ingredientId);
  } else {
    next.add(ingredientId);
  }
  return next;
}

export function getMissingIngredientIds(recipe: Recipe, fridge: ReadonlySet<number>): number[] {
  return recipe.ingredientIds.filter((id) => !fridge.has(id));
}

export function matchRecipes(recipes: Recipe[], fridge: ReadonlySet<number>) {
  const ready: RecipeMatch[] = [];
  const almost: RecipeMatch[] = [];

  for (const recipe of recipes) {
    const missingIds = getMissingIngredientIds(recipe, fridge);
    (missingIds.length === 0 ? ready : almost).push({ recipe, missingIds });
  }

  return { ready, almost };
}

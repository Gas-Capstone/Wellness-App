// Pure, synchronous fridge-matching logic. Kept free of I/O so it doesn't care
// whether Ingredient/Recipe data came from Supabase or a test fixture — see
// queries.ts for the Supabase reads/writes that feed this.

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

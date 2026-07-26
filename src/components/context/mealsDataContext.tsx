import React, { createContext, useCallback, useContext, useState } from "react";
import { Ingredient, Recipe } from "@/lib/meals/meals";
import {
  addFridgeItem,
  fetchFridgeItemIds,
  fetchIngredients,
  fetchRecipes,
  removeFridgeItem,
} from "@/lib/meals/queries";
import { userContext } from "./userContext";

// Lifted out of MealsScreen's local useState so index.tsx can read the same data.

export type MealsDataContextType = {
  ingredients: Ingredient[];
  recipes: Recipe[];
  catalogLoading: boolean;
  catalogError: string;
  fridgeIds: ReadonlySet<number>;
  fridgeLoading: boolean;
  refreshCatalog: () => void;
  refreshFridge: () => void;
  // Optimistic toggle — updates fridgeIds immediately, rolls back and
  // re-throws on failure so the caller can surface its own error message.
  toggleFridgeItem: (ingredient: Ingredient) => Promise<void>;
};

export const mealsDataContext = createContext<MealsDataContextType | null>(null);

type MealsDataProviderProps = {
  children: React.ReactNode;
};

export const MealsDataProvider = ({ children }: MealsDataProviderProps) => {
  const { user } = useContext(userContext) ?? {};
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [fridgeIds, setFridgeIds] = useState<ReadonlySet<number>>(new Set());
  const [fridgeLoading, setFridgeLoading] = useState(false);

  const refreshCatalog = useCallback(() => {
    setCatalogLoading(true);
    setCatalogError("");
    Promise.all([fetchIngredients(), fetchRecipes()])
      .then(([ingredientRows, recipeRows]) => {
        setIngredients(ingredientRows);
        setRecipes(recipeRows);
      })
      .catch((error: Error) => setCatalogError(error.message))
      .finally(() => setCatalogLoading(false));
  }, []);

  const refreshFridge = useCallback(() => {
    if (!user?.id) {
      setFridgeIds(new Set());
      return;
    }
    setFridgeLoading(true);
    fetchFridgeItemIds(user.id)
      .then((ids) => setFridgeIds(new Set(ids)))
      .catch(() => {
        // MealsScreen surfaces this via its own error state today; keep
        // this context focused on data, not UI error messaging.
      })
      .finally(() => setFridgeLoading(false));
  }, [user?.id]);

  const toggleFridgeItem = useCallback(
    async (ingredient: Ingredient) => {
      if (!user?.id) return;
      const userId = user.id;
      const id = ingredient.id;
      const had = fridgeIds.has(id);

      setFridgeIds((prev) => {
        const next = new Set(prev);
        if (had) next.delete(id);
        else next.add(id);
        return next;
      });

      try {
        if (had) await removeFridgeItem(userId, id);
        else await addFridgeItem(userId, id);
      } catch (error) {
        setFridgeIds((prev) => {
          const next = new Set(prev);
          if (had) next.add(id);
          else next.delete(id);
          return next;
        });
        throw error;
      }
    },
    [user?.id, fridgeIds]
  );

  const contextValue: MealsDataContextType = {
    ingredients,
    recipes,
    catalogLoading,
    catalogError,
    fridgeIds,
    fridgeLoading,
    refreshCatalog,
    refreshFridge,
    toggleFridgeItem,
  };

  return (
    <mealsDataContext.Provider value={contextValue}>
      {children}
    </mealsDataContext.Provider>
  );
};

// Use this instead of `useContext(mealsDataContext)` — throws a clear error if <MealsDataProvider> isn't mounted.
export function useMealsData() {
  const ctx = useContext(mealsDataContext);
  if (!ctx) {
    throw new Error("useMealsData must be used within a <MealsDataProvider>");
  }
  return ctx;
}

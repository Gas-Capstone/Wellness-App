import { Card, Text } from "react-native-paper";

import { useTheme } from "@/hooks/use-theme";
import { ingredientName } from "@/lib/meals/meals";

const READY_COLOR = "#4CAF50";

type RecipeCardProps = {
  name: string;
  prepTimeMin: number;
  missingIds: number[];
  totalIngredients: number;
};

export function RecipeCard({ name, prepTimeMin, missingIds, totalIngredients }: RecipeCardProps) {
  const theme = useTheme();
  const ready = missingIds.length === 0;

  return (
    <Card mode="contained">
      <Card.Title
        title={name}
        subtitle={`${prepTimeMin} min`}
      />
      <Card.Content>
        <Text style={{ color: ready ? READY_COLOR : theme.accentMeals }}>
          {ready
            ? `You have all ${totalIngredients} ingredients`
            : `Need ${missingIds.length}: ${missingIds.map(ingredientName).join(", ")}`}
        </Text>
      </Card.Content>
    </Card>
  );
}

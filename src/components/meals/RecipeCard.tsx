import { Card, Text } from "react-native-paper";

import { useTheme } from "@/hooks/use-theme";

const READY_COLOR = "#4CAF50";

type RecipeCardProps = {
  name: string;
  prepTimeMin: number;
  missingNames: string[];
  totalIngredients: number;
};

export function RecipeCard({ name, prepTimeMin, missingNames, totalIngredients }: RecipeCardProps) {
  const theme = useTheme();
  const ready = missingNames.length === 0;

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
            : `Need ${missingNames.length}: ${missingNames.join(", ")}`}
        </Text>
      </Card.Content>
    </Card>
  );
}

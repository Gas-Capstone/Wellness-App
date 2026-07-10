import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { useTheme } from "@/hooks/use-theme";

export default function MealsScreen() {
  const theme = useTheme();

  return (
    <ScreenPlaceholder
      title="Meals"
      description="Recipes based on what's in your fridge."
      accentColor={theme.accentMeals}
    />
  );
}

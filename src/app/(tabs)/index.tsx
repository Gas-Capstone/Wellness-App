import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { useTheme } from "@/hooks/use-theme";

// Importing from pages
import HabitsScreen from "./habits";
import MealsScreen from "./meals";
import ProfileScreen from "./profile";
import WorkoutsScreen from "./workouts";

void [HabitsScreen, MealsScreen, ProfileScreen, WorkoutsScreen];

export default function HomeScreen() {
  return (
    <ScreenPlaceholder
      title="Home"
      description="If you're seeing this at retrospective, I was hit by a car"
    />
  );
}

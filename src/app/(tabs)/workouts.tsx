import { ScreenPlaceholder } from "@/components/screen-placeholder";
import { useTheme } from "@/hooks/use-theme";

export default function WorkoutsScreen() {
  const theme = useTheme();

  return (
    <ScreenPlaceholder
      title="Workouts"
      description="Recommendations matched to your fitness goal."
      accentColor={theme.accentWorkouts}
    />
  );
}

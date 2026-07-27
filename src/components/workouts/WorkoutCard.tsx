import { Card, Text, Button, Chip } from "react-native-paper";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";
import { styles } from "@/constants/styles";
import type { Workout } from "../context/workoutsDataContext";

// `user` was previously a required-but-unused prop, which caused the "Property 'user' is missing" error.
type workoutCardProps = {
  workout: Workout;
  onPress: () => void;
};

export function WorkoutCard({ workout, onPress }: workoutCardProps) {
  let difficultyDisplay =
    workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1);
  return (
    <Card mode="contained" style={{ width: "100%", alignSelf: "stretch" }}>
      <Card.Title title={<Text variant="titleMedium">{workout.name}</Text>} />
      <Card.Content>
        <HStack style={{ width: "100%", flexWrap: "wrap" }} space="sm">
          <Chip mode="outlined" compact>
            <Text variant="labelSmall">{workout.duration_min} mins</Text>
          </Chip>
          <Chip mode="outlined" compact>
            <Text variant="labelSmall">{difficultyDisplay}</Text>
          </Chip>
          <Chip mode="outlined" compact>
            <Text variant="labelSmall">{workout.target}</Text>
          </Chip>
        </HStack>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onPress}>Start Workout</Button>
      </Card.Actions>
    </Card>
  );
}

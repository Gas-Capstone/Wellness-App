import {
  Button,
  Text,
  Modal,
  Portal,
  Card,
  useTheme,
  Chip,
  DataTable,
  List
} from "react-native-paper";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { styles } from "@/constants/styles";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "../ui/vstack";
import { Center } from "../ui/center";
import type { CompletedWorkout } from "../context/workoutsDataContext";

type completedWorkoutProps = {
  visible: boolean;
  onDismiss: () => void;
  workouts: CompletedWorkout[];
};

export function CompletedWorkoutsModal({
  visible,
  onDismiss,
  workouts,
}: completedWorkoutProps) {
  // todo: build modal to display completed workouts
  // should have an entry for each workout, showing data associated with it
  // maybe use a DataTable?
  // modal will be activated via a FAB for now
  const [time, setTime] = useState(new Date());
  const [tablePage, setTablePage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, setItemsPerPage] = useState(numberOfItemsPerPageList[0]);

  const workoutsByDate = workouts.reduce<Record<string, CompletedWorkout[]>>(
    (acc, workout) => {
      const date = format(new Date(workout.completed_at), "yyyy-MM-dd");
      (acc[date] ??= []).push(workout);
      return acc;
    },
    {},
  );
  const dates = Object.keys(workoutsByDate).sort().reverse(); // newest first

  const from = tablePage * itemsPerPage;
  const to = Math.min((tablePage + 1) * itemsPerPage, workouts.length);
  useEffect(() => {
    setTablePage(0);
  }, [itemsPerPage]);
  const theme = useTheme();

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContent}
      >
        <Card mode="contained" style={styles.modalCard}>
          <Card.Title
            title={<Text variant="titleLarge">Completed Workouts</Text>}
          />

          <Card.Content>
            {/* main modal content here */}
            <List.AccordionGroup>
              {dates.map((date) => (
                <List.Accordion key={date} id={date} title={date} style={{ backgroundColor: theme.colors.surfaceVariant}}>
                  {workoutsByDate[date].map((workout) => (
                    <List.Item key={workout.id} title={workout.name} description={`${workout.duration_min} min(s)`}/>
                  ))}
                </List.Accordion>
              ))}
            </List.AccordionGroup>
          </Card.Content>
        </Card>
      </Modal>
    </>
  );
}

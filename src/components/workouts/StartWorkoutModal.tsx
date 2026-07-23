import { Button, Text, Modal, Portal, Card, useTheme, Chip, DataTable, TextInput } from "react-native-paper"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { styles } from "@/constants/styles"
import { HStack } from "../ui/hstack"
import { VStack } from "../ui/vstack"
import { Center } from "../ui/center"
import { User } from "@supabase/supabase-js";

type startWorkoutProps = {
    visible: boolean;
    workout: Object;
    user: User;
    onDismiss: () => void;
    onStart?: (workout: Object, mins: Number) => void;
}

export function StartWorkoutModal({ visible, workout, user, onDismiss, onStart }: startWorkoutProps) {
    const [ mins, setMins ] = useState(0)
    const theme = useTheme()

    useEffect(() => {
        setMins(workout.duration_min)
    }, [workout])
    return (
        <>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContent}
            >
                <Card mode="contained" style={styles.modalCard}>
                    <Card.Title
                        title={workout.name}
                    />
                    
                    <Card.Content style={styles.stepContainer}>
                        <VStack space="md" style={{ alignSelf: "stretch" }}>
                            <TextInput
                                label="Set minutes"
                                mode="outlined"
                                value={mins?.toString()}
                                onChangeText={(text) => setMins(Number(text))}
                            />
                        </VStack>
                    </Card.Content>
                    <Card.Actions>
                        <Button onPress={onDismiss}>Cancel</Button>
                        <Button mode="contained" onPress={onStart ? () => onStart(workout, mins) : () => null}>Start Workout</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </>
    )
}
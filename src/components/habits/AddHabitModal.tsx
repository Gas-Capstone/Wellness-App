import { Button, Modal, Text, useTheme, Portal, Card, TextInput, Chip } from "react-native-paper"
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { format } from "date-fns"
import { styles } from "@/constants/styles"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Center } from "@/components/ui/center"
import { Habit } from "@/lib/habits/habits"

type AddHabitModalProps = {
    visible: boolean,
    onDismiss: () => void;
    onSave?: (habit: {title: string; time: string }) => void;
}

export function AddHabitModal({ visible, onDismiss, onSave }: AddHabitModalProps) {
    const [ time, setTime ] = useState(new Date())
    const [ showPicker, setShowPicker ] = useState(false)
    const [ habitTitle, setHabitTitle ] = useState("")

    
    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: time,
            onValueChange: (event, selectedDate) => setTime(selectedDate),
            mode: currentMode,
            is24Hour: false,
        })
    }

    const showTimepicker = () => {
        showMode('time');
    }

    const handleSave = () => {
        if (!habitTitle) return

        onSave?.({
            title: habitTitle,
            time: format(time, "h:mm aa")
        })

        setHabitTitle("")
        setTime(new Date())
        onDismiss()
    }

    return (
        <>
            <Portal>
                <Modal
                   visible={visible}
                   onDismiss={onDismiss}
                   contentContainerStyle={styles.modalContent}
                >
                    <Card mode="contained" style={styles.modalCard}>
                        <Card.Title
                            title={<Text variant="titleLarge">Add Habit</Text>}
                        />
                        <Card.Content style={styles.stepContainer}>
                            {/* main modal content */}
                            <VStack space="md" style={{ alignSelf: "stretch" }}>
                                <TextInput
                                    label="Habit Title"
                                    mode="outlined"
                                    value={habitTitle}
                                    onChangeText={(text) => setHabitTitle(text)}
                                />
                                <Button onPress={showTimepicker}>Pick time of day</Button>
                                <Center>
                                    <Text>Selected: {format(time, 'h:mm aa')}</Text>
                                </Center>
                            </VStack>

                        </Card.Content>

                        {/* row of components at bottom */}
                        <Card.Actions>
                            <HStack style={styles.rowBox}>
                                <Button onPress={onDismiss}>Cancel</Button>
                                <Button mode="contained" onPress={handleSave}>Add</Button>
                            </HStack>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>
        </>
    )
}
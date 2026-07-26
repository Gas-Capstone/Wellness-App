import { Button, Modal, Text, useTheme, Card, TextInput, Chip } from "react-native-paper"
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { format } from "date-fns"
import { styles } from "@/constants/styles"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { Center } from "@/components/ui/center"
import { Habit, Weekday } from "@/lib/habits/habits"

type AddHabitModalProps = {
    visible: boolean,
    onDismiss: () => void;
    onSave?: (habit: {title: string; time: string; weekdays: Weekday[] }) => void;
}

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const FIRST_ROW_WEEKDAYS = ["Su", "Mo", "Tu", "We"]
const SECOND_ROW_WEEKDAYS = ["Th", "Fr", "Sa"]

export function AddHabitModal({ visible, onDismiss, onSave }: AddHabitModalProps) {
    const [ time, setTime ] = useState(new Date())
    const [ showPicker, setShowPicker ] = useState(false)
    const [ habitTitle, setHabitTitle ] = useState("")
    const [ weekdays, setWeekdays ] = useState<Weekday[]>([])
    const theme = useTheme()

    const renderWeekdayChip = (label: string, weekdayIndex: Weekday) => {
        
        return (
            <Chip
                key={label}
                selected={weekdays.includes(weekdayIndex)}
                onPress={() => toggleWeekday(weekdayIndex)}
                style={{ backgroundColor: theme.colors.background }}
            >
                {label}
            </Chip>
        )
    }

    const toggleWeekday = (weekday: Weekday) => {
        setWeekdays((currentWeekdays) => {
            const isSelected = currentWeekdays.includes(weekday)
            if (isSelected) {
                return currentWeekdays.filter((day) => day !== weekday)
            }
            return [...currentWeekdays, weekday]
        })
    }
    
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
            time: format(time, "h:mm aa"),
            weekdays
        })

        setHabitTitle("")
        setTime(new Date())
        onDismiss()
    }

    return (
        <>
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
                            <Button compact onPress={showTimepicker}>Pick time of day</Button>
                            <Center>
                                <Text>Selected: {format(time, 'h:mm aa')}</Text>
                            </Center>
                            <VStack space="sm" style={{ alignSelf: "stretch" }}>
                                <HStack space="sm" style={{ justifyContent: "center"}}>
                                    {WEEKDAY_LABELS.slice(0, 4).map((label, index) =>
                                        renderWeekdayChip(label, index as Weekday)
                                    )}
                                </HStack>
                                <HStack space="sm" style={{ justifyContent: "center" }}>
                                    {WEEKDAY_LABELS.slice(4).map((label, index) =>
                                        renderWeekdayChip(label, (index + 4) as Weekday)
                                    )}
                                </HStack>
                            </VStack>
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
        </>
    )
}
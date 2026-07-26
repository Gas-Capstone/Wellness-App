import { Modal, Text, Button, Card } from "react-native-paper"
import { useState } from "react"
import { styles } from "@/constants/styles"
import { VStack } from "@/components/ui/vstack"
import { HStack } from "@/components/ui/hstack"

type confirmStopModalProps = {
    visible: boolean,
    elapsedTime: number,
    onDismiss: () => void
    onConfirm: () => void
}

export function ConfirmStopModal({ visible, elapsedTime, onDismiss, onConfirm }: confirmStopModalProps) {
    
    
    return (
        <>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={styles.modalContent}
            >
                <Card mode="contained" style={styles.modalCard}>
                    <Card.Title
                        title={<Text variant="titleLarge">Stop workout?</Text>}
                    />
                    <Card.Content style={styles.stepContainer}>
                        <VStack space="md" style={{ alignSelf: "stretch" }}>
                            <Text variant="bodyMedium">If you stop the workout early, a duration of {elapsedTime} {elapsedTime === 1 ? "minute" : "minutes"} will be logged.</Text>
                        </VStack>
                    </Card.Content>
                    <Card.Actions>
                        <HStack style={styles.rowBox}>
                            <Button onPress={onDismiss}>Cancel</Button>
                            <Button mode="contained" onPress={onConfirm}>Stop Workout</Button>
                        </HStack>
                    </Card.Actions>
                </Card>
            </Modal>
        </>
    )
}
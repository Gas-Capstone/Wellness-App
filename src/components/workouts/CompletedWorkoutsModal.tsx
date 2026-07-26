import { Button, Text, Modal, Portal, Card, useTheme, Chip, DataTable } from "react-native-paper"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { styles } from "@/constants/styles"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "../ui/vstack"
import { Center } from "../ui/center"
import { User } from "@supabase/supabase-js";

type completedWorkoutProps = {
    visible: boolean;
    onDismiss: () => void;
    workouts: Object[];
}

export function CompletedWorkoutsModal({ visible, onDismiss, workouts }: completedWorkoutProps){
    // todo: build modal to display completed workouts
    // should have an entry for each workout, showing data associated with it
    // maybe use a DataTable?
    // modal will be activated via a FAB for now
    const [ time, setTime ] = useState(new Date())
    const [ tablePage, setTablePage ] = useState(0)
    const [numberOfItemsPerPageList] = useState([2,3,4])
    const [ itemsPerPage, setItemsPerPage ] = useState(numberOfItemsPerPageList[0])

    const from = tablePage * itemsPerPage
    const to = Math.min((tablePage + 1) * itemsPerPage, workouts.length)
    useEffect(() =>{
        setTablePage(0)
    }, [itemsPerPage])
    const theme = useTheme()

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
                        <DataTable style={{width: "100%"}}>
                            <DataTable.Header>
                                <DataTable.Title style={{flex: 4}}>Workout</DataTable.Title>
                                <DataTable.Title style={{flex: 1}}>Mins</DataTable.Title>
                                <DataTable.Title style={{flex: 1}}>Date</DataTable.Title>
                            </DataTable.Header>

                            {workouts.slice(from, to).map((workout) => (
                                <DataTable.Row key={workout.id}>
                                    <DataTable.Cell style={{flex: 4}}>{workout.name}</DataTable.Cell>
                                    <DataTable.Cell style={{flex: 1}}>{workout.duration_min}</DataTable.Cell>
                                    <DataTable.Cell style={{flex: 1}}>{format(new Date(workout.completed_at), "MMM d")}</DataTable.Cell>
                                </DataTable.Row>
                            ))}

                            <DataTable.Pagination
                                page={tablePage}
                                numberOfPages={Math.ceil(workouts.length / itemsPerPage)}
                                onPageChange={(page) => setTablePage(page)}
                                label={`${from + 1}-${to} of ${workouts.length}`}
                                numberOfItemsPerPageList={numberOfItemsPerPageList}
                                numberOfItemsPerPage={itemsPerPage}
                                onItemsPerPageChange={setItemsPerPage}
                                showFastPaginationControls
                                selectPageDropdownLabel={"Rows per page"}
                            />
                        </DataTable>
                    </Card.Content>

                </Card>

            </Modal>

        </>
    )

}
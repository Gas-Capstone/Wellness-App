import { Text, Chip } from "react-native-paper"


export function WorkoutFilterChip({ tag, isSelected, onSelect }){
    return (
        <Chip 
            compact
            selected={isSelected}
            onPress={() => onSelect(isSelected ? "all" : tag)}
            >{tag.charAt(0).toUpperCase() + tag.slice(1)}
        </Chip>
    )
}
import { startOfWeek, addDays, format, isToday } from "date-fns"

export type WeekDay = {
    dateObject: Date;
    fullDate: string;
    dayOfWeek: string;
    dayNumber: string;
    label: string;
    isToday: boolean;
}

export function getWeekArray() {
    // using Date() and date-fns to get current week, returning array of objects
    const sunday = startOfWeek(new Date())

    const weekArray = Array.from({length: 7}, (_, cur) => {
        const date = addDays(sunday, cur)
        /* return format:
            date: Date() object
            fullDate: "yyyy-mm-dd"
            dayOfWeek: string
            dayNumber: string
            label: "Su"/"Mo"/"Tu"/etc...
            isToday: boolean
        */
        return {
            dateObject: date,
            fullDate: format(date, "yyyy-MM-dd"),
            dayOfWeek: format(date, "EEEE"),
            dayNumber: format(date, "d"),
            label: format(date, "EEEEEE"),
            isToday: isToday(date)
        }
    })

    return weekArray
}

export function getTodaysDate() {
    const date = new Date()
    return format(date, "yyyy-MM-dd")
}
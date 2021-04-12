import {BaseThunkType, InferActionsTypes} from "./redux-store";

const initialState = {
    holidays: [
        {type: "success", content: "День рождение Ивана", day: 1, month: 3},
        {type: "success", content: "День рождение Ивана", day: 2, month: 3},
        {type: "success", content: "День рождение Ивана", day: 3, month: 3},
        {type: "success", content: "День рождение Ивана", day: 11, month:3},
        {type: "success", content: "День рождение Ивана", day: 13, month:3},
        {type: "success", content: "День рождение Ивана", day: 15, month:3},
        {type: "success", content: "День рождение Ивана", day: 21, month:3},
    ],
    selectedDay: {
        holidays: [{type: "success", content: "День рождение Ивана"}],
        notes: [{type: "warning", content: "Новая заметка"}]
    }
}

export const calendarReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/calendar/SET-HOLIDAYS":
            return {
                ...state,
                holidays: action.holidays,
            }
        default:
            return state
    }
}

export const actionsCalendar = {
    setHolidays: (holidays: Array<any>) => ({
        type: "calendar/calendar/SET-HOLIDAYS",
        holidays
    } as const),
    addHoliday: (holiday: any) => ({
        type: "calendar/calendar/ADD-HOLIDAY",
        holiday
    } as const),
}

export const getDataDay = (day: string): ThunkType =>
    async (dispatch) => {
    console.log(day)
}

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsCalendar>
type ThunkType = BaseThunkType<ActionsType>
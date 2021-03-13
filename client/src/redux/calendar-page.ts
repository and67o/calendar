import {BaseThunkType, InferActionsTypes} from "./redux-store";

const initialState = {
    holidays: [
        {type: "success", content: "День рождение Ивана", day: 2, month: 2},
        {type: "success", content: "День рождение Ивана", day: 1, month: 2},
        {type: "success", content: "День рождение Ивана", day: 3, month: 2},
    ]
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
}

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsCalendar>
type ThunkType = BaseThunkType<ActionsType>
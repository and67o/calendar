import {AppStateType} from './redux-store'

export const getHolidays = (state: AppStateType) => {
    return state.calendar.holidays
}



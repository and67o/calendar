import {AppStateType} from './redux-store'

export const getIsInitialize = (state: AppStateType) => {
    return state.app.isInitialize
}

export const getTestMessage = (state: AppStateType) => {
    return state.app.test
}

import {AppStateType} from './redux-store'

export const getDataUser = (state: AppStateType) => {
    return {
        auth: state.auth.auth,
        login: state.auth.login,
    }
}
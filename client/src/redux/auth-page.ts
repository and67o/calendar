import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {authAPI} from "../api/auth-api";

const initialState = {
    login: null as String | null
}

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/auth/SET-AUTH":
            return {
                ...state,
                login: action.login,
            }
        default:
            return state
    }
}

export const actionsAuth = {
    setLogin: (login: string) => ({
        type: "calendar/auth/SET-AUTH",
        login
    } as const),
}

export const register = (login: string | null, password: string | null): ThunkType =>
    async (dispatch) => {
        await authAPI.register(login, password)
            .then((res:any) => {
                const login = res.message
                dispatch(actionsAuth.setLogin(login))
            })
    }

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsAuth>
type ThunkType = BaseThunkType<ActionsType>
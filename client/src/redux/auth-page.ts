import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {actionsApp, getCheckTestServer} from "./app";
import {authAPI} from "../api/auth-api";

const initialState = {
    login: null as String | null,
    auth: null as boolean | null
}

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/auth/SET-AUTH":
            return {
                ...state,
                login: action.login,
                auth: true
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

export const checkAuth = (): ThunkType =>
    async (dispatch) => {
        await dispatch(getCheckTestServer())
            .then(() => {
                console.log("Сервер прошел проверку можно начинать проверку авторизации")

            })
            .catch(() => console.log("Сервер не прошел проверку"))
        const auth = authAPI.auth()
            .then(()=>console.log("авторизован"))
            .catch(()=>console.log("не авторизован"))
    }

export const register = (login: string | null, password: string | null): ThunkType =>
    async (dispatch) => {
        dispatch(actionsAuth.setLogin(login))
    }

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsAuth>
type ThunkType = BaseThunkType<ActionsType>
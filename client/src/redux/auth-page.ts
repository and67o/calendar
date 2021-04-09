import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {actionsApp, getCheckTestServer} from "./app";
import {authAPI} from "../api/auth-api";
import jwt_decode from "jwt-decode"
import {userAPI} from "../api/user-api";

const initialState = {
    login: null as String | null,
    auth: null as boolean | null,
    isInitialize: false as boolean | null,
}

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/auth/SET-AUTH":
            return {
                ...state,
                login: action.login,
                auth: true
            }
        case "calendar/auth/SET-INIT":
            return {
                ...state,
                isInitialize: action.init,
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
    setInitialize: (init: boolean) => ({
        type: "calendar/auth/SET-INIT",
        init
    } as const),
}

export const checkAuth = (): ThunkType =>
    async (dispatch) => {
        await dispatch(getCheckTestServer())
            .then(() => {
                console.log("Сервер прошел проверку можно начинать проверку авторизации")
            })
            .catch(() => console.log("Сервер не прошел проверку"))
    }

export const registerThunk = (email: string | null, password: string | null, firstname: string | null, lastname: string | null): ThunkType =>
    async (dispatch) => {
        dispatch(actionsAuth.setInitialize(true))
        const data = JSON.stringify({
            email: email,
            password: password,
            firstname: firstname,
            lastname: lastname
        })
        const res = authAPI.register(data)
            .then(res => {
                debugger
                dispatch(actionsAuth.setInitialize(false))
            })
            .catch()

    }

export const getUserDataThunk = (id: number): ThunkType =>
    async (dispatch) => {
        await userAPI.auth(id)
            .then((res: any) => {
                debugger
                const data = res.Data
                dispatch(actionsAuth.setLogin(data.firstname))
            })
            .catch()

    }


export const loginThunk = (email: string | null, password: string | null): ThunkType =>
    async (dispatch) => {
        dispatch(actionsAuth.setInitialize(true))
        const data = JSON.stringify({
            email: email,
            password: password
        })
        const res = authAPI.login(data)
            .then(res => {
                debugger
                const token = res.Data.AccessToken
                const decoded: any = jwt_decode(token)
                const id: number = decoded.id
                dispatch(getUserDataThunk(id))
                localStorage.token = token
                dispatch(actionsAuth.setInitialize(false))
            })
            .catch()

    }

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsAuth>
type ThunkType = BaseThunkType<ActionsType>
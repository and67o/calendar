import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {getCheckTestServer} from "./app";
import {authAPI} from "../api/auth-api";
import jwt_decode from "jwt-decode";
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
                auth: action.auth
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
    setLogin: (login: string, auth: boolean) => ({
        type: "calendar/auth/SET-AUTH",
        login,
        auth
    } as const),
    setInitialize: (init: boolean) => ({
        type: "calendar/auth/SET-INIT",
        init
    } as const),
}

export const checkAuth = (): ThunkType =>
    async (dispatch) => {
        dispatch(actionsAuth.setInitialize(true))
        await dispatch(getCheckTestServer())
            .then(() => {
                console.log("Сервер прошел проверку можно начинать проверку авторизации")
                if (!!localStorage.token) {
                    const decode: any = jwt_decode(localStorage.token)
                    const id = decode.id
                    dispatch(getUserDataThunk(id))
                } else {
                    console.log("вы не авторизованы")
                    dispatch(actionsAuth.setInitialize(false))
                }
            })
            .catch(() => {
                console.log("Сервер не прошел проверку")
                dispatch(actionsAuth.setInitialize(false))
            })
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
                dispatch(loginThunk(email, password))
            })
            .catch()

    }

export const getUserDataThunk = (id: number): ThunkType =>
    async (dispatch) => {
        await userAPI.auth(id)
            .then((res: any) => {
                const data = res.Data
                dispatch(actionsAuth.setLogin(data.firstname, true))
            })
            .catch(() => console.log("Сбой сервера"))

    }

export const loginThunk = (email: string | null, password: string | null): ThunkType =>
    async (dispatch) => {
        dispatch(actionsAuth.setInitialize(true))
        const data = JSON.stringify({
            email: email,
            password: password
        })
        authAPI.login(data)
            .then((res) => {
                const token = res.Data.AccessToken
                const decoded: any = jwt_decode(token)
                const id: number = decoded.id
                dispatch(getUserDataThunk(id))
                localStorage.token = token
                dispatch(actionsAuth.setInitialize(false))
            })
            .catch(err => {
                console.log(`Ошибка авторизации. Ошибка с сервера: '${err}' `)
                dispatch(actionsAuth.setInitialize(false))
            })
    }

export const logoutThunk = (): ThunkType =>
    async (dispatch) => {
        localStorage.token = null
        dispatch(actionsAuth.setLogin(null, false))
        dispatch(actionsAuth.setInitialize(false))
    }

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsAuth>
type ThunkType = BaseThunkType<ActionsType>
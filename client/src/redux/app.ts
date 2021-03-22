import {BaseThunkType, InferActionsTypes} from './redux-store'
import {testAPI} from "../api/test-api";

const initialState = {
    isInitialize: false,
    test: "",
    checkServer: false
}

export const appReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/app/SET-INITIALIZE":
            return {
                ...state,
                isInitialize: action.isInitialize,
            }
        case "calendar/app/SET-TEST-MESSAGE":
            return {
                ...state,
                test: action.test,
            }
        case "calendar/app/SET-CHECK-SERVER":
            return {
                ...state,
                checkServer: action.checkServer,
            }
        default:
            return state
    }
}

export const actionsApp = {
    setInitialize: (init: boolean) => ({
        type: "calendar/app/SET-INITIALIZE",
        isInitialize: init
    } as const),
    setTestMessage: (test: string) => ({
        type: "calendar/app/SET-TEST-MESSAGE",
        test: test
    } as const),
    setCheckServer: (checkServer: boolean) => ({
        type: "calendar/app/SET-CHECK-SERVER",
        checkServer: checkServer
    } as const)
}

export const getCheckTestServer = (): ThunkType =>
    async (dispatch) => {
    dispatch(actionsApp.setInitialize(false))
        await testAPI.check()
            .then((res:any) => {
                const message = res.message
                dispatch(actionsApp.setTestMessage(message))
                dispatch(actionsApp.setCheckServer(true))
                dispatch(actionsApp.setInitialize(true))
            })
            .catch((error) => {
                dispatch(actionsApp.setTestMessage("Ошибка сервера"))
                dispatch(actionsApp.setCheckServer(false))
                dispatch(actionsApp.setInitialize(true))
            })

    }


type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsApp>
type ThunkType = BaseThunkType<ActionsType>
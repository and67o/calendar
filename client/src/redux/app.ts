import {BaseThunkType, InferActionsTypes} from './redux-store'
import {testAPI} from "../api/test-api";

const initialState = {
    isInitialize: false,
    test: ""
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
    } as const)
}

export const getCheckTestServer = (): ThunkType =>
    async (dispatch) => {
        await testAPI.check()
            .then((res:any) => {
                const message = res.message
                dispatch(actionsApp.setTestMessage(message))
            })
    }


type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsApp>
type ThunkType = BaseThunkType<ActionsType>
import {BaseThunkType, InferActionsTypes} from "./redux-store";
import {userAPI} from "../api/user-api";
import jwt_decode from "jwt-decode";

const initialState = {
    users: <any>[]
}

export const usersReducer = (state = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case "calendar/users/SET-USERS":
            return {
                ...state,
                users: action.users
            }
        default:
            return state
    }
}

export const actionsUsers = {
    setUsers: (users: []) => ({
        type: "calendar/users/SET-USERS",
        users,
    } as const),
}

export const getUsersThunk = (): ThunkType =>
    async (dispatch) => {
        await userAPI.users()
            .then((res) => {
                const decode: any = jwt_decode(localStorage.token)
                const myId = decode.id
                const users = res.filter((user: any) => user.id !== myId)
                dispatch(actionsUsers.setUsers(users))
            })
            .catch()
    }

type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof actionsUsers>
type ThunkType = BaseThunkType<ActionsType>
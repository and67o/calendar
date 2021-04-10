import {Action, applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {appReducer} from "./app";
import thunkMiddleware, {ThunkAction} from 'redux-thunk';
import {authReducer} from "./auth-page";
import {calendarReducer} from "./calendar-page";
import {usersReducer} from "./users-page";

const reducers = combineReducers({
    app: appReducer,
    auth: authReducer,
    calendar: calendarReducer,
    users: usersReducer
});

type RootReducerType = typeof reducers
export type AppStateType = ReturnType<RootReducerType>

export type InferActionsTypes<T> = T extends {[key: string]: (...args: any[]) => infer U } ? U : never;
export type BaseThunkType<A extends Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers(applyMiddleware(thunkMiddleware)));
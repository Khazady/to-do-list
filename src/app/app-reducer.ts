import {Dispatch} from "redux";
import {authAPI} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features (pages)/Login/auth-reducer";

const initialState: InitialStateType = {
    status: "idle",
    error: null,
    isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized }
        default:
            return state
    }
}
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

// thunks
//при монтировании апп запрашиваем залогинен ли пользователь
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
            handleServerAppError(res, dispatch)
        }
        //после получения ответа инициализируем приложение
        dispatch(setAppInitializedAC(true))
    }).catch(error => {
        handleServerNetworkError(error, dispatch)
        //после получения ответа инициализируем приложение
        dispatch(setAppInitializedAC(true))
    })
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: string | null
    //проверили юзера, получили настройки
    isInitialized: boolean
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
type ActionsType =
  | SetAppStatusActionType
  | SetAppErrorActionType
  | SetAppInitializedActionType
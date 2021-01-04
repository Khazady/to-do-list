import {Dispatch} from 'redux'
import {authAPI} from '../api/api'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'
import {setIsLoggedInAC} from '../features (pages)/Login/auth-reducer'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

const initialState: InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: 'idle',
    error: null,
    //проверили юзера, получили настройки
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer
//actions
//поищи ACs в slice.actions
export const {setAppStatusAC, setAppErrorAC, setAppInitializedAC} = slice.actions

// thunks
//при монтировании апп запрашиваем залогинен ли пользователь
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {
            handleServerAppError(res, dispatch)
        }
        //после получения ответа инициализируем приложение
        dispatch(setAppInitializedAC({isInitialized: true}))
    }).catch(error => {
        handleServerNetworkError(error, dispatch)
        //после получения ответа инициализируем приложение
        dispatch(setAppInitializedAC({isInitialized: true}))
    })
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppInitializedActionType = ReturnType<typeof setAppInitializedAC>
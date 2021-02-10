import {authAPI} from '../api/api'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'
import {setIsLoggedInAC} from '../features (pages)/Login/auth-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'


// thunks
//при монтировании апп запрашиваем залогинен ли пользователь
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, {dispatch}) => {
    //достали только dispatch из всего thunkAPI
    const data = await authAPI.me()
    try {
        if (data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {
            handleServerAppError(data, dispatch)
        }
        //после получения ответа инициализируем приложение
        // dispatch(setAppInitializedAC({isInitialized: true}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        //после получения ответа инициализируем приложение
        // dispatch(setAppInitializedAC({isInitialized: true}))
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        // происходит ли сейчас взаимодействие с сервером
        status: 'idle',
        error: null,
        //проверили юзера, получили настройки
        isInitialized: false
    } as InitialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
    },
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})


//exports from slice
export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions


// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
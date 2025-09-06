import {authAPI} from '../api/api'
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils'
import {setIsLoggedInAC} from '../features (pages)/Login/auth-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'


// thunks
// when the app mounts, request whether the user is logged in
export const initializeAppTC = createAsyncThunk('app/initializeApp', async (arg, {dispatch}) => {
    // extracted only dispatch from the whole thunkAPI
    const data = await authAPI.me()
    try {
        if (data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
        } else {
            handleServerAppError(data, dispatch)
        }
        // after getting the response, initialize the app
        // dispatch(setAppInitializedAC({isInitialized: true}))
    } catch (error) {
        handleServerNetworkError(error, dispatch)
        // after getting the response, initialize the app
        // dispatch(setAppInitializedAC({isInitialized: true}))
    }
})

const slice = createSlice({
    name: 'app',
    initialState: {
        // whether there is an ongoing interaction with the server
        status: 'idle',
        error: null,
        // user checked, settings retrieved
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

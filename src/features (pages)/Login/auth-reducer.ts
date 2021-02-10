import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldErrorType, LoginParamsType} from '../../api/api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {AxiosError} from 'axios'

// thunks
export const loginTC = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (loginData, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const data = await authAPI.login(loginData)
    try {
        if (data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            //thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}))
            return
        } else {
            handleServerAppError(data, thunkAPI.dispatch)
            //реджекнуть промис с ошибкой из сервера
            return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
        }
    } catch (err) {
        const error: AxiosError = err
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const data = await authAPI.logout()
    try {
        if (data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            //логаут произошел, резолвим санку без данных, просто меняем в AC тру на фолс
            //thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: false}))
            return
        } else {
            handleServerAppError(data, thunkAPI.dispatch)
            //реджекаем, чтобы не попасть в fulfilled и не изменить isLoggedIn
            return thunkAPI.rejectWithValue(null)
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

const slice = createSlice({
    //for naming string ducks constants
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    //small reducers for each action
    reducers: {
        //приходит черновик state
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})


//exports from slice
export const authReducer = slice.reducer
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

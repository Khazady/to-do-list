import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from '../../api/api'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    //for naming string ducks constants
    name: 'auth',
    initialState: initialState,
    //small reducers for each action
    reducers: {
        //приходит черновик state
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})


export const authReducer = slice.reducer

//actions
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC

// thunks
export const loginTC = (loginData: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(loginData)
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(setIsLoggedInAC({isLoggedIn: true}))
              dispatch(setAppStatusAC({status: 'succeeded'}))
          } else {
              handleServerAppError(res, dispatch)
          }
      }).catch(error => handleServerNetworkError(error, dispatch))
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(setIsLoggedInAC({isLoggedIn: false}))
              dispatch(setAppStatusAC({status: 'succeeded'}))
          } else {
              handleServerAppError(res, dispatch)
          }
      })
      .catch((error) => {
          handleServerNetworkError(error, dispatch)
      })
}

import {Dispatch} from 'redux'
import {
    SetAppErrorActionType,
    SetAppInitializedActionType,
    setAppStatusAC,
    SetAppStatusActionType
} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (loginData: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(loginData)
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(setIsLoggedInAC(true))
              dispatch(setAppStatusAC('succeeded'))
          } else {
              handleServerAppError(res, dispatch)
          }
      }).catch(error => handleServerNetworkError(error, dispatch))
}
export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
      .then(res => {
          if (res.resultCode === 0) {
              dispatch(setIsLoggedInAC(false))
              dispatch(setAppStatusAC('succeeded'))
          } else {
              handleServerAppError(res, dispatch)
          }
      })
      .catch((error) => {
          handleServerNetworkError(error, dispatch)
      })
}


// types
type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | SetAppStatusActionType
  | SetAppErrorActionType
  | SetAppInitializedActionType

export type InitialStateType = typeof initialState


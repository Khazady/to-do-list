import {authReducer, InitialStateType, setIsLoggedInAC} from "./auth-reducer";

let startState: InitialStateType;

beforeEach(() => {
    startState = { isLoggedIn: false }})

test('user should be logged in', () => {

    const action = setIsLoggedInAC(true);

    const endState = authReducer(startState, action)

    expect(endState.isLoggedIn).toBe(true);
});
import {authReducer, setIsLoggedInAC} from './auth-reducer'

let startState: {isLoggedIn: boolean}

beforeEach(() => {
    startState = { isLoggedIn: false }})

test('user should be logged in', () => {

    const action = setIsLoggedInAC({isLoggedIn: true});

    const endState = authReducer(startState, action)

    expect(endState.isLoggedIn).toBe(true);
});
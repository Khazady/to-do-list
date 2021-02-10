import {appReducer, initializeAppTC, InitialStateType, setAppErrorAC, setAppStatusAC} from './app-reducer'

let startState: InitialStateType;

beforeEach(() => {
    startState = { status: 'idle', error: null, isInitialized: false }})

test('status should be changed to succeeded', () => {

    const action = setAppStatusAC({status: 'succeeded'});

    const endState = appReducer(startState, action)

    expect(endState.status).toBe('succeeded');
});

test('error message should be changed', () => {

    const action = setAppErrorAC({error: 'Some error occurred'});

    const endState = appReducer(startState, action)

    expect(endState.error).toBe('Some error occurred');
});
test('app should be initialized', () => {

    const action = initializeAppTC.fulfilled({isInitialized: true}, 'requestedId');

    const endState = appReducer(startState, action)

    expect(endState.isInitialized).toBe(true);
});
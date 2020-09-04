type StateType = {
    age: number
    childrenCount: number
    name: string
}
type ActionType = {
    type: string
    [key: string]: any
}

// меня вызовут и дадут мне стейт (почти всегда объект)
// и инструкцию (action, тоже объект)
// согласно прописаному type в этом action (инструкции) я поменяю state / возвращает тоже стейттайп
export const userReducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'INCREMENT-AGE':
            let newState = {...state};
            newState.age +=1;
            return newState;
        case 'INCREMENT-CHILDREN-COUNT':
            //тоже самое без промежуточной переменной
            return {
                ...state,
                childrenCount: state.childrenCount + 1
            };
        case 'CHANGE-NAME':
            return {
                ...state,
                name: state.name = action.newName
            };
        default:
            throw new Error("I don't understand this type")
    }
}
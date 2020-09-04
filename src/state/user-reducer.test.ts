import {userReducer} from './user-reducer';

test('user reducer should increment only age', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    //стартовые данные
    const endState = userReducer(startState, { type: 'INCREMENT-AGE' })
    //засовываем в редьюсер стейт и инструкцию
    expect(endState.age).toBe(21);
    //ожидаем, что в финальном стейте 21 в ейдж
    expect(endState.childrenCount).toBe(2);
    //и что мы не задели другое свойство
});

test('user reducer should increment only childrenCount', () => {
    const startState = { age: 20, childrenCount: 2, name: 'Dimych' };
    const endState = userReducer(startState, {type: "INCREMENT-CHILDREN-COUNT"})
    expect(endState.age).toBe(20);
    expect(endState.childrenCount).toBe(3);
});

test('user reducer should change name of user', () => {
    const startState = { name: 'Dimych', age: 20, childrenCount: 2 };
    const newName = 'Viktor';
    const endState = userReducer(startState, { type: 'CHANGE-NAME', newName: newName })

    expect(endState.name).toBe(newName);
});


import React from 'react';
import {action} from '@storybook/addon-actions';
import {ReduxStoreProviderDecorator} from "../../../../stories/decorators/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../../../../api/api";
import {Task} from "./Task";

export default {
    title: 'Task Stories',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
};

//action это консоль в StoryBook
const callback = action("Button inside form was clicked");

//AddItemForm в пропсах ждёт колбек, поэтому передаем туда action (фейковый коллбек)
//я сделал компоненты неконтролируемыми, поэтому здесь нету коллбэков (возможно надо исправить)
export const BaseExample = () => {
    return (
      <>
          <Task task={{
              id: "1",
              status: TaskStatuses.Completed,
              title: "CSS",
              todoListId: "todolistId1",
              priority: TaskPriorities.High,
              description: "",
              startDate: "",
              deadline: "",
              order: 1,
              addedDate: ""
          }}
                filter={"active"}
                todolistId={"todolistId1"}/>
          <Task task={{
              id: "2",
              status: TaskStatuses.New,
              title: "JS",
              todoListId: "todolistId1",
              priority: TaskPriorities.High,
              description: "",
              startDate: "",
              deadline: "",
              order: 1,
              addedDate: ""
          }}
                filter={"active"}
                todolistId={"todolistId2"}/>
      </>
    )
}

export const DisabledExample = () => {
    return (
      <Task task={{
          id: "1",
          status: TaskStatuses.Completed,
          title: "CSS",
          todoListId: "todolistId1",
          priority: TaskPriorities.High,
          description: "",
          startDate: "",
          deadline: "",
          order: 1,
          addedDate: ""
      }}
            filter={"active"}
            todolistId={"todolistId1"}
            disabled/>
    )
}
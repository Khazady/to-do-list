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

// action is the StoryBook console
const callback = action("Button inside form was clicked");

// AddItemForm expects a callback in props, so we pass action (a fake callback)
// I made the components uncontrolled, so there are no callbacks here (might need to fix)
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
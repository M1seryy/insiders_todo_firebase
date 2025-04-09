/** @format */

import React, { useState } from "react";
import { Task } from "../types/types";

// interface Task {
//   id: string;
//   title: string;
//   completed: boolean;
//   description?: string;
// }

interface TodoItemsProps {
  tasks: Task[];
  onSelect: (id: string) => void;
}

const TodoItems: React.FC<TodoItemsProps> = ({ tasks, onSelect }) => {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          onClick={() => onSelect(task.id)}
          key={task.id}
          className={`p-3 border rounded-lg flex items-start ${
            task.completed
              ? "bg-gray-50 border-gray-200"
              : "bg-white border-gray-300"
          }`}
        >
          <input
            type="checkbox"
            checked={task.completed}
            // onChange={() => onToggle(task.id)}
            className="mt-1 h-4 w-4"
          />

          <div className="ml-2 flex-1">
            <p
              className={`${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
          </div>

          <button
            // onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            ×
          </button>
        </div>
      ))}

      {tasks.length === 0 && (
        <p className="text-center text-gray-500 py-4">Немає завдань</p>
      )}
    </div>
  );
};

export default TodoItems;

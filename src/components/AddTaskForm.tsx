/** @format */

import React from "react";

interface AddTaskFormProps {
  newTaskTitle: string;
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>;
  newTaskDescription: string;
  setNewTaskDescription: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (e: React.FormEvent) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskDescription,
  setNewTaskDescription,
  handleAddTask,
}) => {
  return (
    <form onSubmit={handleAddTask} className="space-y-2">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Назва завдання"
        className="p-2 border rounded w-full"
      />
      <textarea
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
        placeholder="Опис завдання"
        className="p-2 border rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Додати завдання
      </button>
    </form>
  );
};

export default AddTaskForm;

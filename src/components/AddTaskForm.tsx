/** @format */

import React, { useState } from "react";
import { addTask } from "../services/firebase";

const AddTaskForm = ({ listId }: { listId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Заповніть всі поля!");
      return;
    }

    try {
      await addTask(listId, title, description);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Не вдалося додати завдання!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold">Додати завдання</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Назва завдання"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Опис завдання"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Додати завдання
        </button>
      </form>
    </div>
  );
};

export default AddTaskForm;

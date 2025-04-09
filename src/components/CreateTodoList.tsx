/** @format */

import React, { useState } from "react";
import { createTodoList } from "../services/firebase";
import { getAuth } from "firebase/auth";

const CreateTodoList = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const userEmail = user.email || "";

      try {
        await createTodoList(userId, title, userEmail);
      } catch (err: any) {
        setError("Не вдалося створити список!");
      }
    } else {
      setError("Користувач не авторизований!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold">Створити новий список</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleCreateList} className="space-y-4">
        <input
          type="text"
          placeholder="Назва списку"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Створити список
        </button>
      </form>
    </div>
  );
};

export default CreateTodoList;

/** @format */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, deleteTodoList } from "../services/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import CreateTodoList from "../components/CreateTodoList";
import { onAuthStateChanged } from "firebase/auth";

const TodoListsPage = () => {
  const navigate = useNavigate();
  const [todoLists, setTodoLists] = useState<any[]>([]);
  const fetchTodoLists = async (userEmail: string) => {
    try {
      const todoListsRef = collection(db, "todoLists");

      const q = query(
        todoListsRef,
        where("collaboratorEmails", "array-contains", userEmail)
      );

      const querySnapshot = await getDocs(q);

      const lists = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched lists:", lists);
      setTodoLists(lists);
    } catch (error) {
      console.error("Error fetching todo lists:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        fetchTodoLists(user.email);
      } else {
        console.log("Користувач не авторизований");
      }
    });

    return () => unsubscribe(); // при анмаунті
  }, [todoLists]);

  const handleSelectList = (listId: string) => {
    navigate(`/todo-list/${listId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">Твої To-Do Списки</h2>

      <CreateTodoList />
      <ul className="space-y-2 ">
        {todoLists.length ? (
          todoLists.map((list) => (
            <li
              key={list.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-200"
            >
              <h3 className="font-semibold">{list.title}</h3>
              <button
                onClick={() => handleSelectList(list.id)}
                className="text-blue-500 mt-2"
              >
                Переглянути та додати завдання
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteTodoList(list.id);
                    setTodoLists((prev) =>
                      prev.filter((l) => l.id !== list.id)
                    );
                  } catch (error) {
                    alert("Ви не маєте прав на видалення цього списку.");
                    console.error(error);
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Видалити
              </button>
            </li>
          ))
        ) : (
          <p>Немає жодних списків To-Do.</p>
        )}
      </ul>
    </div>
  );
};

export default TodoListsPage;

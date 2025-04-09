/** @format */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import AddTaskForm from "./AddTaskForm";

const TodoList = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState<string>("");
  const [editingTaskDescription, setEditingTaskDescription] =
    useState<string>("");
  const [userRole, setUserRole] = useState<string>("");

  // Функція для отримання ролі користувача
  const fetchUserRole = async (listId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.log("Користувач не авторизований");
      return;
    }

    try {
      const listRef = doc(db, "todoLists", listId);
      const listDoc = await getDoc(listRef);

      if (listDoc.exists()) {
        const listData = listDoc.data();
        const collaborators = listData?.collaborators || [];
        const ownerId = listData?.ownerId;

        if (user.uid === ownerId) {
          setUserRole("owner");
          console.log("Користувач є власником списку");
          return;
        }

        const collaborator = collaborators.find(
          (collab: { email: string; role: string }) =>
            collab.email === user.email
        );

        if (collaborator?.role === "admin") {
          setUserRole("admin");
          console.log("Користувач є адміністратором");
        } else {
          setUserRole("viewer");
          console.log("Користувач є переглядачем");
        }
      } else {
        console.log("Список не знайдений");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchTasks = async () => {
    if (!listId) return;

    try {
      const tasksRef = collection(db, "todoLists", listId, "tasks");
      const q = query(tasksRef);
      const querySnapshot = await getDocs(q);

      const tasksList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListName = async () => {
    if (!listId) return;

    try {
      const listRef = doc(db, "todoLists", listId);
      const docSnapshot = await getDoc(listRef);
      setListName(
        docSnapshot.exists()
          ? docSnapshot.data()?.title || "Без назви"
          : "Список не знайдений"
      );
    } catch (error) {
      console.error("Error fetching list name:", error);
      setListName("Помилка завантаження");
    }
  };

  useEffect(() => {
    if (listId) {
      fetchTasks();
      fetchListName();
      fetchUserRole(listId);
    }
  }, [listId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !listId) return;

    try {
      await addDoc(collection(db, "todoLists", listId, "tasks"), {
        title: newTaskTitle,
        description: newTaskDescription,
        completed: false,
        createdAt: new Date(),
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!listId) return;

    try {
      await deleteDoc(doc(db, "todoLists", listId, "tasks", taskId));
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskDescription(task.description || "");
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !listId) return;

    try {
      const taskRef = doc(db, "todoLists", listId, "tasks", editingTaskId);
      await updateDoc(taskRef, {
        title: editingTaskTitle,
        description: editingTaskDescription,
      });
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Логування значення userRole для перевірки
  useEffect(() => {
    console.log("User Role:", userRole);
  }, [userRole]);

  if (loading) {
    return <div className="p-4">Завантаження...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{listName}</h2>

      <AddTaskForm
        newTaskTitle={newTaskTitle}
        setNewTaskTitle={setNewTaskTitle}
        newTaskDescription={newTaskDescription}
        setNewTaskDescription={setNewTaskDescription}
        handleAddTask={handleAddTask}
      />

      {editingTaskId && (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <h3 className="text-xl font-semibold mb-4">Редагувати завдання</h3>
          <form onSubmit={handleUpdateTask}>
            <div>
              <label className="block mb-2">Назва:</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingTaskTitle}
                onChange={(e) => setEditingTaskTitle(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block mb-2">Опис:</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                value={editingTaskDescription}
                onChange={(e) => setEditingTaskDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Оновити
            </button>
          </form>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Завдання</h3>
        {tasks.length > 0 ? (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-lg">{task.title}</h4>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`px-2 py-1 text-xs rounded-full mb-2 ${
                        task.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.completed ? "Виконано" : "Не виконане"}
                    </span>

                    {(userRole === "admin" || userRole === "owner") && (
                      <>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-2"
                        >
                          Видалити
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            Немає завдань у цьому списку
          </p>
        )}
      </div>
    </div>
  );
};

export default TodoList;

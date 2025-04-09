/** @format */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, db, getUserRoleInList } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import AddTaskForm from "./AddTaskForm";
import { Task } from "../types/types";

const TodoList = () => {
  const { listId } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [listName, setListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!listId) return;

    try {
      const tasksRef = collection(db, "todoLists", listId, "tasks");
      const q = query(tasksRef);
      const querySnapshot = await getDocs(q);

      // TYPE ERROR WITH TASKS  || TASKList != Task interface
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
    const fetchRole = async () => {
      const user = auth.currentUser;
      if (user?.email && listId) {
        const role = await getUserRoleInList(listId, user.email);
        setUserRole(role);
      }
    };

    fetchTasks();
    fetchListName();
    fetchRole();
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

  if (loading) {
    return <div className="p-4">Завантаження...</div>;
  }
  const handleDeleteTask = async (taskId: string) => {
    if (!listId) return;

    try {
      await deleteDoc(doc(db, "todoLists", listId, "tasks", taskId));
      fetchTasks(); // оновлюємо список після видалення
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">{listName}</h2>

      {(userRole === "admin" || userRole === "owner") && (
        <AddTaskForm
          newTaskTitle={newTaskTitle}
          setNewTaskTitle={setNewTaskTitle}
          newTaskDescription={newTaskDescription}
          setNewTaskDescription={setNewTaskDescription}
          handleAddTask={handleAddTask}
        />
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
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Видалити
                      </button>
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

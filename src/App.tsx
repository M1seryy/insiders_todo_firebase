/** @format */

import React from "react";
import "./App.css";
import "./index.css";
import Register from "./pages/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CreateTodoList from "./components/CreateTodoList";
import TodoList from "./components/TodoList";
import TodoListsPage from "./pages/TodoListPage";
import { logoutUser } from "./services/firebase";

const App = () => {
  return (
    <>
      <div className="p-4 text-center">
        <h1 className="text-3xl font-bold mb-6 ">Мій To-Do додаток</h1>
        <button
          onClick={logoutUser}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Log Out
        </button>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/todo-list" element={<TodoListsPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/todo-list/:listId" element={<TodoList />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

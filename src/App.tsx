/** @format */

import React from "react";
import "./App.css";
import "./index.css";
import Register from "./pages/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CreateTodoList from "./components/CreateTodoList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-todo-list" element={<CreateTodoList />} />
      </Routes>
    </Router>
  );
};

export default App;

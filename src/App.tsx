import React from "react";
import "./App.css";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { TasksContextProvider } from "./context/TaskContext";

const App = () => {
  return (
    <TasksContextProvider>
      <Header />
      <Tasks />
    </TasksContextProvider>
  );
};

export default App;

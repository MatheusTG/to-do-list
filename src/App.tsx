import React from "react";
import "./App.css";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { TaskType } from "./components/Task";

const App = () => {
  const [tasks, setTasks] = React.useState<TaskType[]>([]);

  return (
    <div>
      <Header setTasks={setTasks} />
      <Tasks tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default App;

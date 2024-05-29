import React from "react";
import { TaskType } from "../components/Task";

interface TasksContextType {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

const TaskContext = React.createContext<TasksContextType | null>(null);

export const useTasks = () => {
  const context = React.useContext(TaskContext);
  if (!context) throw new Error("TaskContextProvider deve estar em <App />");
  return context;
};

export const TasksContextProvider = ({ children }: React.PropsWithChildren) => {
  const [tasks, setTasks] = React.useState<TaskType[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

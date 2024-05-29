import React from "react";
import styles from "./Tasks.module.css";
import Clipboard from "../assets/icons/Clipboard.svg?react";
import Task from "./Task";
import { TaskType } from "./Task";

interface Props {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

const Tasks = ({ tasks, setTasks }: Props) => {
  console.log(tasks);

  return (
    <section className={`${styles.tasks} container`}>
      <header className={styles.tasksHeader}>
        <div className={styles.createdtask}>
          Tarefas criadas<span>0</span>
        </div>
        <div className={styles.completedtask}>
          Concluídas<span>0</span>
        </div>
      </header>
      <main>
        {tasks.length ? (
          <div className={styles.tasksList}>
            {tasks.map((task) => (
              <Task
                key={task.message}
                checked={task.checked}
                message={task.message}
                setTasks={setTasks}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noTasks}>
            <div className={styles.clipboard}>
              <Clipboard />
            </div>
            <div>
              <p className={styles.tasksMsg01}>
                Você ainda não tem tarefas cadastradas
              </p>
              <p className={styles.tasksMsg02}>
                Crie tarefas e organize seus itens a fazer
              </p>
            </div>
          </div>
        )}
      </main>
    </section>
  );
};

export default Tasks;

import React from "react";
import styles from "./Tasks.module.css";
import Clipboard from "../assets/icons/Clipboard.svg?react";
import Task from "./Task";
import { useTasks } from "../context/TaskContext";

const Tasks = () => {
  const { tasks } = useTasks();

  const createdTasks = tasks.length;
  const compretedTasks = tasks.filter((item) => item.checked).length;

  return (
    <section className={`${styles.tasks} container`}>
      <header className={styles.tasksHeader}>
        <div className={styles.createdtask}>
          Tarefas criadas<span>{createdTasks}</span>
        </div>
        <div className={styles.completedtask}>
          Concluídas
          <span>
            {compretedTasks ? `${compretedTasks} de ${createdTasks}` : "0"}
          </span>
        </div>
      </header>
      <main>
        {tasks.length ? (
          <div className={styles.tasksList}>
            {tasks.map((task) => (
              <Task key={task.id} id={task.id} />
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

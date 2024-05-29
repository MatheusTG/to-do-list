import React from "react";
import styles from "./Tasks.module.css";
// import Clipboard from "../assets/icons/Clipboard.svg?react";
import Task from "./Task";

const Tasks = () => {
  return (
    <section className={`${styles.tasks} container`}>
      <header className={styles.tasksHeader}>
        <div className={styles.createdTaks}>
          Tarefas criadas<span>0</span>
        </div>
        <div className={styles.completedTaks}>
          Concluídas<span>0</span>
        </div>
      </header>
      <main>
        {/* <div className={styles.noTasks}>
          <div className={styles.clipboard}>
            <Clipboard />
          </div>
          <div>
            <p className={styles.tasksMsg01}>Você ainda não tem tarefas cadastradas</p>
            <p className={styles.tasksMsg02}>Crie tarefas e organize seus itens a fazer</p>
          </div>
        </div> */}
        <div className={styles.tasksList}>
          <Task
            checked={false}
            message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere, amet?"
          />
          <Task
            checked={false}
            message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere, amet?"
          />
          <Task
            checked={true}
            message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere, amet?"
          />
          <Task
            checked={true}
            message="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere, amet?"
          />
        </div>
      </main>
    </section>
  );
};

export default Tasks;

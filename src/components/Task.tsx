import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";
import { useTasks } from "../context/TaskContext";

export interface TaskType {
  id: number;
  checked: boolean;
  message: string;
}

const Task = ({ id }: { id: number }) => {
  const { tasks, setTasks } = useTasks();

  const task = tasks.filter((task) => task.id === id)[0];

  function handleCheckedClick() {
    const teste = tasks.map((item) => {
      if (item.id === task.id) {
        item.checked = !item.checked;
      }
      return item;
    });

    setTasks(teste);
  }

  return (
    <div className={styles.task}>
      <button
        className={`${styles.checkedButton} ${task.checked && styles.checked}`}
        onClick={handleCheckedClick}
      />
      <span>{task.message}</span>
      <button
        className={styles.trash}
        onClick={() =>
          setTasks(() => tasks.filter((taskItem) => taskItem.id !== task.id))
        }
      >
        <Trash />
      </button>
    </div>
  );
};

export default Task;

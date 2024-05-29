import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";

export interface TaskType {
  checked: boolean;
  message: string;
}

interface Props extends TaskType {
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

const Task = ({ checked, message, setTasks }: Props) => {
  console.log(checked);
  return (
    <div className={styles.task}>
      <button className={`${styles.checkedButton} ${styles.checked}`} />
      {message}
      <button
        className={styles.trash}
        onClick={() =>
          setTasks((taskList) =>
            taskList.filter((task) => task.message !== message)
          )
        }
      >
        <Trash />
      </button>
    </div>
  );
};

export default Task;

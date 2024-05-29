import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";

interface Props {
  checked: boolean;
  message: string;
}

const Task = ({ checked, message }: Props) => {
  console.log(checked);
  return (
    <div className={styles.task}>
      <button className={`${styles.checkedButton} ${styles.checked}`} />
      {message}
      <button className={styles.trash}>
        <Trash />
      </button>
    </div>
  );
};

export default Task;

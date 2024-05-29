import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";
import Pencil from "../assets/icons/Pencil.svg?react";
import { useTasks } from "../context/TaskContext";

export interface TaskType {
  id: number;
  checked: boolean;
  message: string;
  date: string;
}

const Task = ({ id }: { id: number }) => {
  const { tasks, setTasks } = useTasks();
  const task = tasks.filter((task) => task.id === id)[0];

  const [active, setActive] = React.useState(false);
  const [message, setMessage] = React.useState(task.message);

  const inputMessage = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (active) {
      if (inputMessage.current?.disabled) inputMessage.current?.blur();
      else inputMessage.current?.focus();
    }
  }, [active]);

  function handleCheckedClick() {
    const teste = tasks.map((item) => {
      if (item.id === task.id) {
        item.checked = !item.checked;
      }
      return item;
    });

    setTasks(teste);
  }

  function handleEditClick() {
    setActive(true);
  }

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
    tasks[tasks.indexOf(task)].message = message;
    setTasks(tasks);
  }

  return (
    <div
      className={`${styles.taskContainer} ${active && styles.active}`}
      onClick={(event) =>
        event.target instanceof HTMLDivElement && setActive(!active)
      }
    >
      <p className={styles.date}>{task.date}</p>
      <div className={styles.task}>
        <button
          className={`${styles.checkedButton} ${
            task.checked && styles.checked
          }`}
          onClick={handleCheckedClick}
        />
        <input
          ref={inputMessage}
          className={styles.message}
          type="text"
          value={message}
          onChange={handleMessageChange}
          style={{ pointerEvents: "none" }}
        />
        <div className={styles.options}>
          <button
            className={active ? styles.active : ""}
            onClick={handleEditClick}
          >
            <Pencil />
          </button>
          <button
            onClick={() =>
              setTasks(() =>
                tasks.filter((taskItem) => taskItem.id !== task.id)
              )
            }
          >
            <Trash />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;

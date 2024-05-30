import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";
import Pencil from "../assets/icons/Pencil.svg?react";
import { useTasks } from "../context/TaskContext";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

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
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  React.useEffect(() => {
    if (active) inputMessage.current?.focus();
    else inputMessage.current?.blur();
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

  function handleMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    setMessage(event.target.value);
    tasks[tasks.indexOf(task)].message = message;
    setTasks(tasks);

    // Define uma nova data para a task após uma alteração
    tasks[tasks.indexOf(task)].date = format(
      new Date(),
      "d 'de' MMMM 'às' HH:mm",
      {
        locale: ptBR,
      }
    );
    setTasks(tasks);
  }

  return (
    <div
      className={`${styles.task} ${active && styles.active}`}
      onClick={(event) =>
        event.target instanceof HTMLDivElement && setActive(!active)
      }
    >
      <p className={styles.date}>Última alteração - {task.date}</p>
      <button
        className={`${styles.checkedButton} ${task.checked && styles.checked}`}
        onClick={handleCheckedClick}
      />
      <input
        ref={inputMessage}
        className={styles.message}
        type="text"
        value={message}
        onChange={handleMessageChange}
        onBlur={() => setTimeout(() => setActive(false), 100)}
        onKeyUp={({ key }) => key === "Enter" && setActive(false)}
        style={{ pointerEvents: "none" }}
      />
      <div className={styles.options}>
        <button
          className={active ? styles.active : ""}
          onClick={() => setActive(!active)}
        >
          <Pencil />
        </button>
        <button
          onClick={() =>
            setTasks(() => tasks.filter((taskItem) => taskItem.id !== task.id))
          }
        >
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default Task;

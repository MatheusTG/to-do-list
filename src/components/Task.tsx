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
  const [taskTransition, setTaskTransition] = React.useState("0.2s");

  const inputMessage = React.useRef<HTMLInputElement>(null);
  const taskElement = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (active) inputMessage.current?.focus();
    else inputMessage.current?.blur();
  }, [active]);

  React.useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleCheckedClick() {
    const isChecked = tasks.map((item) => {
      if (item.id === task.id) {
        item.checked = !item.checked;
      }
      return item;
    });

    setTasks(isChecked);
  }

  function handleBlur() {
    setTimeout(() => setActive(false), 100);

    // Recria as tasks atualizando os atributos message
    // e date da task atual
    if (task.message !== message) {
      const updatedTask = tasks.map((taskItem) => {
        if (taskItem.id === task.id)
          return {
            ...taskItem,
            message: message,
            date: format(new Date(), "d 'de' MMMM 'às' HH:mm", {
              locale: ptBR,
            }),
          };
        else return taskItem;
      });
      setTasks(updatedTask);
    }
  }

  const [copia, setCopia] = React.useState<HTMLElement | null>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});
  function handleTaskMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    function onMouseMove({ clientX, clientY }: MouseEvent) {
      setTaskTransition("");
      setCopia(taskElement.current);
      if (event.target instanceof HTMLElement)
        setStyle({
          zIndex: "1000",
          position: "absolute",
          left: clientX - event.target.offsetWidth * 0.5,
          top: clientY,
        });
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", () => {
      setCopia(null);
      setStyle({});
      setTaskTransition("0.2s");
      window.removeEventListener("mousemove", onMouseMove);
    });
  }

  return (
    <>
      {copia && (
        <div className={`${styles.task} ${styles.taskSkeleton} container`} />
      )}
      <div
        ref={taskElement}
        className={`${styles.task} ${active && styles.active} container`}
        onMouseDown={handleTaskMouseDown}
        style={{ ...style, transition: taskTransition }}
      >
        <p className={styles.date}>Última alteração - {task.date}</p>
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
          onChange={({ target }) => setMessage(target.value)}
          onBlur={handleBlur}
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
              setTasks(() =>
                tasks.filter((taskItem) => taskItem.id !== task.id)
              )
            }
          >
            <Trash />
          </button>
        </div>
      </div>
    </>
  );
};

export default Task;

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

  // Estados reativos
  const [active, setActive] = React.useState(false);
  const [message, setMessage] = React.useState(task.message);
  const [taskTransition, setTaskTransition] = React.useState("0.2s");
  const [skeletonOrder, setSkeletonOrder] = React.useState("");
  const [stylePosition, setStylePosition] = React.useState<React.CSSProperties>(
    {}
  );
  const [isOnTaskMovement, setIsOnTaskMovement] = React.useState(false);

  // Referências
  const inputMessage = React.useRef<HTMLInputElement>(null);
  const taskElement = React.useRef<HTMLDivElement>(null);
  const skeletonOrderReference = React.useRef(0);

  // Se active for true faz o focus no input senão adiciona o blur
  React.useEffect(() => {
    if (active) inputMessage.current?.focus();
    else inputMessage.current?.blur();
  }, [active]);

  // Toda vez que as tasks forem alteradas, elas serão salvas
  // novamento no localStorage
  React.useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Executa ao mover o mouse após o mousedown na task
  function onMouseMove({ clientX, clientY, target }: MouseEvent) {
    setTaskTransition("");
    setIsOnTaskMovement(true);

    // Altera a posição do skeleton da task
    if (target instanceof HTMLDivElement) {
      const order = target.getAttribute("data-order");

      if (order) {
        if (Number(order) < skeletonOrderReference.current) {
          setSkeletonOrder(String(Number(order) - 2));
          skeletonOrderReference.current = Number(order) - 1;
        } else {
          setSkeletonOrder(String(Number(order) + 1));
          skeletonOrderReference.current = Number(order) + 1;
        }
      }
    }

    // Faz com que a task siga o mouse
    if (taskElement.current instanceof HTMLElement)
      setStylePosition({
        zIndex: "-1",
        position: "absolute",
        left: clientX - taskElement.current.offsetWidth * 0.5,
        top: clientY - taskElement.current.offsetHeight * 0.5,
      });
  }

  // Impede a seleção de texto
  function noSelect(event: Event) {
    event.preventDefault();
  }

  // Executa ao mouseup após o mousedawn na task
  function handleMouseUp() {
    document.removeEventListener("selectstart", noSelect);
    window.removeEventListener("mousemove", onMouseMove);
    setIsOnTaskMovement(false);
    setStylePosition({});
    setTaskTransition("0.2s");
  }

  // Executa ao mousedown na task
  function handleTaskMouseDown() {
    document.addEventListener("selectstart", noSelect);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  // Atualiza o atributo cheked da task toda vez que o botão
  // de checked é clicado.
  function handleCheckedClick() {
    const isChecked = tasks.map((item) => {
      if (item.id === task.id) {
        item.checked = !item.checked;
      }
      return item;
    });

    setTasks(isChecked);
  }

  // Ao blur do input, caso a message tenha sido alterado essa
  // função atualiza o atributo message e date da task.
  function handleBlur() {
    setTimeout(() => setActive(false), 100);

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

  return (
    <>
      {isOnTaskMovement && (
        <div
          className={`${styles.task} ${styles.taskSkeleton} container`}
          style={{ order: skeletonOrder }}
        />
      )}
      <div
        ref={taskElement}
        className={`${styles.task} ${active && styles.active} container`}
        onMouseDown={handleTaskMouseDown}
        style={{ ...stylePosition, transition: taskTransition, order: task.id }}
        data-order={task.id}
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

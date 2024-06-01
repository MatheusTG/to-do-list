import React from "react";
import styles from "./Task.module.css";
import Trash from "../assets/icons/Trash.svg?react";
import Pencil from "../assets/icons/Pencil.svg?react";
import MovePoints from "../assets/icons/MovePoints.svg?react";
import { useTasks } from "../context/TaskContext";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export interface TaskType {
  id: number;
  checked: boolean;
  message: string;
  date: string;
  order: number;
}

const Task = ({ id }: { id: number }) => {
  const { tasks, setTasks } = useTasks();
  const taskRef = React.useRef(tasks.filter((task) => task.id === id)[0]);
  const task = taskRef.current;

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
  const taskSkeleton = React.useRef<HTMLDivElement>(null);
  const wasMoved = React.useRef(false);

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
  function onMouseMove({ clientY, target }: MouseEvent) {
    wasMoved.current = true;
    setTaskTransition("");
    setIsOnTaskMovement(true);

    // Altera a posição do skeleton da task
    if (target instanceof HTMLElement) {
      // Faz com que o target não seja um item interno da task,
      // mas sim a task em si
      const taskB = target.getAttribute("data-order")
        ? target
        : target.parentElement?.parentElement;
      const order = taskB?.getAttribute("data-order");

      if (order) {
        if (Number(order) < skeletonOrderReference.current) {
          setSkeletonOrder(String(Number(order) - 1));
          skeletonOrderReference.current = Number(order) - 1;
        } else {
          setSkeletonOrder(String(Number(order) + 1));
          skeletonOrderReference.current = Number(order) + 1;
        }
      }
    }

    // Faz com que a task siga o mouse
    if (taskElement.current instanceof HTMLElement) {
      setStylePosition({
        transform: "scale(0.96)",
        zIndex: "-1",
        position: "absolute",
        // left: clientX - taskElement.current.offsetWidth * 0.5,
        top: clientY - taskElement.current.offsetHeight * 0.5,
      });
    }
  }

  // Impede a seleção de texto
  function noSelect(event: Event) {
    event.preventDefault();
  }

  // Executa ao mouseup após o mousedawn na task
  function handleMouseUp() {
    if (!wasMoved.current) {
      document.body.style.cursor = "initial";
      setTaskTransition("0.2s");
      setIsOnTaskMovement(false);
      setStylePosition({});
      document.removeEventListener("selectstart", noSelect);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      return;
    }
    setStylePosition({
      zIndex: "-1",
      position: "absolute",
      left: taskSkeleton.current?.offsetLeft,
      top: taskSkeleton.current?.offsetTop,
    });

    const newTasks = tasks.slice();

    newTasks.map((taskItem) => {
      if (task.order < skeletonOrderReference.current - 1) {
        if (taskItem.order >= skeletonOrderReference.current) {
          return ++taskItem.order;
        }
      } else if (task.order > skeletonOrderReference.current - 1) {
        if (taskItem.order <= skeletonOrderReference.current) {
          return --taskItem.order;
        }
      }
    });
    newTasks.map((taskItem) => {
      if (taskItem.id === task.id) {
        taskItem.order = skeletonOrderReference.current;
        return taskItem.order;
      }
    });

    // O setTimeout possibilita que a animação ocorra ao soltar a task
    setTimeout(() => {
      setTasks(newTasks);
      setIsOnTaskMovement(false);
      setStylePosition({});
    }, 200);

    // Remove os eventos e reseta as variáveis de estado
    document.body.style.cursor = "initial";
    setTaskTransition("0.2s");
    document.removeEventListener("selectstart", noSelect);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);

    wasMoved.current = false;
  }

  // Executa ao mousedown na task
  function handleTaskMouseDown({ target }: React.MouseEvent<HTMLElement>) {
    if (
      target instanceof Element &&
      !target.getAttribute("data-action") &&
      !target.parentElement?.getAttribute("data-action") &&
      !active
    ) {
      // Faz com que ocorra o efeito de scale na task ao clique
      setIsOnTaskMovement(true);
      setStylePosition({
        transform: "scale(0.96)",
        zIndex: "-1",
        position: "absolute",
        top: taskElement.current?.offsetTop,
      });

      document.body.style.cursor = "grabbing";
      document.addEventListener("selectstart", noSelect);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
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

  function handleTrashClick() {
    const newTasks = tasks.filter((taskItem) => {
      return taskItem.id !== task.id;
    });

    // Se for a última task não haverá mais o componente task para que
    // o useEffect execute e salve no localStorage, por isso o if
    if (newTasks.length === 0)
      window.localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
  }

  return (
    <>
      {isOnTaskMovement && (
        <div
          ref={taskSkeleton}
          className={`${styles.task} ${styles.taskSkeleton} container task`}
          style={{ order: skeletonOrder }}
        />
      )}
      <div
        ref={taskElement}
        className={`${styles.task} ${active && styles.active} container task`}
        onMouseDown={handleTaskMouseDown}
        style={{
          ...stylePosition,
          transition: taskTransition,
          order: task.order,
          cursor: "grab",
        }}
        data-order={task.order}
      >
        <p className={styles.date}>Última alteração - {task.date}</p>
        <button
          className={`${styles.checkedButton} ${
            task.checked && styles.checked
          }`}
          data-action="true"
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
          style={{ pointerEvents: active ? "initial" : "none" }}
        />
        <div className={styles.options}>
          <button
            className={active ? styles.active : ""}
            data-action="true"
            onClick={() => setActive(!active)}
          >
            <Pencil />
          </button>
          <button data-action="true" onClick={handleTrashClick}>
            <Trash />
          </button>
          <button className={isOnTaskMovement ? styles.active : ""}>
            <MovePoints />
          </button>
        </div>
      </div>
    </>
  );
};

export default Task;

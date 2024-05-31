import React from "react";
import styles from "./Header.module.css";
import Rocket from "../assets/icons/Rocket.svg?react";
import Plus from "../assets/icons/Plus.svg?react";
import { useTasks } from "../context/TaskContext";
import Error from "./Helper/Error";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Header = () => {
  const [message, setMessase] = React.useState("");
  const [error, setError] = React.useState("");

  const { tasks, setTasks } = useTasks();

  function handleClick() {
    if (!message.trim()) {
      setError("Digite algo para adicionar uma task.");
    } else {
      // Difinindo id da task
      let id = 0;
      if (tasks.length) {
        id = tasks.sort((a, b) => a.id - b.id)[tasks.length - 1].id + 1;
      }

      // Criando nova task
      const date = new Date();
      const formattedDate = format(date, "d 'de' MMMM 'às' HH:mm", {
        locale: ptBR,
      });
      const newTask = {
        id: id,
        checked: false,
        message: message,
        date: formattedDate,
        order: id,
      };
      setTasks(() => [...tasks, newTask]);
      setMessase("");
    }
  }

  function handleChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (error && target.value) setError("");
    setMessase(target.value);
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        e
        <Rocket />
        <h1 className={styles.logo}>
          to<span>do</span>
        </h1>
      </div>

      <form
        className={`${styles.form} container`}
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="text"
          placeholder="Adicione uma nova tarefa"
          name="task"
          value={message}
          onChange={handleChange}
        />
        <button onClick={handleClick}>
          Criar <Plus />
        </button>
        {error && <Error message={error} />}
      </form>
    </header>
  );
};

export default Header;

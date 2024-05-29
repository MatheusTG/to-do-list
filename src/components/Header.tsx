import React from "react";
import styles from "./Header.module.css";
import Rocket from "../assets/icons/Rocket.svg?react";
import Plus from "../assets/icons/Plus.svg?react";
import { TaskType } from "./Task";
interface Props {
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

const Header = ({ setTasks }: Props) => {
  const [message, setMessase] = React.useState("");

  function handleClick() {
    setTasks((taskList) => [...taskList, { checked: false, message: message }]);
    setMessase('')
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
          onChange={({ target }) => setMessase(target.value)}
        />
        <button onClick={handleClick}>
          Criar <Plus />
        </button>
      </form>
    </header>
  );
};

export default Header;

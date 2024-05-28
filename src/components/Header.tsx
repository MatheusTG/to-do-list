import React from "react";
import styles from "./Header.module.css";
import Rocket from "../assets/icons/Rocket.svg?react";
import Plus from "../assets/icons/Plus.svg?react";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Rocket />
        <h1 className={styles.logo}>
          to<span>do</span>
        </h1>
      </div>

      <form className={styles.form}>
        <input type="text" placeholder="Adicione uma nova tarefa" />
        <button>
          Criar <Plus />
        </button>
      </form>
    </header>
  );
};

export default Header;

import styles from "./button.module.css";

export const Button = ({ children, type = "button", onClick }) => {
  return (
    <button className={styles.button} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

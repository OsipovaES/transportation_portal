import styles from "./layout.module.css";

export const Layout = ({ title, children }) => {
  return (
    <main className={styles.layoutContainer}>
      {title && <h1 className={styles.layoutTitle}>{title}</h1>}
      <div>{children}</div>
    </main>
  );
};

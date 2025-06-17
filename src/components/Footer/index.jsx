import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <span>&copy; </span>
        <span className={styles.italic}>Все права защищены</span>
      </div>
      <div className={styles.right}>
        <span>Осипова Елизавета, Санкт-Петербург 2025</span>
      </div>
    </footer>
  );
};

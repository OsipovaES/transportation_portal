import styles from "./modal.module.css";

export const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          х
        </button>
        {children}
      </div>
    </div>
  );
};

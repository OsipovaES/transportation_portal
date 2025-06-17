import styles from "./card.module.css";
import { Button } from "../Button";

export const Card = ({
  title,
  details,
  data,
  status,
  onButtonClick,
  buttonText,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "отклонена":
        return styles.rejected;
      case "выполнена":
        return styles.completed;
      case "в работе":
        return styles.inProgress;
      default:
        return styles.defaultStatus;
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      {data && data.length > 0 && (
        <ul className={styles.dataList}>
          {data.map((item, index) => (
            <li key={index} className={styles.dataItem}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}

      {details && <p className={styles.details}>{details}</p>}

      {status && (
        <span className={`${styles.status} ${getStatusClass(status)}`}>
          {status}
        </span>
      )}

      {onButtonClick && <Button onClick={onButtonClick}>{buttonText}</Button>}
    </div>
  );
};

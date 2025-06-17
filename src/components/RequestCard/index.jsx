import { useState, useEffect } from "react";
import styles from "./requestCard.module.css";
import { Button } from "../Button";

export const RequestCard = ({
  id,
  title,
  details,
  data,
  status,
  review,
  onButtonClick,
  buttonText,
  onReviewSubmit,
  onStatusChange,
  onDelete, // новый пропс для удаления
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [localReview, setLocalReview] = useState(review || "");

  useEffect(() => {
    setLocalReview(review || "");
  }, [review]);

  useEffect(() => {
    if (showReviewForm) {
      setReviewText(localReview || "");
    }
  }, [showReviewForm, localReview]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Отменена":
        return styles.rejected;
      case "Выполнена":
        return styles.completed;
      case "Новая":
        return styles.new;
      case "В процессе":
        return styles.inProgress;
      default:
        return styles.new;
    }
  };

  const statusOptions = ["Новая", "В процессе", "Выполнена", "Отменена"];

  const handleSendReview = async () => {
    if (!reviewText.trim()) return;

    try {
      const response = await fetch(`/api/requests/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: reviewText }),
      });

      if (!response.ok) throw new Error("Не удалось отправить отзыв");

      const updated = await response.json();
      setLocalReview(updated.review);
      setShowReviewForm(false);

      if (onReviewSubmit) onReviewSubmit();
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error.message);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      {data?.length > 0 && (
        <ul className={styles.dataList}>
          {data.map((item, index) => (
            <li key={index} className={styles.dataItem}>
              <strong>{item.label}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}

      {details && (
        <p className={styles.details}>
          {details.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      )}

      {status && (
        <div className={styles.statusSection}>
          <span className={`${styles.status} ${getStatusClass(status)}`}>
            {status}
          </span>
          {onStatusChange && (
            <select
              value={status}
              onChange={(e) => onStatusChange(id, e.target.value)}
              className={styles.statusSelect}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {localReview && (
        <p className={styles.review}>
          <strong>Отзыв:</strong> {localReview}
        </p>
      )}

      {onReviewSubmit && !showReviewForm && (
        <Button onClick={() => setShowReviewForm(true)}>Оставить отзыв</Button>
      )}

      {onReviewSubmit && showReviewForm && (
        <div className={styles.reviewForm}>
          <textarea
            className={styles.textarea}
            placeholder="Введите отзыв"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button onClick={handleSendReview}>Отправить</Button>
        </div>
      )}

      <div className={styles.actions}>
        {onButtonClick && <Button onClick={onButtonClick}>{buttonText}</Button>}

        {onDelete && (
          <Button
            onClick={onDelete}
            style={{ backgroundColor: "#e53935", marginLeft: "10px" }}
          >
            Удалить
          </Button>
        )}
      </div>
    </div>
  );
};

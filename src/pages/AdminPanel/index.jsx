import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { RequestCard } from "../../components/RequestCard";
import styles from "./controlPanel.module.css";

export const AdminPanel = () => {
  const [requestsData, setRequestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Загрузка заявок
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        if (!res.ok) throw new Error("Ошибка при получении заявок");
        const data = await res.json();

        const formattedData = data.map((request) => ({
          id: request.id,
          title: `Заявка №${request.id}`,
          details: `Тип груза: ${request.cargo_type}\nМаршрут: ${request.pickup_address} → ${request.delivery_address}`,
          data: [
            {
              label: "Дата и время",
              value: request.desired_datetime
                ? new Date(request.desired_datetime).toLocaleString("ru-RU")
                : "Не указано",
            },
            {
              label: "Вес",
              value: request.cargo_weight
                ? `${request.cargo_weight} кг`
                : "Не указано",
            },
            {
              label: "Габариты",
              value: request.cargo_dimensions || "Не указано",
            },
          ],
          status: request.status,
          review: request.review,
        }));

        setRequestsData(formattedData);
      } catch (err) {
        console.error("Ошибка загрузки заявок:", err);
        setErrorMessage("Не удалось загрузить заявки. Попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Обработка смены статуса
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Ошибка обновления статуса");

      const updated = await response.json();

      setRequestsData((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: updated.status } : r
        )
      );
    } catch (err) {
      console.error("Не удалось обновить статус:", err.message);
      alert("Ошибка при обновлении статуса");
    }
  };

  // Обработка удаления заявки
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Вы действительно хотите удалить эту заявку?")) return;

    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Ошибка при удалении заявки");

      setRequestsData((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error(err);
      alert("Не удалось удалить заявку");
    }
  };

  return (
    <Layout title="Панель управления - Заявки">
      {isLoading ? (
        <p>Загрузка заявок...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div className={styles.cardsContainer}>
          {requestsData.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              title={request.title}
              details={request.details}
              data={request.data}
              status={request.status}
              review={request.review}
              onStatusChange={handleStatusChange}
              onDelete={() => handleDeleteRequest(request.id)} // добавляем удаление
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

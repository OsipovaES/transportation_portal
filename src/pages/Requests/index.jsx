import { useEffect, useState, useCallback } from "react";
import { Layout } from "../../components/layout";
import { RequestCard } from "../../components/RequestCard";
import styles from "./requests.module.css";

export const Requests = () => {
  const [requestsData, setRequestsData] = useState([]);

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/requests");
      if (!response.ok) throw new Error("Не удалось получить заявки");

      const data = await response.json();

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
            value: `${request.cargo_weight || "Не указано"} кг`,
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
    } catch (error) {
      console.error("Ошибка загрузки заявок:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <Layout title="История заявок">
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
            onReviewSubmit={fetchRequests}
          />
        ))}
      </div>
    </Layout>
  );
};

import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Card } from "../../components/Card";
import { useNavigate } from "react-router-dom";

export const Requests = () => {
  const navigate = useNavigate();
  const handleCreateRequest = () => {
    navigate("/create-request");
  };

  const [requestsData, setRequestsData] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          throw new Error("Не удалось получить заявки");
        }
        const data = await response.json();

        const formattedData = data.map((request) => ({
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
              value: `${request.cargo_weight} кг`,
            },
            {
              label: "Габариты",
              value: request.cargo_dimensions,
            },
          ],
          status: request.status,
        }));

        setRequestsData(formattedData);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <Layout title="История заявок">
      <div>
        <Card
          title="Понравились наши услуги?"
          buttonText="Создать новую заявку"
          onButtonClick={handleCreateRequest}
        />
        {requestsData.map((request, index) => (
          <Card
            key={index}
            title={request.title}
            details={request.details}
            data={request.data}
            status={request.status}
          />
        ))}
      </div>
    </Layout>
  );
};

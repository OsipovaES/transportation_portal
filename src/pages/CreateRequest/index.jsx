import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form } from "../../components/Form";
import { Layout } from "../../components/layout";

// Валидация заявки
const createRequestSchema = z.object({
  desiredDatetime: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Введите корректную дату и время."
    ),
  cargoWeight: z
    .string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Введите вес в килограммах."
    ),
  cargoDimensions: z
    .string()
    .min(2, "Введите габариты груза, например: 2x1.5x1 м."),
  pickupAddress: z.string().min(5, "Адрес отправления слишком короткий."),
  deliveryAddress: z.string().min(5, "Адрес доставки слишком короткий."),
  cargoType: z.string().nonempty("Выберите тип груза."),
});

export const CreateRequest = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    desiredDatetime: "",
    cargoWeight: "",
    cargoDimensions: "",
    pickupAddress: "",
    deliveryAddress: "",
    cargoType: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    try {
      createRequestSchema.pick({ [name]: true }).parse({ [name]: value });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0]?.message }));
      }
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    console.log("submit");

    try {
      setErrors({});
      createRequestSchema.parse(formData);

      const userId = parseInt(localStorage.getItem("userId"));
      const accessToken = localStorage.getItem("access_token");

      if (!userId) {
        alert("Пользователь не найден. Авторизуйтесь заново.");
        return;
      }

      if (!accessToken) {
        alert("Токен доступа отсутствует. Авторизуйтесь заново.");
        return;
      }

      const payload = {
        ...formData,
        userId,
        desiredDateTime: new Date(formData.desiredDatetime).toISOString(),
        status: "Новая",
      };

      console.log("Отправляем payload:", payload);

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("response status:", response.status);
      const result = await response.json();
      console.log("response body:", result);

      if (!response.ok) {
        alert(result.error || "Ошибка при создании заявки");
        return;
      }

      alert("Заявка успешно создана!");
      navigate("/requests");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = {};
        error.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
        console.log("Валидационные ошибки:", formErrors);
      } else {
        console.error("Ошибка при создании заявки:", error.message);
        alert("Не удалось создать заявку. Попробуйте снова.");
      }
    }
  };

  return (
    <Layout title="Создание заявки">
      <Form
        description="Заполните данные для новой заявки"
        onSubmit={handleCreateRequest}
        inputs={[
          {
            label: "Дата и время доставки",
            placeholder: "ДД/ММ/ГГГГ, ЧЧ:ММ",
            name: "desiredDatetime",
            type: "datetime-local",
            value: formData.desiredDatetime,
            onChange: handleInputChange,
            error: errors.desiredDatetime,
          },
          {
            label: "Вес груза (кг)",
            placeholder: "Например: 1200",
            name: "cargoWeight",
            type: "number",
            value: formData.cargoWeight,
            onChange: handleInputChange,
            error: errors.cargoWeight,
          },
          {
            label: "Габариты груза",
            placeholder: "Пример: 2x1.5x1 м",
            name: "cargoDimensions",
            type: "text",
            value: formData.cargoDimensions,
            onChange: handleInputChange,
            error: errors.cargoDimensions,
          },
          {
            label: "Адрес отправления",
            placeholder: "Введите адрес отправки",
            name: "pickupAddress",
            type: "text",
            value: formData.pickupAddress,
            onChange: handleInputChange,
            error: errors.pickupAddress,
          },
          {
            label: "Адрес доставки",
            placeholder: "Введите адрес доставки",
            name: "deliveryAddress",
            type: "text",
            value: formData.deliveryAddress,
            onChange: handleInputChange,
            error: errors.deliveryAddress,
          },
        ]}
        selects={[
          {
            label: "Тип груза",
            name: "cargoType",
            options: [
              { label: "Хрупкое", value: "Хрупкое" },
              { label: "Скоропортящееся", value: "Скоропортящееся" },
              {
                label: "Требуется рефрижератор",
                value: "Требуется рефрижератор",
              },
              { label: "Животные", value: "Животные" },
              { label: "Жидкость", value: "Жидкость" },
              { label: "Мебель", value: "Мебель" },
              { label: "Мусор", value: "Мусор" },
            ],
            error: errors.cargoType,
            value: formData.cargoType,
            onChange: handleInputChange,
          },
        ]}
        buttonText="Создать заявку"
      />
    </Layout>
  );
};

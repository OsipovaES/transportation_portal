import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form } from "../../components/Form";
import { Layout } from "../../components/layout";

// Схема валидации для регистрации врача
const registrationSchema = z
  .object({
    name: z
      .string()
      .min(3, "Имя должно содержать хотя бы 3 символа.")
      .max(100, "Имя не должно быть длиннее 100 символов."),
    phone: z
      .string()
      .regex(/^(\+7|7|8)[\d]{10}$/, "Неверный формат телефона.")
      .min(11, "Телефон должен содержать 11 цифр."),
    email: z
      .string()
      .email("Неверный формат email.")
      .max(100, "Email не должен быть длиннее 100 символов."),
    username: z
      .string()
      .min(3, "Логин должен содержать хотя бы 3 символа.")
      .max(50, "Логин не должен быть длиннее 50 символов."),
    password: z.string().min(6, "Пароль должен содержать хотя бы 6 символов."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают.",
    path: ["confirmPassword"],
  });

export const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    try {
      registrationSchema.pick({ [name]: true }).parse({ [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0]?.message,
        }));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setErrors({});

      registrationSchema.parse(formData);

      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
      }

      alert("Регистрация успешна!");
      navigate("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors = {};
        error.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
      console.log(error);
    }
  };

  return (
    <Layout title="Регистрация">
      <Form
        description="Зарегистрируйтесь в системе"
        inputs={[
          {
            label: "Имя (ФИО)",
            placeholder: "Иванов Иван Иванович",
            type: "text",
            name: "name",
            value: formData.name,
            onChange: handleInputChange,
            error: errors.name,
          },
          {
            label: "Телефон",
            placeholder: "+7 (900) 123-45-67",
            type: "tel",
            name: "phone",
            value: formData.phone,
            onChange: handleInputChange,
            error: errors.phone,
          },
          {
            label: "Email",
            placeholder: "ivanov@example.com",
            type: "email",
            name: "email",
            value: formData.email,
            onChange: handleInputChange,
            error: errors.email,
          },
          {
            label: "Логин",
            placeholder: "ivanov_2025",
            type: "text",
            name: "username",
            value: formData.username,
            onChange: handleInputChange,
            error: errors.username,
          },
          {
            label: "Пароль",
            placeholder: "Введите ваш пароль",
            type: "password",
            name: "password",
            value: formData.password,
            onChange: handleInputChange,
            error: errors.password,
          },
          {
            label: "Подтвердите пароль",
            placeholder: "Повторите ваш пароль",
            type: "password",
            name: "confirmPassword",
            value: formData.confirmPassword,
            onChange: handleInputChange,
            error: errors.confirmPassword,
          },
        ]}
        buttonText="Зарегистрироваться"
        onSubmit={handleRegister}
      />
    </Layout>
  );
};

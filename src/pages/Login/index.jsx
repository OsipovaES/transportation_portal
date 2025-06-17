import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "../../components/Form";
import { Layout } from "../../components/layout";
import { z } from "zod";

// Схема валидации для входа врача
const loginSchema = z.object({
  username: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const validationErrors = validation.error.format();
      setErrors({
        username: validationErrors.username?._errors[0],
        password: validationErrors.password?._errors[0],
      });
      return;
    }

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({ form: error.message });
        return;
      }

      const { access_token, user } = await response.json();

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      alert("Вход успешен!");

      if (user.role === "admin") {
        navigate("/admin-panel");
      } else {
        navigate("/requests");
      }
    } catch (error) {
      console.log(error);
      setErrors({ form: "Ошибка сервера. Попробуйте позже." });
    }
  };

  return (
    <Layout title="Вход">
      <Form
        description="Введите ваши данные для входа"
        inputs={[
          {
            label: "Логин",
            placeholder: "Введите логин",
            name: "username",
            value: formData.username,
            onChange: handleInputChange,
            error: errors.username,
          },
          {
            label: "Пароль",
            placeholder: "Введите пароль",
            type: "password",
            name: "password",
            value: formData.password,
            onChange: handleInputChange,
            error: errors.password,
          },
        ]}
        buttonText="Войти"
        onSubmit={handleLogin}
        formError={errors.form}
      />
    </Layout>
  );
};

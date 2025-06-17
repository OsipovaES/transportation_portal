import { z } from "zod";
import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import styles from "./controlPanel.module.css";

// Схема валидации для добавления и обновления пациента
const patientSchema = z.object({
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
  diagnosis: z.string().min(3, "Диагноз должен содержать хотя бы 3 символа."),
  birthDate: z.string().min(10, "Дата рождения обязательна."),
  lastVisitDate: z.string().min(10, "Дата приема обязательна."),
});

export const AdminPanel = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    diagnosis: "",
    birthDate: "",
    lastVisitDate: "",
  });
  const [treatmentData, setTreatmentData] = useState({
    treatmentDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Получение всех пациентов
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients");
        if (!res.ok) {
          throw new Error("Ошибка при получении данных с сервера.");
        }
        const data = await res.json();
        if (data.length === 0) {
          setErrorMessage("Нет пациентов для отображения.");
        }
        setPatients(data);
      } catch (err) {
        console.error("Ошибка загрузки пациентов:", err);
        setErrorMessage("Не удалось загрузить пациентов. Попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleTreatmentChange = (e) => {
    const { name, value } = e.target;
    setTreatmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPatientDetails = async (id) => {
    try {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      setSelectedPatient(data);
    } catch (err) {
      console.error("Ошибка загрузки пациента:", err);
    }
  };

  // Обработчик добавления лечения
  const handleAddTreatment = async () => {
    try {
      const newTreatment = {
        ...treatmentData,
        patientId: selectedPatient._id,
      };

      await fetch(`/api/treatments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTreatment),
      });

      // Обновление истории пациента с новым лечением
      const updatedPatient = {
        ...selectedPatient,
        history: [...selectedPatient.history, newTreatment],
      };
      setSelectedPatient(updatedPatient);
      setIsTreatmentModalOpen(false);
    } catch (err) {
      console.error("Ошибка добавления лечения:", err);
    }
  };

  // Обработчик обновления пациента
  const handleUpdatePatient = async () => {
    try {
      patientSchema.parse(selectedPatient);

      await fetch(`/api/patients/${selectedPatient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPatient),
      });

      setSelectedPatient(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors = {};
        err.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
      console.error("Ошибка обновления:", err);
    }
  };

  // Обработчик добавления нового пациента
  const handleAddPatient = async () => {
    try {
      patientSchema.parse(formData);

      await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsAddModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        diagnosis: "",
        birthDate: "",
        lastVisitDate: "",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formErrors = {};
        err.errors.forEach((err) => {
          formErrors[err.path[0]] = err.message;
        });
        setErrors(formErrors);
      }
      console.error("Ошибка добавления:", err);
    }
  };

  return (
    <Layout title="Панель управления">
      <div className={styles.actions}>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Добавить пациента
        </Button>
      </div>

      {isLoading ? (
        <p>Загрузка...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Дата приёма</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} onClick={() => fetchPatientDetails(p._id)}>
                <td>{p.name}</td>
                <td>
                  {p.lastVisitDate && !isNaN(Date.parse(p.lastVisitDate))
                    ? new Date(p.lastVisitDate).toLocaleDateString("ru-RU")
                    : "Не указана"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedPatient && (
        <Modal onClose={() => setSelectedPatient(null)}>
          <h2>{selectedPatient.name}</h2>
          <p>
            <strong>Телефон:</strong> {selectedPatient.phone}
          </p>
          <p>
            <strong>Email:</strong> {selectedPatient.email}
          </p>
          <p>
            <strong>Дата рождения:</strong>{" "}
            {new Date(selectedPatient.birthDate).toLocaleDateString("ru-RU")}
          </p>
          <p>
            <strong>Дата приёма:</strong>{" "}
            {new Date(selectedPatient.lastVisitDate).toLocaleDateString(
              "ru-RU"
            )}
          </p>

          <Input
            label="Диагноз"
            value={selectedPatient.diagnosis}
            onChange={(e) =>
              setSelectedPatient({
                ...selectedPatient,
                diagnosis: e.target.value,
              })
            }
            error={errors.diagnosis}
          />

          <h3>История болезни</h3>
          {selectedPatient.history && selectedPatient.history.length > 0 ? (
            <ul>
              {selectedPatient.history.map((record, idx) => (
                <li key={idx}>
                  <strong>
                    {new Date(record.treatmentDate).toLocaleDateString("ru-RU")}
                  </strong>
                  : {record.notes}
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет записей</p>
          )}

          <Button onClick={handleUpdatePatient}>Сохранить диагноз</Button>
          <Button onClick={() => setIsTreatmentModalOpen(true)}>
            Назначить лечение
          </Button>
        </Modal>
      )}

      {isTreatmentModalOpen && (
        <Modal onClose={() => setIsTreatmentModalOpen(false)}>
          <h2>Назначение лечения</h2>
          <Input
            label="Дата лечения"
            type="date"
            value={treatmentData.treatmentDate}
            onChange={handleTreatmentChange}
            name="treatmentDate"
          />
          <Input
            label="Примечания"
            value={treatmentData.notes}
            onChange={handleTreatmentChange}
            name="notes"
          />
          <Button onClick={handleAddTreatment}>Добавить лечение</Button>
        </Modal>
      )}

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2>Новый пациент</h2>
          <Input
            label="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
          <Input
            label="Телефон"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            error={errors.phone}
          />
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
          />
          <Input
            label="Диагноз"
            value={formData.diagnosis}
            onChange={(e) =>
              setFormData({ ...formData, diagnosis: e.target.value })
            }
            error={errors.diagnosis}
          />
          <Input
            label="Дата рождения"
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
            error={errors.birthDate}
          />
          <Input
            label="Дата приёма"
            type="date"
            value={formData.lastVisitDate}
            onChange={(e) =>
              setFormData({ ...formData, lastVisitDate: e.target.value })
            }
            error={errors.lastVisitDate}
          />
          <Button onClick={handleAddPatient}>Добавить</Button>
        </Modal>
      )}
    </Layout>
  );
};

import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import styles from "./header.module.css";

export const Header = () => {
  const navigate = useNavigate();

  const isAuth = Boolean(localStorage.getItem("access_token"));

  const handleNavigateToRegistration = () => {
    navigate("/");
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleNavigateToRequests = () => {
    navigate("/requests");
  };

  const handleNavigateToCreate = () => {
    navigate("/create-request");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <header className={styles.head}>
      <div onClick={handleNavigateToRegistration} className={styles.logo}>
        <img
          src="/logo.svg"
          alt="Система учета медицинских данных пациентов"
          className={styles.logoImg}
        />
        <div>
          <h1 className={styles.logoText}>MedTrack</h1>
          <p className={styles.subtitle}>
            система учета медицинских данных пациентов
          </p>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        {isAuth ? (
          <>
            <Button onClick={handleNavigateToRequests}>Все заявки</Button>
            <Button onClick={handleNavigateToCreate}>Создать заявку</Button>
            <Button onClick={handleLogout}>Выйти</Button>
          </>
        ) : (
          <>
            <Button onClick={handleNavigateToLogin}>Вход</Button>
            <Button onClick={handleNavigateToRegistration}>Регистрация</Button>
          </>
        )}
      </div>
    </header>
  );
};

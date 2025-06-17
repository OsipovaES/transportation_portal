import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import styles from "./header.module.css";

export const Header = () => {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");
  const isAuth = Boolean(accessToken);

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

  const handleNavigateToAdminPanel = () => {
    navigate("/admin-panel");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <header className={styles.head}>
      <div
        onClick={handleNavigateToRegistration}
        className={styles.logo}
        style={{ cursor: "pointer" }}
      >
        <div>
          <h1 className={styles.logoText}>Грузы</h1>
          <p className={styles.subtitle}>грузоперевозки</p>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        {isAuth ? (
          <>
            <Button onClick={handleNavigateToRequests}>Все заявки</Button>
            <Button onClick={handleNavigateToCreate}>Создать заявку</Button>
            {role === "admin" && (
              <Button onClick={handleNavigateToAdminPanel}>
                Панель администратора
              </Button>
            )}
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

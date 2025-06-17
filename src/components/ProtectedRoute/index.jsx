import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const isAuth = Boolean(localStorage.getItem("access_token"));

  return isAuth ? children : <Navigate to="/" replace />;
};

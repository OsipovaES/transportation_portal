import { Routes, Route } from "react-router-dom";
import { Registration } from "../pages/Registration";
import { AdminPanel } from "../pages/AdminPanel";
import { Requests } from "../pages/Requests";
import { CreateRequest } from "../pages/CreateRequest";
import { Login } from "../pages/Login";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Доступно всегда */}
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />

      {/* Только для авторизованных пользователей */}
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-request"
        element={
          <ProtectedRoute>
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

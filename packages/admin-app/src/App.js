import { Routes, Route, Navigate } from "react-router-dom";
import RequireAdmin from "./components/features/auth/RequireAdmin";
import RequireSuperAdmin from "./components/features/auth/RequireSuperAdmin";
import AdminLayout from "./components/layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UserEditPage from "./pages/UserEditPage";

const PublicOnlyRoute = ({ children }) => {
  const token = window.localStorage.getItem("admin_token");
  if (token) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/users/:id/edit"
        element={
          <RequireAdmin>
            <RequireSuperAdmin>
              <AdminLayout>
                <UserEditPage />
              </AdminLayout>
            </RequireSuperAdmin>
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
}

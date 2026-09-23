import { Routes, Route, Navigate } from "react-router-dom";
import RequireAdmin from "./components/features/auth/RequireAdmin";
import RequireSuperAdmin from "./components/features/auth/RequireSuperAdmin";
import AdminLayout from "./components/layout/AdminLayout";
import PageTransition from "./components/ui/Military/PageTransition";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import UserEditPage from "./pages/UserEditPage";

const PublicOnlyRoute = ({ children }) => {
  const token = window.localStorage.getItem("admin_token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <PageTransition>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <RequireAdmin>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </RequireAdmin>
          }
        />
        <Route
          path="/users/:id/edit"
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </PageTransition>
  );
}

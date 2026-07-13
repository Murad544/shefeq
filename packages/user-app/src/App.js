import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ActivationPage from "./pages/ActivationPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage";

const ProtectedRoute = ({ children }) => {
  const token = window.localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const token = window.localStorage.getItem("auth_token");

  if (token) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #5A7298 0%, #364F6B 50%, #243348 100%)",
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/activate/:token" element={<ActivationPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ErrorBoundary>
  );
}

export default App;

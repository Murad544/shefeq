import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import BootSequence from "./components/military/BootSequence";
import PageTransition from "./components/military/PageTransition";
import ActivationPage from "./pages/ActivationPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationPage from "./pages/RegistrationPage";

const CABINET_BOOT_LINES = [
  "SİSTEM İŞƏ SALINIR",
  "ŞƏXSİ KABİNET YÜKLƏNİR",
  "İNTERFEYS HAZIRLANIR",
];

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
      <BrowserRouter>
        <PageTransition>
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
                  {/* Start-up sequence plays once per session on entering the cabinet */}
                  <BootSequence
                    storageKey="sg_cabinet_boot_done"
                    lines={CABINET_BOOT_LINES}
                  />
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

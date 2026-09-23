import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import RadarLoader from "../../ui/Military/RadarLoader";
import TacticalBackground from "../../ui/Military/TacticalBackground";
import { C } from "../../../styles/tokens";
import { authApi } from "../../../api/authApi";
import { getToken, removeToken } from "../../../api/http";

export default function RequireAdmin({ children }) {
  const [status, setStatus] = React.useState("checking");
  const location = useLocation();

  React.useEffect(() => {
    let alive = true;

    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          if (alive) setStatus("unauthorized");
          return;
        }

        await authApi.me();
        if (alive) setStatus("authorized");
      } catch (error) {
        console.error("Auth check failed:", error);
        removeToken();
        if (alive) setStatus("unauthorized");
      }
    };

    checkAuth();

    return () => {
      alive = false;
    };
  }, []);

  if (status === "checking") {
    return (
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: C.field900,
          color: C.textOnDark,
          p: 3,
        }}
      >
        <TacticalBackground />
        <Box sx={{ position: "relative", textAlign: "center" }}>
          <RadarLoader size={104} dark message="Giriş yoxlanılır" />
          <Typography
            variant="body2"
            sx={{
              color: C.textOnDarkMuted,
              maxWidth: 280,
              mx: "auto",
              mt: 1.5,
            }}
          >
            Zəhmət olmasa gözləyin, icazələriniz yoxlanılır...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (status === "unauthorized") {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return children;
}

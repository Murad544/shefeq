import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
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
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, #5A7298 0%, #364F6B 50%, #243348 100%)`,
          p: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(54, 79, 107, 0.2)",
            minWidth: 300,
          }}
        >
          <CircularProgress
            size={48}
            thickness={4}
            sx={{
              color: "primary.main",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Giriş yoxlanılır
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              maxWidth: 250,
              mx: "auto",
            }}
          >
            Zəhmət olmasa gözləyin, icazələriniz yoxlanılır...
          </Typography>
        </Paper>
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

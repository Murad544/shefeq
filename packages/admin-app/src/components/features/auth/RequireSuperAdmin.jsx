import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useCurrentAdmin } from "../../../hooks/data/useCurrentAdmin";

export default function RequireSuperAdmin({ children }) {
  const location = useLocation();
  const { data, loading } = useCurrentAdmin();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!data || data.role !== "superadmin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

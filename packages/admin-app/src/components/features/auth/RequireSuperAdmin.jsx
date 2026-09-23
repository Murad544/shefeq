import * as React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import RadarLoader from "../../ui/Military/RadarLoader";
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
        <RadarLoader message="Səlahiyyət yoxlanılır" />
      </Box>
    );
  }

  if (!data || data.role !== "superadmin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}

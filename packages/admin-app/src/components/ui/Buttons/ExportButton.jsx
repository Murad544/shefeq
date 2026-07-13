// components/ui/Buttons/ExportButton.jsx
import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { MdDownload } from "react-icons/md";

export default function ExportButton({
  onClick,
  loading = false,
  disabled = false,
  variant = "outlined",
  size = "small",
  color = "primary",
  icon = <MdDownload size={16} />,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        minWidth: "auto",
        px: 2,
        py: 1,
        borderRadius: 1.5,
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "none",
        border: variant === "outlined" ? "1px solid" : "none",
        borderColor: `${color}.light`,
        color: variant === "outlined" ? `${color}.main` : "white",
        bgcolor: variant === "contained" ? `${color}.main` : "transparent",
        "&:hover": {
          bgcolor: variant === "outlined" ? `${color}.light` : `${color}.dark`,
          color: "white",
          borderColor: variant === "outlined" ? `${color}.main` : "none",
        },
        "&:disabled": {
          opacity: 0.6,
        },
        ...props.sx,
      }}
      {...props}
    >
      {" "}
      {loading ? <CircularProgress size={16} color="inherit" /> : icon}
    </Button>
  );
}

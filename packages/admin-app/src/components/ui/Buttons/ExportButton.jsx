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
  label = "Excel",
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color="inherit" /> : icon}
      sx={{
        minWidth: "auto",
        px: 2,
        py: 0.9,
        whiteSpace: "nowrap",
        "&.Mui-disabled": {
          opacity: 0.55,
        },
        ...props.sx,
      }}
      {...props}
    >
      {label}
    </Button>
  );
}

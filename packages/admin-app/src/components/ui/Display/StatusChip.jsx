import { Chip } from "@mui/material";

export default function StatusChip({
  status,
  variant = "filled",
  size = "small",
  colorMap = {},
  ...props
}) {
  const getStatusColor = (status) => {
    const statusLower = String(status || "").toLowerCase();

    // Default color mapping
    const defaultColors = {
      active: "success",
      aktiv: "success",
      true: "success",
      inactive: "default",
      deaktiv: "default",
      false: "default",
      pending: "warning",
      gözləyir: "warning",
      accepted: "success",
      "qəbul edilmiş": "success",
      rejected: "error",
      "rədd edilmiş": "error",
      ...colorMap,
    };

    return defaultColors[statusLower] || "error";
  };

  const getStatusLabel = (status) => {
    const labelMap = {
      active: "Aktiv",
      inactive: "Deaktiv",
      pending: "Gözləyir",
      accepted: "Qəbul edilmiş",
      rejected: "Rədd edilmiş",
      true: "Onlayn",
      false: "Offlayn",
      ...colorMap,
    };

    return labelMap[String(status).toLowerCase()] || String(status);
  };

  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <Chip
      label={label}
      variant={variant}
      size={size}
      color={color}
      sx={{
        fontWeight: 600,
        fontSize: size === "small" ? "0.75rem" : "0.875rem",
        transition: "inherit",
        pointerEvents: "none",
        ...props.sx,
        color: "white",
      }}
      {...props}
    />
  );
}

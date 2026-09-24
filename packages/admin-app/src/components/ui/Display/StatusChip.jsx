import { Box } from "@mui/material";
import { C, labelCaps } from "../../../styles/tokens";

const TONES = {
  success: { fg: C.green, bg: "rgba(62, 123, 58, 0.12)", led: "#62B85A" },
  warning: { fg: "#8F6614", bg: "rgba(192, 138, 30, 0.14)", led: C.amber },
  error: { fg: C.red, bg: "rgba(168, 50, 42, 0.1)", led: C.redLight },
  default: { fg: C.textMuted, bg: "rgba(92, 97, 82, 0.1)", led: C.textFaint },
};

// Square status badge with an indicator lamp.
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

  const tone = TONES[getStatusColor(status)] || TONES.error;
  const label = getStatusLabel(status);

  return (
    <Box
      component="span"
      sx={{
        ...labelCaps,
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1,
        height: size === "small" ? 24 : 28,
        fontSize: size === "small" ? "0.72rem" : "0.8rem",
        color: tone.fg,
        bgcolor: variant === "outlined" ? "transparent" : tone.bg,
        border: `1px solid ${tone.fg}`,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        ...props.sx,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          color: tone.led,
          bgcolor: "currentColor",
        }}
      />
      {label}
    </Box>
  );
}

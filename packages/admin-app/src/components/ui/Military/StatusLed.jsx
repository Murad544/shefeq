import { Box } from "@mui/material";
import { C, FONT } from "../../../styles/tokens";

export const LED_ON = "#62B85A";

// Indicator lamp with an optional pulsing ring and mono caption.
const StatusLed = ({
  on = true,
  label,
  color,
  size = 8,
  pulse = true,
  sx,
  labelSx,
}) => {
  const lamp = color || (on ? LED_ON : C.textFaint);

  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", alignItems: "center", gap: 1, ...sx }}
    >
      <Box
        component="span"
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          color: lamp,
          bgcolor: "currentColor",
          flexShrink: 0,
          animation: on && pulse ? "sg-pulse 2s ease-out infinite" : "none",
        }}
      />
      {label && (
        <Box
          component="span"
          sx={{
            fontFamily: FONT.mono,
            fontSize: "0.72rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            ...labelSx,
          }}
        >
          {label}
        </Box>
      )}
    </Box>
  );
};

export default StatusLed;

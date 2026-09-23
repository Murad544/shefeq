import { Box } from "@mui/material";
import { C, FONT } from "../../config/tokens";

// Radar-scope loading indicator: rings, crosshair, rotating sweep and blips.
const RadarLoader = ({ size = 72, message, dark = false, sx }) => {
  const line = dark ? "rgba(201, 166, 70, 0.28)" : "rgba(75, 83, 32, 0.28)";
  const sweep = dark ? "201, 166, 70" : "75, 83, 32";
  const step = Math.max(8, Math.round(size / 6));

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1px solid ${line}`,
          overflow: "hidden",
          background: [
            `linear-gradient(${line}, ${line}) center / 100% 1px no-repeat`,
            `linear-gradient(${line}, ${line}) center / 1px 100% no-repeat`,
            `repeating-radial-gradient(circle at center, transparent 0, transparent ${step - 1}px, ${line} ${step - 1}px, ${line} ${step}px)`,
            dark ? "rgba(16, 21, 15, 0.9)" : "rgba(233, 228, 212, 0.7)",
          ].join(","),
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `conic-gradient(from 0deg, rgba(${sweep}, 0) 0deg, rgba(${sweep}, 0) 270deg, rgba(${sweep}, 0.08) 300deg, rgba(${sweep}, 0.65) 359deg, rgba(${sweep}, 0) 360deg)`,
            animation: "sg-sweep 1.8s linear infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 4,
            height: 4,
            m: "-2px",
            borderRadius: "50%",
            bgcolor: dark ? C.brass : C.olive,
          }}
        />
      </Box>
      {message && (
        <Box
          sx={{
            fontFamily: FONT.display,
            fontWeight: 600,
            fontSize: "0.9rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: dark ? C.textOnDarkMuted : C.textMuted,
            textAlign: "center",
          }}
        >
          {message}
          <Box
            component="span"
            sx={{ ml: 0.5, animation: "sg-blink 1s steps(1) infinite" }}
          >
            _
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RadarLoader;

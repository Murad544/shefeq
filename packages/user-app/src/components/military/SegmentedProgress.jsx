import { Box } from "@mui/material";
import { C, EASE } from "../../config/tokens";

// Progress rendered as discrete cells, like an ammunition or battery gauge.
const SegmentedProgress = ({
  value = 0,
  segments = 20,
  height = 10,
  gap = 3,
  tone = "paper",
  color,
  animate = true,
  label,
  sx,
}) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const filled = Math.round((v / 100) * segments);
  const on = color || (tone === "dark" ? C.brass : C.olive);
  const off = tone === "dark" ? "rgba(214, 200, 150, 0.12)" : C.paperSunk;

  return (
    <Box
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(${segments}, 1fr)`,
        gap: `${gap}px`,
        height,
        ...sx,
      }}
    >
      {Array.from({ length: segments }, (_, i) => {
        const lit = i < filled;
        return (
          <Box
            key={i}
            sx={{
              bgcolor: lit ? on : off,
              transformOrigin: "bottom",
              transition: "background-color .3s ease",
              animation:
                animate && lit
                  ? `sg-grow-y .4s ${EASE.out} ${120 + i * 30}ms backwards`
                  : "none",
            }}
          />
        );
      })}
    </Box>
  );
};

export default SegmentedProgress;

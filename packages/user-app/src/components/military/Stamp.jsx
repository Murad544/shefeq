import { Box } from "@mui/material";
import { C, FONT } from "../../config/tokens";

const TONES = {
  paper: { green: C.green, red: C.red, amber: "#9A6D12", olive: C.olive, brass: C.brassDark },
  dark: { green: C.greenLight, red: C.redLight, amber: "#D9A441", olive: C.brass, brass: C.brass },
};

const SIZES = { sm: "0.78rem", md: "1rem", lg: "1.4rem" };

// Rubber stamp with a double rule. Lands with a short "thud" animation.
const Stamp = ({
  label,
  sub,
  tone = "green",
  size = "md",
  rotate = -8,
  onDark = false,
  animate = true,
  delay = 0,
  sx,
}) => {
  const color = (onDark ? TONES.dark : TONES.paper)[tone] || tone;

  return (
    <Box
      sx={{
        "--sg-rot": `${rotate}deg`,
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        px: 1.5,
        py: 0.5,
        border: `2px solid ${color}`,
        outline: `1px solid ${color}`,
        outlineOffset: "2px",
        color,
        fontFamily: FONT.display,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontSize: SIZES[size] || SIZES.md,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg)`,
        opacity: 0.92,
        userSelect: "none",
        animation: animate
          ? `sg-stamp .6s cubic-bezier(.2,.9,.3,1.15) ${delay}ms backwards`
          : "none",
        ...sx,
      }}
    >
      <span>{label}</span>
      {sub && (
        <Box
          component="span"
          sx={{
            fontFamily: FONT.mono,
            fontSize: "0.62em",
            letterSpacing: "0.08em",
            fontWeight: 500,
          }}
        >
          {sub}
        </Box>
      )}
    </Box>
  );
};

export default Stamp;

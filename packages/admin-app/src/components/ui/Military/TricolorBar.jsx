import { Box } from "@mui/material";
import { C, EASE } from "../../../styles/tokens";

// Thin national tricolor (blue / red / green) used as a masthead stripe.
const TricolorBar = ({ height = 6, animate = false, delay = 0, sx }) => (
  <Box
    aria-hidden
    sx={{
      height,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transformOrigin: "center",
      ...(animate && {
        animation: `sg-draw-x .9s ${EASE.out} ${delay}ms backwards`,
      }),
      ...sx,
    }}
  >
    <Box sx={{ flex: 1, bgcolor: C.flagBlue }} />
    <Box sx={{ flex: 1, bgcolor: C.flagRed }} />
    <Box sx={{ flex: 1, bgcolor: C.flagGreen }} />
  </Box>
);

export default TricolorBar;

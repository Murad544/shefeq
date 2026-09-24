import { Box } from "@mui/material";
import { C, EASE } from "../../config/tokens";

// Single brass rule used as a masthead stripe and section accent.
const TricolorBar = ({ height = 6, animate = false, delay = 0, sx }) => (
  <Box
    aria-hidden
    sx={{
      height,
      bgcolor: C.brass,
      flexShrink: 0,
      transformOrigin: "center",
      ...(animate && {
        animation: `sg-draw-x .9s ${EASE.out} ${delay}ms backwards`,
      }),
      ...sx,
    }}
  />
);

export default TricolorBar;

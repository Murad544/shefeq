import { Box } from "@mui/material";
import { C } from "../../../styles/tokens";

// Viewfinder-style corner brackets. The parent must be position: relative.
// Parents can target `.sg-brackets` to animate them on hover.
const CornerBrackets = ({
  size = 14,
  thickness = 2,
  color = C.brass,
  inset = 0,
  sx,
}) => {
  const corner = {
    position: "absolute",
    width: size,
    height: size,
    borderColor: color,
    borderStyle: "solid",
    borderWidth: 0,
    transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  return (
    <Box
      aria-hidden
      className="sg-brackets"
      sx={{ position: "absolute", inset, pointerEvents: "none", ...sx }}
    >
      <Box
        sx={{
          ...corner,
          top: 0,
          left: 0,
          borderTopWidth: thickness,
          borderLeftWidth: thickness,
        }}
      />
      <Box
        sx={{
          ...corner,
          top: 0,
          right: 0,
          borderTopWidth: thickness,
          borderRightWidth: thickness,
        }}
      />
      <Box
        sx={{
          ...corner,
          bottom: 0,
          left: 0,
          borderBottomWidth: thickness,
          borderLeftWidth: thickness,
        }}
      />
      <Box
        sx={{
          ...corner,
          bottom: 0,
          right: 0,
          borderBottomWidth: thickness,
          borderRightWidth: thickness,
        }}
      />
    </Box>
  );
};

export default CornerBrackets;

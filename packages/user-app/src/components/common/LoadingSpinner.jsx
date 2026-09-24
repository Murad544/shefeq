import { Box } from "@mui/material";
import RadarLoader from "../military/RadarLoader";
import TacticalBackground from "../military/TacticalBackground";
import { C } from "../../config/tokens";

const LoadingSpinner = ({
  message = "Yüklənir...",
  size = 40,
  fullScreen = false,
}) => {
  if (!fullScreen) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <RadarLoader size={Math.max(56, size + 16)} message={message} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: C.field900,
      }}
    >
      <TacticalBackground />
      <RadarLoader size={96} message={message} dark sx={{ position: "relative" }} />
    </Box>
  );
};

export default LoadingSpinner;

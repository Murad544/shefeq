import { Box } from "@mui/material";
import RadarLoader from "../Military/RadarLoader";

export default function LoadingState({
  message = "Yüklənir...",
  size = 40,
  color,
}) {
  return (
    <Box
      sx={{
        py: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <RadarLoader size={Math.max(64, size + 24)} message={message} />
    </Box>
  );
}

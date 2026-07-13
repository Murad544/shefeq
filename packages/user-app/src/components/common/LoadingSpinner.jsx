import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({
  message = "Yüklənir...",
  size = 40,
  fullScreen = false,
}) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        ...(fullScreen && {
          minHeight: "100vh",
          bgcolor: "background.default",
        }),
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return content;
};

export default LoadingSpinner;

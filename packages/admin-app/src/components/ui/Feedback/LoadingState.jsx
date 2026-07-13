import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingState({
  message = "Yüklənir...",
  size = 40,
  color = "primary.main",
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
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={size} sx={{ color }} />
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Stack>
    </Box>
  );
}

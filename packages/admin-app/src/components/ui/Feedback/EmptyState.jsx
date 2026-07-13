import { Box, Typography } from "@mui/material";

export default function EmptyState({
  title = "Heç bir məlumat tapılmadı",
  subtitle = "Axtarış şərtlərini dəyişdirin və ya yenidən cəhd edin",
  icon,
}) {
  return (
    <Box sx={{ py: 6, textAlign: "center" }}>
      {icon && <Box sx={{ mb: 2, color: "text.secondary" }}>{icon}</Box>}
      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          fontSize: { xs: "1rem", md: "1.25rem" },
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

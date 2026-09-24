import { Box, Typography } from "@mui/material";
import { MdInbox } from "react-icons/md";
import { C } from "../../../styles/tokens";

export default function EmptyState({
  title = "Heç bir məlumat tapılmadı",
  subtitle = "Axtarış şərtlərini dəyişdirin və ya yenidən cəhd edin",
  icon,
}) {
  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        textAlign: "center",
        border: `1px dashed ${C.ruleStrong}`,
        animation: "sg-fade-in .4s ease backwards",
      }}
    >
      <Box sx={{ mb: 1.5, color: C.textFaint, display: "flex", justifyContent: "center" }}>
        {icon || <MdInbox size={36} />}
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: C.text,
          fontSize: { xs: "1rem", md: "1.15rem" },
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

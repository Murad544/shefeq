import { Box, Typography } from "@mui/material";
import { C, labelCaps } from "../../../styles/tokens";

// Dossier section: ruled header (icon · TITLE · actions) over a body.
export default function InfoCard({ title, children, icon, actions }) {
  return (
    <Box
      sx={{
        mb: 2.5,
        bgcolor: C.paperRaised,
        border: `1px solid ${C.rule}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 2, md: 2.5 },
          minHeight: 48,
          bgcolor: C.paperSunk,
          borderBottom: `1px solid ${C.rule}`,
        }}
      >
        <Box sx={{ display: "flex", color: C.olive }}>{icon}</Box>
        <Typography
          component="h3"
          sx={{
            ...labelCaps,
            fontWeight: 700,
            fontSize: { xs: "0.9rem", md: "0.95rem" },
            flex: 1,
            py: 1.25,
          }}
        >
          {title}
        </Typography>
        {actions}
      </Box>
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>{children}</Box>
    </Box>
  );
}

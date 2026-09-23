import { Box, Typography, Grid } from "@mui/material";
import { getColorScheme } from "../../../constants/colors";
import { C, labelCaps } from "../../../styles/tokens";

export default function TableHeader({
  title,
  subtitle,
  colorScheme = "primary",
  children,
  actions,
}) {
  const colors = getColorScheme(colorScheme);

  return (
    <Box
      sx={{
        position: "relative",
        p: { xs: 2.5, sm: 3 },
        bgcolor: C.field900,
        color: C.textOnDark,
        borderBottom: `3px solid ${colors.main}`,
      }}
    >
      <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start">
        <Grid item xs={12} md={actions ? 8 : 12}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: subtitle || children ? 1.25 : 0 }}>
            <Box sx={{ width: 4, height: 22, bgcolor: colors.main === C.olive ? C.brass : colors.main }} />
            <Typography
              component="h2"
              sx={{
                ...labelCaps,
                fontWeight: 700,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
              }}
            >
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: C.textOnDarkMuted,
                mb: children ? 1.5 : 0,
              }}
            >
              {subtitle}
            </Typography>
          )}
          {children}
        </Grid>
        {actions && (
          <Grid item xs={12} md={4}>
            {actions}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

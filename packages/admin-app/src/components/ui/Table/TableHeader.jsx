import { Box, Typography, Grid } from "@mui/material";
import { getColorScheme } from "../../../constants/colors";

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
        p: { xs: 2.5, sm: 3 },
        bgcolor: colors.dark,
        color: "white",
        borderBottom: "1px solid",
        borderColor: colors.main,
      }}
    >
      <Grid justifyContent={"space-between"}>
        <Grid item xs={12} md={children ? 8 : 12}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: subtitle || children ? 1 : 0,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                mb: children ? 1 : 0,
                fontSize: { xs: "0.85rem", md: "0.875rem" },
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

import { Grid, Stack, Typography, Box } from "@mui/material";

export default function FieldRow({
  label,
  value,
  icon,
  xs = 12,
  sm = 6,
  renderValue,
  ...gridProps
}) {
  const displayValue = (v) => {
    if (renderValue) return renderValue(v);
    return v == null || v === "" ? "-" : String(v);
  };

  return (
    <Grid item xs={xs} sm={sm} {...gridProps}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && (
            <Box sx={{ color: "secondary.main", fontSize: 16 }}>{icon}</Box>
          )}
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "0.75rem",
            }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          sx={{
            wordBreak: "break-word",
            fontSize: { xs: "0.9rem", md: "1rem" },
            color: "text.primary",
            fontWeight: 500,
            pl: icon ? 2.5 : 0,
          }}
        >
          {displayValue(value)}
        </Typography>
      </Stack>
    </Grid>
  );
}

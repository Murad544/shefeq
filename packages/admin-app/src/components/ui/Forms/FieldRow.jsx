import { Grid, Stack, Typography, Box } from "@mui/material";
import { C, labelCaps } from "../../../styles/tokens";

// Label / value pair styled like a filled-in line on an official form.
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
    return v == null || v === "" ? "—" : String(v);
  };

  return (
    <Grid item xs={xs} sm={sm} {...gridProps}>
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          {icon && (
            <Box sx={{ color: C.brassDark, display: "flex" }}>{icon}</Box>
          )}
          <Typography
            variant="caption"
            sx={{
              ...labelCaps,
              color: C.textMuted,
              fontSize: "0.7rem",
            }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          sx={{
            wordBreak: "break-word",
            fontSize: { xs: "0.92rem", md: "0.98rem" },
            color: value == null || value === "" ? C.textFaint : C.text,
            fontWeight: 500,
            pb: 0.75,
            borderBottom: `1px dashed ${C.ruleStrong}`,
          }}
        >
          {displayValue(value)}
        </Typography>
      </Stack>
    </Grid>
  );
}

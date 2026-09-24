import { Box, Stack, Typography } from "@mui/material";
import { C } from "../../config/tokens";

// Section heading: "── OVERLINE" above a serif title.
const SectionHeader = ({
  overline,
  title,
  subtitle,
  dark = false,
  align = "left",
  titleVariant = "h2",
  titleComponent = "h2",
  sx,
}) => {
  const accent = dark ? C.brass : C.brassDark;
  const centered = align === "center";

  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 }, ...sx }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        justifyContent={centered ? "center" : "flex-start"}
        sx={{ mb: 1.5 }}
      >
        <Box sx={{ width: 36, height: "1px", bgcolor: accent, opacity: 0.7 }} />
        {overline && (
          <Typography variant="overline" sx={{ color: accent }}>
            {overline}
          </Typography>
        )}
      </Stack>
      <Typography
        variant={titleVariant}
        component={titleComponent}
        sx={{ color: dark ? C.textOnDark : C.text }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            mt: 1.5,
            color: dark ? C.textOnDarkMuted : C.textMuted,
            maxWidth: 640,
            mx: centered ? "auto" : 0,
            fontSize: "1.05rem",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;

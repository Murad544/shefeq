import { Box, Grid, Typography } from "@mui/material";
import SearchField from "../Forms/SearchField";
import { C, FONT } from "../../../styles/tokens";

export default function TableSearch({
  searchValue,
  onSearchChange,
  totalCount = 0,
  colorScheme = "primary",
  countLabel = "nəticə",
  placeholder,
  isMobile = false,
  isLoading = false,
}) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={8}>
        <SearchField
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          color={colorScheme}
          isMobile={isMobile}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 0.5,
            justifyContent: { xs: "space-between", md: "flex-end" },
            alignItems: { xs: "center", md: "flex-end" },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 1,
              px: 1.5,
              py: 0.5,
              border: `1px solid ${C.lineDarkStrong}`,
              fontFamily: FONT.mono,
            }}
          >
            <Box component="span" sx={{ fontSize: "1.05rem", color: C.brassLight, fontVariantNumeric: "tabular-nums" }}>
              {totalCount}
            </Box>
            <Box component="span" sx={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: C.textOnDarkMuted, textTransform: "uppercase", whiteSpace: "nowrap" }}>
              {countLabel}
            </Box>
          </Box>
          {!isLoading && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: FONT.mono,
                color: C.textOnDarkMuted,
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
              }}
            >
              {searchValue ? "Filtrlənmiş nəticələr" : `Bütün ${countLabel}lər`}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

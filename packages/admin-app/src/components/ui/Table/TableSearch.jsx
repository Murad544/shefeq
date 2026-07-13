import { Box, Grid, Chip, Typography } from "@mui/material";
import SearchField from "../Forms/SearchField";

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
    <Grid container spacing={2} alignItems="flex-start">
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
            gap: 1,
            justifyContent: { xs: "space-between", md: "flex-end" },
            alignItems: { xs: "center", md: "flex-end" },
            height: "100%",
          }}
        >
          <Chip
            label={`${totalCount} ${countLabel}`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              fontSize: { xs: "0.75rem", md: "0.8rem" },
            }}
          />
          {!isLoading && (
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: { xs: "0.75rem", md: "0.8rem" },
                fontWeight: 500,
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

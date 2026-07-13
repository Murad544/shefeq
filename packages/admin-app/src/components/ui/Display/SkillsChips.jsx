import { Chip, Box, Grid } from "@mui/material";
import { parseSkills } from "../../../utils/formatters";

export default function SkillsChips({ value, limit = 6, size = "small" }) {
  const items = parseSkills(value).filter(Boolean);

  if (items.length === 0) {
    return (
      <Box sx={{ py: { xs: 0.25, sm: 0.5 } }}>
        <Chip
          label="Heç bir bacarıq yoxdur"
          size={size}
          variant="outlined"
          sx={{
            color: "text.secondary",
            borderColor: "grey.300",
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            height: { xs: 24, sm: 28 },
          }}
        />
      </Box>
    );
  }

  const visibleSkills = items.slice(0, limit);
  const remainingCount = items.length - limit;

  return (
    <Grid container spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
      {visibleSkills.map((skill, i) => (
        <Grid item key={i}>
          <Chip
            label={skill}
            size={size}
            variant="outlined"
            sx={{
              bgcolor: "rgba(54, 79, 107, 0.04)",
              borderColor: "rgba(54, 79, 107, 0.2)",
              color: "primary.main",
              fontWeight: 500,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              height: { xs: 24, sm: 28, md: 30 },
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "primary.light",
                borderColor: "primary.main",
                color: "white",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(54, 79, 107, 0.15)",
              },
              "& .MuiChip-label": {
                px: { xs: 1, sm: 1.5 },
              },
            }}
          />
        </Grid>
      ))}

      {remainingCount > 0 && (
        <Grid item>
          <Chip
            size={size}
            label={`+${remainingCount}`}
            variant="filled"
            sx={{
              bgcolor: "secondary.light",
              color: "secondary.dark",
              fontWeight: 600,
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              height: { xs: 24, sm: 28, md: 30 },
              minWidth: { xs: 28, sm: 32 },
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "secondary.main",
                color: "white",
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(63, 193, 201, 0.25)",
              },
              "& .MuiChip-label": {
                px: { xs: 1, sm: 1.5 },
              },
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}

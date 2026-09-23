import { Chip, Box, Grid } from "@mui/material";
import { parseSkills } from "../../../utils/formatters";
import { C } from "../../../styles/tokens";

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
            borderColor: C.rule,
            borderStyle: "dashed",
          }}
        />
      </Box>
    );
  }

  const visibleSkills = items.slice(0, limit);
  const remainingCount = items.length - limit;

  return (
    <Grid container spacing={{ xs: 0.5, sm: 0.75 }} alignItems="center">
      {visibleSkills.map((skill, i) => (
        <Grid item key={i}>
          <Chip
            label={skill}
            size={size}
            variant="outlined"
            sx={{
              bgcolor: "rgba(75, 83, 32, 0.06)",
              borderColor: "rgba(75, 83, 32, 0.35)",
              color: C.oliveDark,
              transition: "background-color .2s, color .2s",
              "&:hover": {
                bgcolor: C.olive,
                borderColor: C.olive,
                color: C.paper,
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
              bgcolor: C.brass,
              color: C.ink,
              minWidth: { xs: 28, sm: 32 },
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}

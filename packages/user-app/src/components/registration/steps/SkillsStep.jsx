import {
  Box,
  Stack,
  TextField,
  IconButton,
  Chip,
  Typography,
  Paper,
} from "@mui/material";
import { Add } from "@mui/icons-material";

const SkillsStep = ({
  skills,
  skillInput,
  onSkillInputChange,
  onAddSkill,
  onDeleteSkill,
  errors = {},
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddSkill();
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bacarıqlar
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Mühəndislik və informasiya texnologiyaları sahəsi üzrə texniki
        bacarıqlarınızı, biliklərinizi və praktiki təcrübələrinizi qeyd edin.
      </Typography>

      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 3 }}>
        <TextField
          label="Bacarıq əlavə edin"
          value={skillInput}
          onChange={onSkillInputChange}
          onKeyDown={handleKeyDown}
          fullWidth
          error={!!errors.skills}
          helperText={errors.skills}
          placeholder="Məsələn: Python, Liderlik, Layihə idarəetməsi..."
        />
        <IconButton
          color="primary"
          onClick={onAddSkill}
          disabled={!skillInput.trim()}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": {
              bgcolor: "grey.300",
              color: "grey.500",
            },
            mt: 1,
          }}
          size="large"
        >
          <Add />
        </IconButton>
      </Stack>

      {skills.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderColor: "grey.200",
            bgcolor: "grey.50",
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Əlavə edilmiş bacarıqlar ({skills.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {skills.map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                onDelete={() => onDeleteSkill(skill)}
                color="primary"
                variant="outlined"
                sx={{
                  fontWeight: 500,
                  "& .MuiChip-deleteIcon": {
                    color: "primary.main",
                  },
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {skills.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            borderColor: "grey.200",
            bgcolor: "grey.25",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Hələ heç bir bacarıq əlavə edilməyib. Yuxarıdakı sahədə
            bacarıqlarınızı yazın və əlavə edin.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SkillsStep;

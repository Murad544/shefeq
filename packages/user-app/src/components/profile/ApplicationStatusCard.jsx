import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { Box, Chip, Divider, Paper, Typography } from "@mui/material";

const ApplicationStatusCard = ({ applicationStatus }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Müraciət Statusu
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 1 }}
        >
          Hazırkı Status
        </Typography>
        <Chip
          label={applicationStatus?.current || "-"}
          sx={{
            bgcolor: "#E8F5E9",
            color: "#2e7d32",
            fontWeight: 600,
          }}
        />
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.5 }}
        >
          Təsdiqlənmə Tarixi
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {applicationStatus?.confirmationDate || "-"}
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mb: 0.5 }}
        >
          Uyğunluq
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 18, color: "#16a085" }} />
          <Typography variant="body1" fontWeight={500}>
            {applicationStatus?.compliance || "-"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ApplicationStatusCard;

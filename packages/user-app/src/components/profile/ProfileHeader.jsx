import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ profile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth token and redirect to login
    try {
      localStorage.removeItem("auth_token");
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        bgcolor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#FFE5E5",
            }}
            src={profile.avatar}
          >
            {profile.fullName.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="h5" fontWeight={600}>
              {profile.fullName}
            </Typography>
            <Chip
              label={profile.role}
              size="small"
              sx={{
                bgcolor: "#E3F2FD",
                color: "#1976d2",
                fontWeight: 500,
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {profile.institution}
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              MÜRACİƏT TARİXİ
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {profile.applicationStatus.applicationDate}
            </Typography>
            <Chip
              label={profile.applicationStatus.current}
              size="small"
              icon={<CheckCircleIcon />}
              sx={{
                mt: 1,
                bgcolor: "#E8F5E9",
                color: "#2e7d32",
                fontWeight: 600,
              }}
            />
          </Box>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{
              mt: 2,
              borderRadius: 2,
              boxShadow: 1,
              textTransform: "none",
              // make button a bit wider and slightly smaller text
              minWidth: 100,
              px: 2,
              fontSize: "0.9rem",
              "&:hover": {
                boxShadow: 3,
              },
            }}
            onClick={handleLogout}
          >
            Çıxış
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileHeader;

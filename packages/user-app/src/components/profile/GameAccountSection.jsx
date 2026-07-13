import { Games as GamesIcon, Timer as TimerIcon } from "@mui/icons-material";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import GameSessionsTable from "./GameSessionsTable";
import FlightActivitySection from "./FlightActivitySection";
import LevelsSection from "./LevelsSection";

const GameAccountSection = ({ gameAccount }) => {
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        bgcolor: "#E8F5E9",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <GamesIcon sx={{ mr: 1.5, color: "#2e7d32", fontSize: 24 }} />
        <Typography variant="h6" fontWeight={600}>
          Oyun Hesabı
        </Typography>
        <Chip
          label={gameAccount?.status || "N/A"}
          size="small"
          sx={{
            ml: "auto",
            bgcolor: gameAccount?.status === "AKTİV" ? "#4caf50" : "#9e9e9e",
            color: "white",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Game User ID and Play Time */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <TimerIcon sx={{ fontSize: 16, color: "#ff9800", mr: 0.5 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                ÜMUMİ OYNAMA VAXTI
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700}>
              {gameAccount?.totalPlayTime?.hours || 0} saat{" "}
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {gameAccount?.totalPlayTime?.minutes || 0} dəq
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* <FlightActivitySection sessions={gameAccount?.sessions} /> */}

      {/* Sessions Table */}
      <GameSessionsTable sessions={gameAccount?.sessions} />
    <LevelsSection />

    </Paper>

  );
};

export default GameAccountSection;

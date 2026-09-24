import {
  Games as GamesIcon,
  Timer as TimerIcon,
  FormatListNumbered as SessionsIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Box, Grid, Stack } from "@mui/material";
import GameSessionsTable from "./GameSessionsTable";
import LevelsSection from "./LevelsSection";
import { C, FONT, labelCaps } from "../../config/tokens";
import CountUp from "../military/CountUp";
import Panel from "../military/Panel";
import StatusLed from "../military/StatusLed";

const KpiTile = ({ icon, label, children, delay = 0 }) => (
  <Box
    sx={{
      height: "100%",
      p: 2.5,
      bgcolor: C.paperRaised,
      border: `1px solid ${C.rule}`,
      borderTop: `3px solid ${C.olive}`,
      animation: `sg-fade-up .5s ease ${delay}ms backwards`,
    }}
  >
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ ...labelCaps, fontSize: "0.7rem", color: C.textMuted, mb: 1.25, "& svg": { fontSize: 16, color: C.brassDark } }}
    >
      {icon}
      <span>{label}</span>
    </Stack>
    {children}
  </Box>
);

const GameAccountSection = ({ gameAccount }) => {
  const active = gameAccount?.status === "AKTİV";
  const sessions = gameAccount?.sessions || [];

  return (
    <>
      <Panel
        title="Oyun Hesabı"
        icon={<GamesIcon />}
        sx={{ mb: 3 }}
        actions={
          <StatusLed
            on={active}
            pulse={false}
            label={gameAccount?.status || "N/A"}
            labelSx={{ color: active ? C.green : C.textMuted, fontWeight: 600 }}
          />
        }
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <KpiTile icon={<TimerIcon />} label="Ümumi oynama vaxtı">
              <Box sx={{ fontFamily: FONT.mono, fontSize: "1.8rem", lineHeight: 1.1 }}>
                <CountUp value={gameAccount?.totalPlayTime?.hours || 0} />
                <Box component="span" sx={{ fontSize: "0.9rem", color: C.textMuted, ml: 0.75, mr: 1.5 }}>
                  saat
                </Box>
                <CountUp value={gameAccount?.totalPlayTime?.minutes || 0} />
                <Box component="span" sx={{ fontSize: "0.9rem", color: C.textMuted, ml: 0.75 }}>
                  dəq
                </Box>
              </Box>
            </KpiTile>
          </Grid>
          <Grid item xs={6} sm={4}>
            <KpiTile icon={<SessionsIcon />} label="Sessiyalar" delay={80}>
              <Box sx={{ fontFamily: FONT.mono, fontSize: "1.8rem", lineHeight: 1.1 }}>
                <CountUp value={sessions.length} />
              </Box>
            </KpiTile>
          </Grid>
          <Grid item xs={6} sm={4}>
            <KpiTile icon={<EventIcon />} label="Son sessiya" delay={160}>
              <Box sx={{ fontFamily: FONT.mono, fontSize: "1rem", lineHeight: 1.6 }}>
                {sessions[0]?.date || "—"}
              </Box>
            </KpiTile>
          </Grid>
        </Grid>

        {/* Sessions Table */}
        <GameSessionsTable sessions={gameAccount?.sessions} />
      </Panel>

      <LevelsSection />
    </>
  );
};

export default GameAccountSection;

// FlightActivitySection.jsx
import { Box, Grid, Paper, Typography, LinearProgress } from "@mui/material";
import dayjs from "dayjs";

const FlightActivitySection = ({ sessions }) => {
  const today = dayjs();
  const yesterday = today.subtract(1, "day");

  // Azerbaijani short day names
  const azWeekDays = ["Ç.a", "Çər", "C.a", "Cüm", "Ş", "B", "B.e"];

  // Initialize last 7 days array (0 = 6 days ago, 6 = today)
  const last7Days = Array(7).fill(0);
  let todaySeconds = 0;
  let yesterdaySeconds = 0;
  let weekSeconds = 0;
  let monthSeconds = 0;

  sessions.forEach((s) => {
    const start = dayjs(s.session_started_at);
    const duration = s.duration_seconds || 0;

    const diffDays = today.diff(start, "day");

    // Last 7 days
    if (diffDays >= 0 && diffDays < 7) {
      last7Days[6 - diffDays] += duration;
      weekSeconds += duration;
    }

    // Today / Yesterday
    if (start.isSame(today, "day")) todaySeconds += duration;
    if (start.isSame(yesterday, "day")) yesterdaySeconds += duration;

    // This month
    if (start.isSame(today, "month")) monthSeconds += duration;
  });

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h} saat ${m} dəq`;
  };

  const maxDay = Math.max(...last7Days, 1); // avoid division by zero

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "#E3F2FD" }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Uçuş Aktivliyi
      </Typography>

      {/* Summary */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption">Bu gün</Typography>
          <Typography fontWeight={700}>{formatTime(todaySeconds)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption">Dünən</Typography>
          <Typography fontWeight={700}>{formatTime(yesterdaySeconds)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption">Bu həftə</Typography>
          <Typography fontWeight={700}>{formatTime(weekSeconds)}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="caption">Bu ay</Typography>
          <Typography fontWeight={700}>{formatTime(monthSeconds)}</Typography>
        </Grid>
      </Grid>

      {/* Last 7 days bars */}
      <Box>
        {last7Days.map((sec, i) => {
          const dayIndex = dayjs().subtract(6 - i, "day").day();
          return (
            <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ width: 30, fontSize: 12, color: "text.secondary" }}>
                {azWeekDays[dayIndex]}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(sec / maxDay) * 100}
                sx={{ flex: 1, height: 8, borderRadius: 5, ml: 1 }}
              />
              <Typography sx={{ width: 50, fontSize: 12, ml: 1 }}>
                {Math.floor(sec / 60)} dəq
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default FlightActivitySection;
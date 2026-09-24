// FlightActivitySection.jsx
import { Box, Grid } from "@mui/material";
import { FlightTakeoff as FlightIcon } from "@mui/icons-material";
import dayjs from "dayjs";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import Panel from "../military/Panel";

const FlightActivitySection = ({ sessions }) => {
  const today = dayjs();
  const yesterday = today.subtract(1, "day");

  // Azerbaijani short day names, indexed by dayjs().day() (0 = Sunday)
  const azWeekDays = ["B", "B.e", "Ç.a", "Çər", "C.a", "Cüm", "Ş"];

  // Initialize last 7 days array (0 = 6 days ago, 6 = today)
  const last7Days = Array(7).fill(0);
  let todaySeconds = 0;
  let yesterdaySeconds = 0;
  let weekSeconds = 0;
  let monthSeconds = 0;

  (sessions || []).forEach((s) => {
    const start = dayjs(s.session_started_at);
    const duration = s.duration_seconds || 0;

    // Calendar-day difference, so late-evening sessions land in the right bar
    const diffDays = today.startOf("day").diff(start.startOf("day"), "day");

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

  const summary = [
    { label: "Bu gün", value: todaySeconds },
    { label: "Dünən", value: yesterdaySeconds },
    { label: "Bu həftə", value: weekSeconds },
    { label: "Bu ay", value: monthSeconds },
  ];

  return (
    <Panel title="Uçuş Aktivliyi" icon={<FlightIcon />} sx={{ mb: 3 }}>
      {/* Summary */}
      <Grid
        container
        sx={{ mb: 3.5, border: `1px solid ${C.rule}`, "& > .MuiGrid-item": { p: 2 } }}
      >
        {summary.map((item, index) => (
          <Grid
            item
            xs={6}
            sm={3}
            key={item.label}
            sx={{
              borderLeft: { sm: index ? `1px solid ${C.rule}` : "none" },
              borderTop: { xs: index > 1 ? `1px solid ${C.rule}` : "none", sm: "none" },
              borderRight: { xs: index % 2 === 0 ? `1px solid ${C.rule}` : "none", sm: "none" },
            }}
          >
            <Box sx={{ ...labelCaps, fontSize: "0.68rem", color: C.textMuted }}>{item.label}</Box>
            <Box sx={{ fontFamily: FONT.mono, fontSize: "0.98rem", fontWeight: 600, mt: 0.5 }}>
              {formatTime(item.value)}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Last 7 days bars */}
      <Box sx={{ ...labelCaps, fontSize: "0.7rem", color: C.textMuted, mb: 1.5 }}>
        Son 7 gün · dəqiqə
      </Box>
      <Box
        sx={{
          position: "relative",
          height: 180,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: { xs: 1, sm: 2 },
          alignItems: "end",
          borderBottom: `2px solid ${C.text}`,
          backgroundImage: `linear-gradient(${C.rule} 1px, transparent 1px)`,
          backgroundSize: "100% 25%",
          backgroundPosition: "0 0",
        }}
      >
        {last7Days.map((sec, i) => {
          const pct = Math.max((sec / maxDay) * 100, sec > 0 ? 3 : 1);
          const isToday = i === 6;
          return (
            // Plot area leaves 22px of headroom so the value label never
            // shrinks the bar; bars scale against the same full height.
            <Box key={i} sx={{ position: "relative", height: "100%" }}>
              <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 22 }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: `calc(${pct}% + 4px)`,
                    textAlign: "center",
                    fontFamily: FONT.mono,
                    fontSize: "0.7rem",
                    color: C.textMuted,
                  }}
                >
                  {Math.floor(sec / 60)}
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "100%",
                    maxWidth: 44,
                    height: `${pct}%`,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      bgcolor: isToday ? C.brass : C.olive,
                      opacity: sec > 0 ? 1 : 0.25,
                      transformOrigin: "bottom",
                      animation: `sg-grow-y .7s ${EASE.out} ${i * 60}ms backwards`,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: { xs: 1, sm: 2 }, mt: 1 }}>
        {last7Days.map((_, i) => {
          const dayIndex = dayjs().subtract(6 - i, "day").day();
          return (
            <Box
              key={i}
              sx={{
                textAlign: "center",
                fontFamily: FONT.mono,
                fontSize: "0.72rem",
                color: i === 6 ? C.brassDark : C.textMuted,
                fontWeight: i === 6 ? 600 : 400,
              }}
            >
              {azWeekDays[dayIndex]}
            </Box>
          );
        })}
      </Box>
    </Panel>
  );
};

export default FlightActivitySection;

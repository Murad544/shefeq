import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  EmojiEvents as EmojiEventsIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  FlagOutlined as FlagIcon,
  TrendingUp as TrendingUpIcon,
  Timer as TimerIcon,
  Map as MapIcon,
} from "@mui/icons-material";
import { apiClient } from "../../services/api/apiClient";
import { endpoints } from "../../services/api/endpoints";
import { INITIAL_LEVELS_DATA, MAPS } from "../../constants/maps";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import CornerBrackets from "../military/CornerBrackets";
import CountUp from "../military/CountUp";
import Panel from "../military/Panel";
import SegmentedProgress from "../military/SegmentedProgress";
import TacticalBackground from "../military/TacticalBackground";

// const ACHIEVEMENTS = [
//   { id: 1, title: "Uçuş ustası", subtitle: "3 səviyyə tamamlandı", color: "#FFD700" },
//   { id: 2, title: "Çevik pilot", subtitle: "2 səviyyə 20 dəq-dən az", color: "#4CAF50" },
//   { id: 3, title: "Checkpoint master", subtitle: "8/8 checkpoint tamamlandı", color: "#2196F3" },
// ];

const STREAK = {
  current: 1,
  best: 1,
  note: "Son 1 gündür ardıcıl uçuş",
};

// Difficulty rendered as a four-bar threat meter
const DIFFICULTY = {
  Asan: { level: 1, color: C.greenLight },
  Orta: { level: 2, color: "#D9A441" },
  Çətin: { level: 3, color: "#D07A3A" },
  "Çox Çətin": { level: 4, color: C.redLight },
};

const formatBestTime = (seconds) =>
  seconds
    ? `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
    : null;

const MiniStat = ({ icon, label, value }) => (
  <Box sx={{ minWidth: 0 }}>
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ ...labelCaps, fontSize: "0.62rem", color: C.textMuted, "& svg": { fontSize: 13, color: C.brassDark } }}
    >
      {icon}
      <span>{label}</span>
    </Stack>
    <Box sx={{ fontFamily: FONT.mono, fontSize: "0.85rem", fontWeight: 600, mt: 0.25 }}>
      {value}
    </Box>
  </Box>
);

// Level Card Component
const LevelCard = ({ level, index }) => {
  const difficulty = DIFFICULTY[level.difficulty] || { level: 0, color: C.textOnDarkMuted };
  const bestTime = formatBestTime(level.bestTime);
  const status = level.completed
    ? { label: "Tamamlandı", bg: C.olive, color: C.paper }
    : level.timesPlayed > 0
      ? { label: "Davam etmək", bg: C.amber, color: C.ink }
      : { label: "Başlamadı", bg: C.paperSunk, color: C.textMuted };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: C.paperRaised,
        border: `1px solid ${level.completed ? C.olive : C.rule}`,
        transition: "border-color .25s, transform .25s, box-shadow .25s",
        animation: `sg-fade-up .5s ${EASE.out} ${index * 70}ms backwards`,
        "&:hover": {
          borderColor: C.brassDark,
          transform: "translateY(-3px)",
          boxShadow: "0 18px 30px -22px rgba(16, 21, 15, 0.6)",
        },
        "&:hover .sg-level-img": { transform: "scale(1.05)" },
      }}
    >
      {/* Level Image */}
      <Box sx={{ position: "relative", height: 160, overflow: "hidden", bgcolor: C.ink }}>
        <Box
          component="img"
          className="sg-level-img"
          src={level.image}
          alt={level.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform .6s ease",
            filter: level.timesPlayed > 0 ? "none" : "grayscale(0.45) brightness(0.85)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(11,15,10,.35) 0%, transparent 35%, rgba(11,15,10,.85) 100%)",
          }}
        />
        <CornerBrackets size={10} inset={8} color="rgba(232, 228, 212, 0.75)" />
        {level.completed && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 12,
              width: 30,
              height: 30,
              display: "grid",
              placeItems: "center",
              bgcolor: C.brass,
              color: C.ink,
              animation: "sg-scale-in .4s ease .3s backwards",
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 18 }} />
          </Box>
        )}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ position: "absolute", left: 14, bottom: 12 }}
        >
          <Stack direction="row" spacing="2px" alignItems="flex-end">
            {[1, 2, 3, 4].map((n) => (
              <Box
                key={n}
                sx={{
                  width: 5,
                  height: 5 + n * 3,
                  bgcolor: n <= difficulty.level ? difficulty.color : "rgba(232,228,212,.25)",
                }}
              />
            ))}
          </Stack>
          <Box sx={{ ...labelCaps, fontSize: "0.72rem", color: difficulty.color }}>
            {level.difficulty}
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2.25, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title & Description */}
        <Typography sx={{ fontFamily: FONT.serif, fontWeight: 600, fontSize: "1.08rem", lineHeight: 1.3, mb: 0.75 }}>
          {level.title}
        </Typography>
        <Typography variant="body2" sx={{ color: C.textMuted, mb: 2, flex: 1 }}>
          {level.description}
        </Typography>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            pt: 1.5,
            mb: 2,
            borderTop: `1px dashed ${C.ruleStrong}`,
          }}
        >
          <MiniStat icon={<PlayArrowIcon />} label="Oynandı" value={`${level.timesPlayed} dəfə`} />
          <MiniStat icon={<ScheduleIcon />} label="Müddət" value={level.duration} />
          <MiniStat icon={<FlagIcon />} label="Sınaq nöqtələri" value={level.checkpoints ?? "—"} />
          <MiniStat icon={<TimerIcon />} label="Ən yaxşı vaxt" value={bestTime || "—"} />
        </Box>

        {/* Status Badge */}
        <Box
          sx={{
            ...labelCaps,
            fontSize: "0.74rem",
            textAlign: "center",
            py: 0.75,
            bgcolor: status.bg,
            color: status.color,
          }}
        >
          {status.label}
        </Box>
      </Box>
    </Box>
  );
};

// Main Levels Section
const LevelsSection = ({ userRole }) => {
  const [levelsData, setLevelsData] = useState(INITIAL_LEVELS_DATA);
  const [streak, setStreak] = useState(STREAK);

  useEffect(() => {
    if (userRole === "trainer") return;

    const fetchMapStats = async () => {
      try {
        const response = await apiClient.get(endpoints.mapStats());
        const stats = response.stats || [];
        console.log("Stats data:", stats);

        const mapNameToLevelId = MAPS.reduce((mapIds, map) => {
          mapIds[map.code.toLowerCase()] = map.id;
          return mapIds;
        }, {});

        const updatedLevels = INITIAL_LEVELS_DATA.map((level) => {
          console.log(level);
          const stat = stats.find((s) => {
            const mapCode = s.map_code;
            return (
              s.map_id === level.id ||
              mapNameToLevelId[mapCode?.toLowerCase?.()] === level.id
            );
          });
          const timesPlayed = stat ? stat.times_played : level.timesPlayed;
          const checkpoints = stat?.required_orb_count ?? level.checkpoints;
          const objectiveTime =
            stat && stat.objective_time_seconds
              ? stat.objective_time_seconds
              : 0;
          const totalDuration = +timesPlayed * objectiveTime; // Total duration in seconds
          const deqiqe = Math.floor(totalDuration / 60);
          const saniye = totalDuration % 60;
          return {
            ...level,
            timesPlayed: timesPlayed,
            checkpoints,
            duration: `${deqiqe} dəq ${saniye} san`,
            bestTime:
              stat && stat.best_time_seconds
                ? Math.round(stat.best_time_seconds)
                : null,
            completed: stat && stat.times_played > 0 ? true : level.completed,
          };
        });
        console.log("Updated levels:", updatedLevels);
        setLevelsData(updatedLevels);
      } catch (error) {
        console.error("Failed to fetch map stats:", error);
      }
    };

    fetchMapStats();
  }, [userRole]);

  useEffect(() => {
    if (userRole === "trainer") return;

    const fetchStreak = async () => {
      try {
        const response = await apiClient.get(endpoints.streak());
        const streakData = response.streak || STREAK;
        console.log("Streak data:", streakData);
        setStreak({
          current: streakData.current_streak || 0,
          best: streakData.best_streak || 0,
          note: streakData.note || STREAK.note,
        });
      } catch (error) {
        console.error("Failed to fetch streak:", error);
        // Keep default STREAK if fetch fails
      }
    };

    fetchStreak();
  }, [userRole]);

  const completedLevels = levelsData.filter((l) => l.completed).length;
  const totalLevels = levelsData.length;
  const overallProgress = (completedLevels / totalLevels) * 100;
  const totalPlays = levelsData.reduce(
    (acc, l) => acc + Number(l.timesPlayed || 0),
    0,
  );

  const summaryStats = [
    { label: "Tamamlandı", value: completedLevels },
    { label: "Qalan", value: totalLevels - completedLevels },
    { label: "Cəmi Oynama", value: totalPlays },
  ];

  return (
    <Box sx={{ mt: 1 }}>
      {/* Progress Summary */}
      <Box
        sx={{
          position: "relative",
          bgcolor: C.field800,
          color: C.textOnDark,
          p: { xs: 2.5, sm: 3.5 },
          mb: 4,
          overflow: "hidden",
        }}
      >
        <TacticalBackground topo={false} />
        <Grid container spacing={3} alignItems="center" sx={{ position: "relative" }}>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <EmojiEventsIcon sx={{ color: C.brass, fontSize: 22 }} />
              <Box sx={{ ...labelCaps, fontSize: "0.85rem" }}>Səviyyə İrəliləyişi</Box>
            </Stack>
            <Box
              sx={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: { xs: "3.2rem", md: "4rem" },
                lineHeight: 1,
                color: C.brassLight,
                mt: 1.5,
              }}
            >
              <CountUp value={Math.round(overallProgress)} suffix="%" />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <SegmentedProgress
              value={overallProgress}
              segments={totalLevels * 4}
              height={14}
              tone="dark"
              label="Ümumi İrəliləyiş"
            />
            <Stack direction="row" sx={{ mt: 2.5, borderTop: `1px solid ${C.lineDark}` }}>
              {summaryStats.map((stat, i) => (
                <Box
                  key={stat.label}
                  sx={{ flex: 1, pt: 2, pl: i ? 2.5 : 0, borderLeft: i ? `1px solid ${C.lineDark}` : "none" }}
                >
                  <Box sx={{ fontFamily: FONT.mono, fontSize: "1.6rem", lineHeight: 1.1 }}>
                    <CountUp value={stat.value} />
                  </Box>
                  <Box sx={{ ...labelCaps, fontSize: "0.68rem", color: C.textOnDarkMuted, mt: 0.5 }}>
                    {stat.label}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <Typography variant="h6" component="h3">
          Levellər
        </Typography>
      </Stack>
      <Grid container spacing={2.5}>
        {levelsData.map((level, index) => (
          <Grid item xs={12} sm={6} md={4} key={level.id}>
            <LevelCard level={level} index={index} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Panel title="Səviyyə nəticələri" icon={<MapIcon />} noPadding sx={{ height: "100%" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small" sx={{ minWidth: 420 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Səviyyə</TableCell>
                    <TableCell>Ən yaxşı vaxt</TableCell>
                    <TableCell>Checkpoint</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {levelsData.map((level) => (
                    <TableRow key={level.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{level.title}</TableCell>
                      <TableCell sx={{ fontFamily: FONT.mono }}>
                        {formatBestTime(level.bestTime) || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontFamily: FONT.mono }}>{level.checkpoints ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Panel>
        </Grid>

        <Grid item xs={12} md={5}>
          <Panel title="Ardıcıllıq" icon={<TrendingUpIcon />} sx={{ height: "100%" }}>
            <Stack direction="row" alignItems="baseline" spacing={1.25}>
              <Box sx={{ fontFamily: FONT.serif, fontWeight: 700, fontSize: "3.6rem", lineHeight: 1, color: C.olive }}>
                <CountUp value={streak.current} />
              </Box>
              <Box sx={{ ...labelCaps, fontSize: "1rem", color: C.textMuted }}>gün</Box>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ my: 2 }}>
              {Array.from({ length: 7 }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    height: 10,
                    bgcolor: i < Math.min(streak.current, 7) ? C.olive : C.paperSunk,
                    transformOrigin: "left",
                    animation: `sg-draw-x .4s ease ${i * 70}ms backwards`,
                  }}
                />
              ))}
            </Stack>
            <Typography variant="body2" sx={{ color: C.textMuted, mb: 1.5 }}>
              {streak.note}
            </Typography>
            <Box sx={{ pt: 1.5, borderTop: `1px dashed ${C.ruleStrong}`, fontSize: "0.9rem" }}>
              Ən yaxşı davamlılıq:{" "}
              <Box component="strong" sx={{ fontFamily: FONT.mono }}>
                {streak.best} gün
              </Box>
            </Box>
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LevelsSection;

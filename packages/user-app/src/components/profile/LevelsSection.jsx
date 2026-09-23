import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  EmojiEvents as EmojiEventsIcon,
  PlayArrow as PlayArrowIcon,
  Schedule as ScheduleIcon,
  FlagOutlined as FlagIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { apiClient } from "../../services/api/apiClient";
import { endpoints } from "../../services/api/endpoints";
import { MAP_DEFINITIONS } from "../../constants/maps";

const mapsById = Object.fromEntries(
  MAP_DEFINITIONS.map((map) => [map.id, map])
);

// Hardcoded level data
const INITIAL_LEVELS_DATA = [
  {
    id: 1,
    title: `Səviyyə 1: ${mapsById[1].name}`,
    description: "Binaların arasında sürətli naviqasiya.",
    image: mapsById[1].image,
    difficulty: "Asan",
    timesPlayed: 0,
    duration: 2,
    checkpoints: 9,
    completed: false,
    bestTime: null,
  },
  {
    id: 2,
    title: `Səviyyə 2: ${mapsById[2].name}`,
    description: "Meşəlik ərazidə daşların arasında manevr edərək uçuş.",
    image: mapsById[2].image,
    difficulty: "Orta",
    timesPlayed: 0,
    duration: 2,
    checkpoints: 9,
    completed: false,
    bestTime: null,
  },
  {
    id: 3,
    title: `Səviyyə 3: ${mapsById[3].name}`,
    description: "Qədim qala və divarların arasında manevr edərək uçuş.",
    image: mapsById[3].image,
    difficulty: "Çətin",
    timesPlayed: 0,
    duration: 3,
    checkpoints: 18,
    completed: false,
    bestTime: null,
  },
  {
    id: 4,
    title: `Səviyyə 4: ${mapsById[4].name}`,
    description: "Anbar və binaların ətrafında uçuş.",
    image: mapsById[4].image,
    difficulty: "Çətin",
    timesPlayed: 0,
    duration: 0,
    checkpoints: 12,
    completed: false,
    bestTime: null,
  },
  {
    id: 5,
    title: `Səviyyə 5: ${mapsById[5].name}`,
    description: "Meşə arasında manevrə edərək uç.",
    image: mapsById[5].image,
    difficulty: "Çox Çətin",
    timesPlayed: 0,
    duration: 40,
    checkpoints: 8,
    completed: false,
    bestTime: null,
  },
  {
    id: 6,
    title: `Səviyyə 6: ${mapsById[6].name}`,
    description: "Qədim qala və divarların arasında manevr edərək uçuş.",
    image: mapsById[6].image,
    difficulty: "Çox Çətin",
    timesPlayed: 0,
    duration: 0,
    checkpoints: 12,
    completed: false,
    bestTime: null,
  },
  {
    id: 7,
    title: `Səviyyə 7: ${mapsById[7].name}`,
    description: "Qaraj və ətrafında manevr edərək uçuş.",
    image: mapsById[7].image,
    difficulty: "Çox Çətin",
    timesPlayed: 0,
    duration: 0,
    checkpoints: 12,
    completed: false,
    bestTime: null,
  },
];

// const ACHIEVEMENTS = [
//   { id: 1, title: "Uçuş ustası", subtitle: "3 səviyyə tamamlandı", color: "#FFD700" },
//   { id: 2, title: "Çevik pilot", subtitle: "2 səviyyə 20 dəq-dən az", color: "#4CAF50" },
//   { id: 3, title: "Checkpoint master", subtitle: "8/8 checkpoint tamamlandı", color: "#2196F3" },
// ];

const ACHIEVEMENTS = [
  {
    id: 1,
    title: "Uçuş ustası",
    subtitle: "3 səviyyə tamamlandı",
    color: "#FFD700",
  },
  {
    id: 2,
    title: "Çevik pilot",
    subtitle: "2 səviyyə 20 dəq-dən az",
    color: "#4CAF50",
  },
  {
    id: 3,
    title: "Checkpoint master",
    subtitle: "8/8 checkpoint tamamlandı",
    color: "#2196F3",
  },
];

const STREAK = {
  current: 1,
  best: 1,
  note: "Son 1 gündür ardıcıl uçuş",
};

const LEVEL_RESULTS = [
  { id: 1, level: "Səviyyə 1", bestTime: "1:45", checkpointRate: "3/3" },
  { id: 2, level: "Səviyyə 2", bestTime: "2:30", checkpointRate: "4/4" },
  { id: 3, level: "Səviyyə 3", bestTime: "3:12", checkpointRate: "5/5" },
  { id: 4, level: "Səviyyə 4", bestTime: "4:25", checkpointRate: "6/6" },
  { id: 5, level: "Səviyyə 5", bestTime: "5:10", checkpointRate: "8/8" },
];

// const LEVEL_LEADERS = [
//   { id: 1, level: "Səviyyə 1", leaders: [{ name: "Rəşad", time: "09:32" }, { name: "Aylin", time: "10:18" }] },
//   { id: 2, level: "Səviyyə 2", leaders: [{ name: "Kamran", time: "14:20" }, { name: "Leyla", time: "15:05" }] },
//   { id: 3, level: "Səviyyə 3", leaders: [{ name: "Murad", time: "20:12" }, { name: "Nigar", time: "21:00" }] },
//   { id: 4, level: "Səviyyə 4", leaders: [{ name: "Sadiq", time: "28:39" }, { name: "Elvin", time: "29:05" }] },
//   { id: 5, level: "Səviyyə 5", leaders: [{ name: "Fərid", time: "36:40" }, { name: "Aynur", time: "38:20" }] },
// ];

// Difficulty color mapping
const getDifficultyColor = (difficulty) => {
  const colorMap = {
    Asan: "#4CAF50",
    Orta: "#FF9800",
    Çətin: "#FF5722",
    "Çox Çətin": "#9C27B0",
  };
  return colorMap[difficulty] || "#757575";
};

// Level Card Component
const LevelCard = ({ level }) => {
  const bgGradient = level.completed
    ? "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)"
    : "linear-gradient(135deg, rgba(200, 200, 200, 0.1) 0%, rgba(200, 200, 200, 0.05) 100%)";

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        background: bgGradient,
        border: `1px solid ${level.completed ? "#4CAF50" : "#e0e0e0"}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Level Image */}
      <CardMedia
        component="img"
        height="150"
        image={level.image}
        alt={level.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ pb: 2 }}>
        {/* Title & Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {level.title}
          </Typography>
          {level.completed && (
            <EmojiEventsIcon
              sx={{ color: "#FFD700", fontSize: "1.5rem", ml: 1 }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ color: "#666", mb: 2, fontStyle: "italic" }}
        >
          {level.description}
        </Typography>

        {/* Difficulty Chip */}
        <Chip
          label={level.difficulty}
          size="small"
          sx={{
            backgroundColor: getDifficultyColor(level.difficulty),
            color: "#ffffff",
            fontWeight: 600,
            mb: 2,
            borderRadius: 1,
          }}
        />

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            mb: 2,
          }}
        >
          {/* Times Played */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlayArrowIcon sx={{ fontSize: "1.2rem", color: "#5b7c99" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.7rem", color: "#666" }}
              >
                Oynandı
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {level.timesPlayed} dəfə
              </Typography>
            </Box>
          </Box>

          {/* Duration */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScheduleIcon sx={{ fontSize: "1.2rem", color: "#5b7c99" }} />
            <Box>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.7rem", color: "#666" }}
              >
                Müddət
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {level.duration}
              </Typography>
            </Box>
          </Box>

          {/* Checkpoints */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              gridColumn: "1 / -1",
            }}
          >
            <FlagIcon sx={{ fontSize: "1.2rem", color: "#5b7c99" }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.7rem", color: "#666" }}
              >
                Sınaq nöqtələri
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {level.checkpoints}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={level.completed ? 100 : 30}
                  sx={{
                    flex: 1,
                    ml: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#e0e0e0",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      background: `linear-gradient(90deg, #5b7c99 0%, #4a6a8a 100%)`,
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Best Time */}
          {level.bestTime && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                gridColumn: "1 / -1",
              }}
            >
              <ScheduleIcon sx={{ fontSize: "1.2rem", color: "#5b7c99" }} />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.7rem", color: "#666" }}
                >
                  Ən yaxşı vaxt
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {Math.floor(level.bestTime / 60)}:
                  {(level.bestTime % 60).toString().padStart(2, "0")}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Status Badge */}
        <Box sx={{ mt: 2 }}>
          {level.completed ? (
            <Chip
              label="Tamamlandı"
              size="small"
              sx={{
                backgroundColor: "#4CAF50",
                color: "#ffffff",
                fontWeight: 600,
                width: "100%",
                borderRadius: 1,
              }}
            />
          ) : level.timesPlayed > 0 ? (
            <Chip
              label="Davam etmək"
              size="small"
              sx={{
                backgroundColor: "#FF9800",
                color: "#ffffff",
                fontWeight: 600,
                width: "100%",
                borderRadius: 1,
              }}
            />
          ) : (
            <Chip
              label="Başlamadı"
              size="small"
              sx={{
                backgroundColor: "#9E9E9E",
                color: "#ffffff",
                fontWeight: 600,
                width: "100%",
                borderRadius: 1,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
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

        const mapNameToLevelId = MAP_DEFINITIONS.reduce((mapIds, map) => {
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

  return (
    <Box sx={{ mt: 3 }}>
      {/* Progress Summary */}
      <Card
        sx={{
          p: 3,
          mb: 4,
          background: "linear-gradient(135deg, #5b7c99 0%, #4a6a8a 100%)",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EmojiEventsIcon sx={{ mr: 1.5, fontSize: "1.8rem" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Səviyyə İrəliləyişi
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle2">Ümumi İrəliləyiş</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {overallProgress.toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 6,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {completedLevels}
            </Typography>
            <Typography variant="caption">Tamamlandı</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalLevels - completedLevels}
            </Typography>
            <Typography variant="caption">Qalan</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {levelsData.reduce(
                (acc, l) => acc + Number(l.timesPlayed || 0),
                0,
              )}
            </Typography>
            <Typography variant="caption">Cəmi Oynama</Typography>
          </Box>
        </Box>
      </Card>

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Levellər
      </Typography>
      <Grid container spacing={3}>
        {levelsData.map((level) => (
          <Grid item xs={12} sm={6} md={4} key={level.id}>
            <LevelCard level={level} />
          </Grid>
        ))}
      </Grid>

      {/* <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              p: 3,
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(66, 165, 245, 0.18)",
              boxShadow: "0 18px 48px rgba(54,79,107,0.14)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <StarIcon sx={{ color: "#FFD700", mr: 1.5, fontSize: "1.6rem" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Uğurlar
              </Typography>
            </Box>
            {ACHIEVEMENTS.map((achievement) => (
              <Box
                key={achievement.id}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 3,
                  background: `${achievement.color}18`,
                  border: `1px solid ${achievement.color}40`,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {achievement.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#455A64" }}>
                  {achievement.subtitle}
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid> */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              p: 3,
              background: "rgba(18, 52, 86, 0.94)",
              color: "white",
              boxShadow: "0 18px 48px rgba(0,0,0,0.18)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PersonIcon
                sx={{ color: "#64B5F6", mr: 1.5, fontSize: "1.6rem" }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Səviyyə nəticələri
              </Typography>
            </Box>
            {levelsData.map((level, index) => (
              <Box
                key={level.id}
                sx={{
                  mb: index < levelsData.length - 1 ? 2 : 0,
                  p: 2,
                  borderRadius: 3,
                  background:
                    index % 2 === 0
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.12)",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 0.5, color: "#E3F2FD" }}
                >
                  {level.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#BBDEFB" }}>
                  Ən yaxşı vaxt:{" "}
                  <strong>
                    {level.bestTime
                      ? `${Math.floor(level.bestTime / 60)}:${(level.bestTime % 60).toString().padStart(2, "0")}`
                      : "N/A"}
                  </strong>
                </Typography>
                <Typography variant="body2" sx={{ color: "#90CAF9" }}>
                  Checkpoint: <strong>{level.checkpoints}</strong>
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "40%",
              borderRadius: 3,
              p: 3,
              background:
                "linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,255,255,0.95))",
              border: "1px solid rgba(76,175,80,0.24)",
              boxShadow: "0 18px 48px rgba(76,175,80,0.14)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <TrendingUpIcon
                sx={{ color: "#4CAF50", mr: 1.5, fontSize: "1.6rem" }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Ardıcıllıq
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "#2E7D32", mb: 1 }}
            >
              {streak.current} gün
            </Typography>
            <Typography variant="body2" sx={{ color: "#37474F", mb: 2 }}>
              {streak.note}
            </Typography>
            <Typography variant="body2" sx={{ color: "#546E7A" }}>
              Ən yaxşı davamlılıq: <strong>{streak.best} gün</strong>
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LevelsSection;

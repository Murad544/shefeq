import {
  Alert,
  Box,
  ButtonBase,
  CircularProgress,
  Collapse,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  PlayCircle as PlayCircleIcon,
  PictureAsPdf as PictureAsPdfIcon,
  HelpOutline as HelpOutlineIcon,
  FitnessCenter as FitnessCenterIcon,
  School as SchoolIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { endpoints } from "../../services/api/endpoints";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import CountUp from "../military/CountUp";
import RadarLoader from "../military/RadarLoader";
import SegmentedProgress from "../military/SegmentedProgress";
import TacticalBackground from "../military/TacticalBackground";

// Icons & labels
const CONTENT_TYPES = {
  video: { icon: PlayCircleIcon, color: C.red },
  pdf: { icon: PictureAsPdfIcon, color: C.amber },
  quiz: { icon: HelpOutlineIcon, color: C.blue },
  practice: { icon: FitnessCenterIcon, color: C.olive },
};

const getContentIcon = (type) => {
  const meta = CONTENT_TYPES[type];
  if (!meta) return null;
  const Icon = meta.icon;
  return <Icon sx={{ color: meta.color, fontSize: 20 }} />;
};

const getContentTypeLabel = (type) => {
  const labels = {
    video: "Video",
    pdf: "PDF",
    quiz: "Test",
    practice: "Praktika",
  };
  return labels[type] || type;
};

// Single module card
const ModuleItem = ({
  module,
  index,
  onToggleLessonCompletion,
  submitting,
  submittingLessonId,
}) => {
  const [expanded, setExpanded] = useState(module.isExpanded);
  const completedCount = module.lessons.filter((l) => l.completed).length;
  const totalCount = module.lessons.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;
  const done = totalCount > 0 && completedCount === totalCount;

  return (
    <Box
      sx={{
        mb: 2,
        bgcolor: C.paperRaised,
        border: `1px solid ${expanded ? C.ruleStrong : C.rule}`,
        transition: "border-color .2s",
        animation: `sg-fade-up .5s ${EASE.out} ${index * 70}ms backwards`,
      }}
    >
      <ButtonBase
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          p: { xs: 2, sm: 2.5 },
          textAlign: "left",
          "&:hover": { bgcolor: "rgba(201, 166, 70, 0.05)" },
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            bgcolor: done ? C.olive : C.paperSunk,
            color: done ? C.paper : C.text,
            border: `1px solid ${done ? C.olive : C.ruleStrong}`,
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: "1.05rem",
          }}
        >
          {done ? <CheckIcon /> : index + 1}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{ fontFamily: FONT.serif, fontWeight: 600, fontSize: "1.15rem", lineHeight: 1.3 }}
          >
            {module.title}
          </Typography>
          <Box sx={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.textMuted, mt: 0.25 }}>
            {completedCount}/{totalCount}
          </Box>
        </Box>
        <Box sx={{ width: { xs: "calc(100% - 56px)", sm: 180 }, ml: { xs: 8, sm: 0 } }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
            <Box sx={{ ...labelCaps, fontSize: "0.68rem", color: C.textMuted }}>
              İrəliləyiş
            </Box>
            <Box sx={{ fontFamily: FONT.mono, fontSize: "0.72rem" }}>
              {progress.toFixed(0)}%
            </Box>
          </Stack>
          <SegmentedProgress value={progress} segments={10} height={6} gap={2} />
        </Box>
        <ExpandMoreIcon
          sx={{
            color: C.textMuted,
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
          }}
        />
      </ButtonBase>

      <Collapse in={expanded}>
        <Box sx={{ borderTop: `1px solid ${C.rule}` }}>
          {module.lessons.map((lesson, lessonIndex) => {
            const busy = submitting && submittingLessonId === lesson.id;
            return (
              <Stack
                key={lesson.id}
                direction="row"
                alignItems="center"
                spacing={1.75}
                sx={{
                  pl: { xs: 2, sm: 3 },
                  pr: 2,
                  py: 1.5,
                  borderTop: lessonIndex ? `1px dashed ${C.rule}` : "none",
                  bgcolor: lesson.completed ? "rgba(75, 83, 32, 0.05)" : "transparent",
                  transition: "background-color .3s",
                }}
              >
                <ButtonBase
                  aria-label={lesson.completed ? "Tamamlanmamış kimi qeyd et" : "Tamamlanmış kimi qeyd et"}
                  onClick={() =>
                    !submitting &&
                    onToggleLessonCompletion(
                      module.id,
                      lesson.id,
                      lesson.completed,
                    )
                  }
                  sx={{
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    border: `2px solid ${lesson.completed ? C.olive : C.ruleStrong}`,
                    bgcolor: lesson.completed ? C.olive : C.paperRaised,
                    color: C.paper,
                    cursor: submitting ? "default" : "pointer",
                    transition: "background-color .2s, border-color .2s",
                    "&:hover": { borderColor: C.olive },
                  }}
                >
                  {busy ? (
                    <CircularProgress size={14} sx={{ color: lesson.completed ? C.paper : C.olive }} />
                  ) : lesson.completed ? (
                    <CheckIcon sx={{ fontSize: 18, animation: "sg-scale-in .25s ease backwards" }} />
                  ) : null}
                </ButtonBase>

                <Box sx={{ display: "flex", flexShrink: 0 }}>{getContentIcon(lesson.type)}</Box>

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    cursor: lesson.link ? "pointer" : "default",
                  }}
                  onClick={() =>
                    lesson.link && window.open(lesson.link, "_blank")
                  }
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textDecoration: lesson.completed ? "line-through" : "none",
                      color: lesson.completed
                        ? C.textFaint
                        : lesson.link
                          ? C.olive
                          : C.text,
                      "&:hover": lesson.link
                        ? { color: C.oliveDark, textDecoration: "underline" }
                        : {},
                    }}
                  >
                    {lesson.title}
                    {lesson.link && !lesson.completed && (
                      <OpenInNewIcon sx={{ fontSize: 14, ml: 0.75, verticalAlign: "-2px" }} />
                    )}
                  </Typography>
                  <Box sx={{ ...labelCaps, fontSize: "0.66rem", color: C.textMuted }}>
                    {getContentTypeLabel(lesson.type)}
                  </Box>
                </Box>

                {lesson.completed && (
                  <Box
                    sx={{
                      ...labelCaps,
                      fontSize: "0.68rem",
                      color: C.olive,
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    Tamamlanmış
                  </Box>
                )}
              </Stack>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

const SummaryStat = ({ label, value, first }) => (
  <Box
    sx={{
      flex: 1,
      pt: 2,
      pl: first ? 0 : 2.5,
      borderLeft: first ? "none" : `1px solid ${C.lineDark}`,
    }}
  >
    <Box sx={{ fontFamily: FONT.mono, fontSize: "1.6rem", color: C.textOnDark, lineHeight: 1.1 }}>
      <CountUp value={value} />
    </Box>
    <Box sx={{ ...labelCaps, fontSize: "0.68rem", color: C.textOnDarkMuted, mt: 0.5 }}>
      {label}
    </Box>
  </Box>
);

// Main Section
const TrainingProgressSection = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittingLessonId, setSubmittingLessonId] = useState(null);

  const fetchModules = async () => {
    try {
      const response = await apiClient.get(endpoints.trainingModules());
      setModules(response.modules || []);
    } catch (err) {
      console.error("Failed to fetch training modules:", err);
      setError("Təlim modulları yüklənmədi.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLessonCompletion = async (
    moduleId,
    lessonId,
    currentCompleted,
  ) => {
    if (submitting) return;

    // keep previous state for rollback
    const prevModules = modules;

    // optimistic update
    const newModules = modules.map((m) => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !currentCompleted } : l,
        ),
      };
    });

    setModules(newModules);
    setSubmitting(true);
    setSubmittingLessonId(lessonId);

    try {
      await apiClient.post(endpoints.setLessonProgress(lessonId), {
        completed: !currentCompleted,
      });

      // keep optimistic UI but sync with server to ensure consistency
      await fetchModules();
    } catch (err) {
      console.error("Failed to update lesson progress:", err);
      // rollback optimistic update
      setModules(prevModules);
    } finally {
      setSubmitting(false);
      setSubmittingLessonId(null);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0,
  );
  const overallProgress = totalLessons
    ? (completedLessons / totalLessons) * 100
    : 0;

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <RadarLoader message="Yüklənir" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
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
              <SchoolIcon sx={{ color: C.brass, fontSize: 22 }} />
              <Box sx={{ ...labelCaps, fontSize: "0.85rem" }}>Ümumi İrəliləyiş</Box>
            </Stack>
            <Box
              sx={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: { xs: "3.4rem", md: "4.2rem" },
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
              segments={30}
              height={14}
              tone="dark"
              label="Ümumi İrəliləyiş"
            />
            <Stack direction="row" sx={{ mt: 2.5, borderTop: `1px solid ${C.lineDark}` }}>
              <SummaryStat first label="Tamamlanmış" value={completedLessons} />
              <SummaryStat label="Cəmi dərs" value={totalLessons} />
              <SummaryStat label="Modullar" value={modules.length} />
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {/* Modules */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3">
            Tədris Modulları
          </Typography>
        </Stack>
        {modules.map((module, index) => (
          <ModuleItem
            key={module.id}
            module={module}
            index={index}
            onToggleLessonCompletion={handleToggleLessonCompletion}
            submitting={submitting}
            submittingLessonId={submittingLessonId}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TrainingProgressSection;

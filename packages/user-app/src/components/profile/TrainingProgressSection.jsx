import {
  Box,
  Card,
  Typography,
  LinearProgress,
  CircularProgress,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PlayCircle as PlayCircleIcon,
  PictureAsPdf as PictureAsPdfIcon,
  HelpOutline as HelpOutlineIcon,
  FitnessCenter as FitnessCenterIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { apiClient } from "../../services/api/apiClient";
import { endpoints } from "../../services/api/endpoints";

// Icons & labels
const getContentIcon = (type) => {
  switch (type) {
    case "video":
      return <PlayCircleIcon sx={{ color: "#FF6B6B", mr: 1 }} />;
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#FFA500", mr: 1 }} />;
    case "quiz":
      return <HelpOutlineIcon sx={{ color: "#4ECDC4", mr: 1 }} />;
    case "practice":
      return <FitnessCenterIcon sx={{ color: "#45B7D1", mr: 1 }} />;
    default:
      return null;
  }
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
  onToggleLessonCompletion,
  submitting,
  submittingLessonId,
}) => {
  const [expanded, setExpanded] = useState(module.isExpanded);
  const completedCount = module.lessons.filter((l) => l.completed).length;
  const totalCount = module.lessons.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card
      sx={{ mb: 2, border: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
            {module.title}
          </Typography>
          <Chip
            label={`${completedCount}/${totalCount}`}
            size="small"
            variant="outlined"
            sx={{ mr: 2 }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: 150 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                İrəliləyiş
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  background:
                    "linear-gradient(90deg, #5b7c99 0%, #4a6a8a 100%)",
                },
              }}
            />
          </Box>
          <IconButton
            size="small"
            sx={{
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <List sx={{ p: 0 }}>
          {module.lessons.map((lesson, index) => (
            <ListItem
              key={lesson.id}
              sx={{
                pl: 4,
                pr: 2,
                py: 1.5,
                backgroundColor: lesson.completed ? "#f5f5f5" : "transparent",
                borderBottom:
                  index < module.lessons.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  cursor: submitting ? "default" : "pointer",
                }}
                onClick={() =>
                  !submitting &&
                  onToggleLessonCompletion(
                    module.id,
                    lesson.id,
                    lesson.completed,
                  )
                }
              >
                {submitting && submittingLessonId === lesson.id ? (
                  <CircularProgress size={20} />
                ) : lesson.completed ? (
                  <CheckCircleIcon
                    sx={{ color: "#5b7c99", fontSize: "1.5rem" }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ color: "#bdbdbd", fontSize: "1.5rem" }}
                  />
                )}
              </ListItemIcon>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  cursor: lesson.link ? "pointer" : "default",
                }}
                onClick={() =>
                  lesson.link && window.open(lesson.link, "_blank")
                }
              >
                {getContentIcon(lesson.type)}
                <ListItemText
                  primary={lesson.title}
                  secondary={getContentTypeLabel(lesson.type)}
                  primaryTypographyProps={{
                    sx: {
                      textDecoration: lesson.completed
                        ? "line-through"
                        : lesson.link
                          ? "underline"
                          : "none",
                      color: lesson.completed
                        ? "#9e9e9e"
                        : lesson.link
                          ? "#1976d2"
                          : "#333",
                      "&:hover": lesson.link ? { color: "#1565c0" } : {},
                    },
                  }}
                  secondaryTypographyProps={{ sx: { fontSize: "0.75rem" } }}
                />
              </Box>
              {lesson.completed && (
                <Typography
                  variant="caption"
                  sx={{ ml: 2, color: "#5b7c99", fontWeight: 500 }}
                >
                  Tamamlanmış
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};

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

  const handleToggleLessonCompletion = async (moduleId, lessonId, currentCompleted) => {
    if (submitting) return;

    // keep previous state for rollback
    const prevModules = modules;

    // optimistic update
    const newModules = modules.map((m) => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        lessons: m.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !currentCompleted } : l
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
      <Box sx={{ mt: 3 }}>
        <Typography>Yüklənir...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Progress Summary */}
      <Card
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #5b7c99 0%, #4a6a8a 100%)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SchoolIcon sx={{ mr: 1.5, fontSize: "1.8rem" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            İrəliləyiş
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

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {completedLessons}
              </Typography>
              <Typography variant="caption">Tamamlanmış</Typography>
              <Typography variant="caption" sx={{ display: "block" }}>
                ({completedLessons} / {totalLessons})
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Modules */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Tədris Modulları
        </Typography>
        {modules.map((module) => (
          <ModuleItem
            key={module.id}
            module={module}
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

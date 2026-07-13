import {
  Box,
  Card,
  Typography,
  LinearProgress,
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
import { useState } from "react";

// Hardcoded lessons & videos
const INITIAL_TRAINING_MODULES = [
  {
    id: 1,
    title: "FPV Dərslik",
    isExpanded: true,
    lessons: [
      { id: 1, title: "Pilotsuz uçuş aparatlarının idarə edilməsi kursu", type: "pdf", completed: true, link: "https://drive.google.com/file/d/1IMN1yUwn_XKy3uGhXKWFeBJRh17qIzis/view?usp=sharing" },
      { id: 2, title: "Kamikadze FPV dronları", type: "pdf", completed: true, link: "https://drive.google.com/file/d/1Mtlf5QTcnGjVWIfvakR1tIxt26I6swIL/view?usp=sharing" },
      { id: 3, title: "FPV sisteminin komponentləri", type: "pdf", completed: true, link: "https://drive.google.com/file/d/10wwTCVsBbBWD_wUH-HLo2ELxBI05wDzp/view?usp=sharing" },
      { id: 4, title: "Simulyasiya təlimləri və Master-Slave idarəetmə sistemi", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1kdpUGurz2bYz0o3yz5QDQkmSe0Xb8dNl/view?usp=sharing" },
      { id: 5, title: "Təhlükəsizlik qaydaları və texniki qulluq", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1XXKRr7k1EeO7fn6Ke9vBYiX7hdj_pVKa/view?usp=sharing" },
      { id: 6, title: "Uçuş prinsipləri, kvadrokopter uçuşunun fiziki prinsipləri", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1trJrAius9OCZFckZEQyrhgBqsRDc-QYH/view?usp=sharing" },
      { id: 7, title: "Uçuş dinamikası", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1HpMRQ2oprUDADGhyzHsqEPYGEHVJU8th/view?usp=sharing" },
      { id: 8, title: "Batareyalar və sensorlar", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1Ci7Ix-NnlCUEyHlDk_b3p6z54RRz2SQX/view?usp=sharing" },
      { id: 9, title: "Proqram təminatı", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1MZ1WOMnsUrGsfNj68C2bt1YB7Au8S4Gk/view?usp=sharing" },
      { id: 10, title: "Uçuşa hazırlıq", type: "pdf", completed: false, link: "https://drive.google.com/file/d/1DoJpteLGTCj72q8ZQUPOkaPHIuxSbUSp/view?usp=sharing" },
    ],
  },
  {
    id: 2,
    title: "Video Təlimlər",
    isExpanded: false,
    lessons: [
      { id: 1, title: "Manual Uçuş", type: "video", completed: false, link: null },
      { id: 2, title: "Hover Praktikası", type: "video", completed: false, link: null },
      { id: 3, title: "Waypoint Planlaması", type: "video", completed: false, link: null },
    ],
  },
];

// Icons & labels
const getContentIcon = (type) => {
  switch (type) {
    case "video": return <PlayCircleIcon sx={{ color: "#FF6B6B", mr: 1 }} />;
    case "pdf": return <PictureAsPdfIcon sx={{ color: "#FFA500", mr: 1 }} />;
    case "quiz": return <HelpOutlineIcon sx={{ color: "#4ECDC4", mr: 1 }} />;
    case "practice": return <FitnessCenterIcon sx={{ color: "#45B7D1", mr: 1 }} />;
    default: return null;
  }
};

const getContentTypeLabel = (type) => {
  const labels = { video: "Video", pdf: "PDF", quiz: "Test", practice: "Praktika" };
  return labels[type] || type;
};

// Single module card
const ModuleItem = ({ module, onToggleLessonCompletion }) => {
  const [expanded, setExpanded] = useState(module.isExpanded);
  const completedCount = module.lessons.filter((l) => l.completed).length;
  const totalCount = module.lessons.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card sx={{ mb: 2, border: "1px solid #e0e0e0", backgroundColor: "#ffffff" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>{module.title}</Typography>
          <Chip label={`${completedCount}/${totalCount}`} size="small" variant="outlined" sx={{ mr: 2 }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ width: 150 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>İrəliləyiş</Typography>
              <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>{progress.toFixed(0)}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3, backgroundColor: "#e0e0e0", "& .MuiLinearProgress-bar": { borderRadius: 3, background: "linear-gradient(90deg, #5b7c99 0%, #4a6a8a 100%)" } }}
            />
          </Box>
          <IconButton size="small" sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>
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
              sx={{ pl: 4, pr: 2, py: 1.5, backgroundColor: lesson.completed ? "#f5f5f5" : "transparent", borderBottom: index < module.lessons.length - 1 ? "1px solid #eee" : "none" }}
            >
              <ListItemIcon sx={{ minWidth: 32, cursor: "pointer" }} onClick={() => onToggleLessonCompletion(module.id, lesson.id)}>
                {lesson.completed ? <CheckCircleIcon sx={{ color: "#5b7c99", fontSize: "1.5rem" }} /> : <RadioButtonUncheckedIcon sx={{ color: "#bdbdbd", fontSize: "1.5rem" }} />}
              </ListItemIcon>
              <Box sx={{ display: "flex", alignItems: "center", flex: 1, cursor: lesson.link ? "pointer" : "default" }} onClick={() => lesson.link && window.open(lesson.link, "_blank")}>
                {getContentIcon(lesson.type)}
                <ListItemText
                  primary={lesson.title}
                  secondary={getContentTypeLabel(lesson.type)}
                  primaryTypographyProps={{ sx: { textDecoration: lesson.completed ? "line-through" : lesson.link ? "underline" : "none", color: lesson.completed ? "#9e9e9e" : lesson.link ? "#1976d2" : "#333", "&:hover": lesson.link ? { color: "#1565c0" } : {} } }}
                  secondaryTypographyProps={{ sx: { fontSize: "0.75rem" } }}
                />
              </Box>
              {lesson.completed && <Typography variant="caption" sx={{ ml: 2, color: "#5b7c99", fontWeight: 500 }}>Tamamlanmış</Typography>}
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Card>
  );
};

// Main Section
const TrainingProgressSection = () => {
  const [modules, setModules] = useState(INITIAL_TRAINING_MODULES);

  const handleToggleLessonCompletion = (moduleId, lessonId) => {
    setModules((prev) =>
      prev.map((m) => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, completed: !l.completed } : l) } : m)
    );
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.lessons.filter(l => l.completed).length, 0);
  const overallProgress = totalLessons ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Box sx={{ mt: 3 }}>
      {/* Progress Summary */}
      <Card sx={{ p: 3, mb: 3, background: "linear-gradient(135deg, #5b7c99 0%, #4a6a8a 100%)", color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SchoolIcon sx={{ mr: 1.5, fontSize: "1.8rem" }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>İrəliləyiş</Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle2">Ümumi İrəliləyiş</Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{overallProgress.toFixed(0)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 12, borderRadius: 6, backgroundColor: "rgba(255, 255, 255, 0.3)", "& .MuiLinearProgress-bar": { borderRadius: 6, backgroundColor: "rgba(255, 255, 255, 0.9)" } }} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{completedLessons}</Typography>
              <Typography variant="caption">Tamamlanmış</Typography>
              <Typography variant="caption" sx={{ display: "block" }}>({completedLessons} / {totalLessons})</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{/*{modules.length}*/}10</Typography>
              <Typography variant="caption">Mövcud Dərslər</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{/*{modules.length}*/}3</Typography>
              <Typography variant="caption">Mövcud Videolar</Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Modules */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tədris Modulları</Typography>
        {modules.map((module) => (
          <ModuleItem key={module.id} module={module} onToggleLessonCompletion={handleToggleLessonCompletion} />
        ))}
      </Box>
    </Box>
  );
};

export default TrainingProgressSection;
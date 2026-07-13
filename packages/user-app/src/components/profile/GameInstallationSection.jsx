import { useEffect, useState } from "react";
import {
  CloudDownload as CloudDownloadIcon,
  Download as DownloadIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";

const GameInstallationSection = ({ gameInstallation, onDownloadGame }) => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const screenshotCount = gameInstallation?.screenshots?.length || 0;

  const handlePrevScreenshot = () => {
    if (!screenshotCount) return;
    setActiveScreenshot((prev) => (prev - 1 + screenshotCount) % screenshotCount);
  };

  const handleNextScreenshot = () => {
    if (!screenshotCount) return;
    setActiveScreenshot((prev) => (prev + 1) % screenshotCount);
  };

  useEffect(() => {
    if (screenshotCount < 2) return;

    const timer = setInterval(() => {
      if (!isHovered) {
        setActiveScreenshot((prev) => (prev + 1) % screenshotCount);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [screenshotCount, isHovered]);

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <CloudDownloadIcon
          sx={{ mr: 1.5, color: "primary.main", fontSize: 24 }}
        />
        <Typography variant="h6" fontWeight={600}>
          Oyunun Quraşdırılması
        </Typography>
      </Box>

      {/* Instructions */}
      {gameInstallation?.instructions && (
        <List sx={{ mb: 3 }}>
          {gameInstallation.instructions.map((instruction, index) => (
            <ListItem
              key={index}
              sx={{ px: 0, py: 1, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  minWidth: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="body2" sx={{ pt: 0.5 }}>
                {instruction}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}

      {/* Download Button */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<DownloadIcon />}
        onClick={onDownloadGame}
        sx={{
          bgcolor: "#16a085",
          "&:hover": { bgcolor: "#138d75" },
          textTransform: "none",
          py: 1.5,
          mb: 3,
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Oyunu Yüklə (.exe)
      </Button>

      {/* Screenshots */}
      {gameInstallation?.screenshots &&
        gameInstallation.screenshots.length > 0 && (
          <Box
            sx={{ mb: 3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              EKRAN GÖRÜNTÜLƏRİ
            </Typography>
            <Grid container spacing={1}>
              {Array.from({ length: Math.min(2, screenshotCount) }).map(
                (_, index) => {
                  const screenshotIndex =
                    (activeScreenshot + index) % screenshotCount;
                  const screenshot = gameInstallation.screenshots[screenshotIndex];

                  return (
                    <Grid item xs={6} key={screenshot.id || screenshotIndex}>
                      <Box
                        component="img"
                        src={screenshot.url}
                        alt={screenshot.alt || `Screenshot ${screenshotIndex + 1}`}
                        sx={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          borderRadius: 2,
                          bgcolor: "grey.100",
                          display: "block",
                        }}
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e0e0e0' width='400' height='300'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='24' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EŞəkil%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>
            {screenshotCount > 1 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Box>
                  <IconButton
                    onClick={handlePrevScreenshot}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.12)",
                      color: "text.primary",
                      '&:hover': { bgcolor: "rgba(0,0,0,0.2)" },
                    }}
                    size="small"
                  >
                    <ArrowBackIosIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={handleNextScreenshot}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.12)",
                      color: "text.primary",
                      ml: 1,
                      '&:hover': { bgcolor: "rgba(0,0,0,0.2)" },
                    }}
                    size="small"
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {gameInstallation.screenshots.map((screenshot, index) => (
                    <Box
                      key={screenshot.id || index}
                      onClick={() => setActiveScreenshot(index)}
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor:
                          index === activeScreenshot
                            ? "primary.main"
                            : "grey.400",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

      {/* System Requirements */}
      <Box sx={{ mt: 3 }}>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ mb: 2, letterSpacing: 0.5 }}
        >
          <h2>Sistem Tələbləri</h2>
        </Typography>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Minimum sistem:
        </Typography>
        <List sx={{ mb: 2, px: 0 }}>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              ƏS: Windows 10 (64 bit)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              CPU: Quad-core 2.5GHZ (Intel i5 / Ryzen 3)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">Ram: 8GB</Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              GPU: DirectX 11/12 compatible (GTX 1050Ti / RX560)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              Yaddaş: 15GB (SSD tövsiyyə olunur)
            </Typography>
          </ListItem>
        </List>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Tövsiyyə olunan sistem:
        </Typography>
        <List sx={{ px: 0 }}>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              ƏS: Windows 11 (64 bit)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              CPU: 6-8 cores (Ryzen 5 / Intel i5 12th gen+)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">Ram: 16GB</Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              GPU: DirectX 11/12 compatible (GTX 1080 / RTX 2060 / RX6600+)
            </Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">Yaddaş: 20GB (SSD)</Typography>
          </ListItem>
          <ListItem sx={{ px: 0, py: 0.5 }}>
            <Typography variant="body2">
              Controller: Radiomaster TX165 / TX12 / Boxer
            </Typography>
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default GameInstallationSection;
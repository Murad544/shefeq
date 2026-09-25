import { useEffect, useState } from "react";
import {
  CloudDownload as CloudDownloadIcon,
  Download as DownloadIcon,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Memory as MemoryIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import CornerBrackets from "../military/CornerBrackets";
import Panel from "../military/Panel";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231C2419' width='400' height='300'/%3E%3Ctext fill='%23A5A58F' font-family='monospace' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EFPV%3C/text%3E%3C/svg%3E";

const REQUIREMENTS = [
  { label: "ƏS", min: "Windows 10 (64 bit)", rec: "Windows 11 (64 bit)" },
  {
    label: "CPU",
    min: "Quad-core 2.5GHZ (Intel i5 / Ryzen 3)",
    rec: "6-8 cores (Ryzen 5 / Intel i5 12th gen+)",
  },
  { label: "Ram", min: "8GB", rec: "16GB" },
  {
    label: "GPU",
    min: "DirectX 11/12 compatible (GTX 1050Ti / RX560)",
    rec: "DirectX 11/12 compatible (GTX 1080 / RTX 2060 / RX6600+)",
  },
  { label: "Yaddaş", min: "15GB (SSD tövsiyyə olunur)", rec: "20GB (SSD)" },
  { label: "Controller", min: "—", rec: "Radiomaster TX165 / TX12 / Boxer" },
];

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

  const current = gameInstallation?.screenshots?.[activeScreenshot];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Procedure */}
        <Grid item xs={12} lg={5}>
          <Panel
            title="Oyunun Quraşdırılması"
            icon={<CloudDownloadIcon />}
            sx={{ height: "100%" }}
          >
            {gameInstallation?.instructions && (
              <Box sx={{ mb: 3 }}>
                {gameInstallation.instructions.map((instruction, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    sx={{
                      position: "relative",
                      pb: 2.25,
                      animation: `sg-fade-up .45s ${EASE.out} ${index * 80}ms backwards`,
                      "&:not(:last-of-type)::before": {
                        content: '""',
                        position: "absolute",
                        left: 15,
                        top: 34,
                        bottom: 4,
                        width: "1px",
                        bgcolor: C.ruleStrong,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: C.olive,
                        color: C.paper,
                        fontFamily: FONT.mono,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ pt: 0.6, lineHeight: 1.6 }}>
                      {instruction}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            )}

            {/* Download Button */}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              startIcon={<DownloadIcon />}
              onClick={onDownloadGame}
              sx={{
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,.45) 50%, transparent 70%)",
                  transform: "translateX(-120%)",
                  transition: "transform .7s ease",
                },
                "&:hover::after": { transform: "translateX(120%)" },
              }}
            >
              Oyunu Yüklə (.exe)
            </Button>
          </Panel>
        </Grid>

        {/* Screenshots */}
        <Grid item xs={12} lg={7}>
          {screenshotCount > 0 && (
            <Box
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{ bgcolor: C.field800, p: { xs: 1.5, sm: 2 }, height: "100%" }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  fontFamily: FONT.mono,
                  fontSize: "0.68rem",
                  letterSpacing: "0.1em",
                  color: C.textOnDarkMuted,
                  mb: 1.5,
                }}
              >
                <span>EKRAN GÖRÜNTÜLƏRİ</span>
                <span>
                  KADR {activeScreenshot + 1} /{" "}
                  {screenshotCount}
                </span>
              </Stack>

              <Box sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: C.ink }}>
                <Box
                  key={activeScreenshot}
                  component="img"
                  src={current?.url}
                  alt={current?.alt || `Screenshot ${activeScreenshot + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    animation: "sg-fade-in .6s ease backwards",
                  }}
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <CornerBrackets size={20} inset={10} color="rgba(232, 228, 212, 0.8)" />
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 28,
                    height: 28,
                    m: "-14px",
                    background:
                      "linear-gradient(rgba(232,228,212,.7), rgba(232,228,212,.7)) center / 100% 1px no-repeat, linear-gradient(rgba(232,228,212,.7), rgba(232,228,212,.7)) center / 1px 100% no-repeat",
                  }}
                />
                {screenshotCount > 1 && (
                  <>
                    <IconButton
                      aria-label="Əvvəlki"
                      onClick={handlePrevScreenshot}
                      size="small"
                      sx={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(16, 21, 15, 0.7)",
                        color: C.textOnDark,
                        border: `1px solid ${C.lineDarkStrong}`,
                        "&:hover": { bgcolor: C.brass, color: C.ink },
                      }}
                    >
                      <ArrowBackIosIcon fontSize="small" sx={{ ml: 0.75 }} />
                    </IconButton>
                    <IconButton
                      aria-label="Növbəti"
                      onClick={handleNextScreenshot}
                      size="small"
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        bgcolor: "rgba(16, 21, 15, 0.7)",
                        color: C.textOnDark,
                        border: `1px solid ${C.lineDarkStrong}`,
                        "&:hover": { bgcolor: C.brass, color: C.ink },
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>

              {screenshotCount > 1 && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${screenshotCount}, 1fr)`,
                    gap: 1,
                    mt: 1.5,
                  }}
                >
                  {gameInstallation.screenshots.map((screenshot, index) => (
                    <Box
                      key={screenshot.id || index}
                      component="button"
                      type="button"
                      aria-label={`Kadr ${index + 1}`}
                      onClick={() => setActiveScreenshot(index)}
                      sx={{
                        p: 0,
                        aspectRatio: "16 / 9",
                        border: `2px solid ${index === activeScreenshot ? C.brass : "transparent"}`,
                        backgroundImage: `url(${screenshot.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        bgcolor: C.ink,
                        cursor: "pointer",
                        opacity: index === activeScreenshot ? 1 : 0.55,
                        transition: "opacity .2s, border-color .2s",
                        "&:hover": { opacity: 1 },
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Grid>
      </Grid>

      {/* System Requirements */}
      <Panel title="Sistem Tələbləri" icon={<MemoryIcon />} noPadding>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 560 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 140 }}>Parametr</TableCell>
                <TableCell>Minimum sistem</TableCell>
                <TableCell>Tövsiyyə olunan sistem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {REQUIREMENTS.map((row) => (
                <TableRow key={row.label} hover>
                  <TableCell sx={{ ...labelCaps, fontSize: "0.78rem", color: C.olive }}>
                    {row.label}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.88rem" }}>{row.min}</TableCell>
                  <TableCell sx={{ fontSize: "0.88rem", fontWeight: 500 }}>{row.rec}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Panel>
    </Box>
  );
};

export default GameInstallationSection;

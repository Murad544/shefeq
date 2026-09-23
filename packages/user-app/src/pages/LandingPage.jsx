import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Container,
} from "@mui/material";
import {
  School,
  ArrowForward,
  RocketLaunch,
  ControlCamera,
  GppGood,
  KeyboardArrowDown,
  FlightTakeoff,
} from "@mui/icons-material";
import { BRAND } from "../config/brand";
import { STRINGS } from "../config/constants";
import { C, EASE, labelCaps } from "../config/tokens";
import Navbar from "../components/landing/Navbar";
import Information from "../components/landing/Information";
import AboutUs from "../components/landing/AboutUs";
import ContactUs from "../components/landing/ContactUs";
import Footer from "../components/landing/Footer";
import TrainingRoute from "../components/landing/TrainingRoute";
import Emblem from "../components/military/Emblem";
import TacticalBackground from "../components/military/TacticalBackground";
import TricolorBar from "../components/military/TricolorBar";

// Icons for STRINGS.FEATURES: realistic simulation, then training.
const BRIEFING_ICONS = [<FlightTakeoff />, <School />];

const enter = (delay) => ({
  animation: `sg-fade-up .8s ${EASE.out} ${delay}ms backwards`,
});

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const featureChips = [
    { label: "Bacarıqlar", icon: <ControlCamera fontSize="small" /> },
    { label: "Təhsil", icon: <School fontSize="small" /> },
    { label: "Sertifikat", icon: <GppGood fontSize="small" /> },
    { label: "Karyera", icon: <RocketLaunch fontSize="small" /> },
    // Motivasiya yerine belke Tehlukesizlik, deqiqlesdir
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: "relative",
          bgcolor: C.field900,
          color: C.textOnDark,
          overflow: "hidden",
          minHeight: { md: "calc(100vh - 74px)" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TacticalBackground />
        <Emblem
          decorative
          size={520}
          opacity={0.035}
          sx={{ position: "absolute", left: -160, bottom: -120 }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            py: { xs: 7, md: 8 },
          }}
        >
          <Grid container spacing={{ xs: 7, md: 4 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{ color: C.brass, display: "block", mb: 1.5, ...enter(180) }}
              >
                {BRAND.COURSE_NAME}
              </Typography>

              {/* Official name: "FPV" as the monumental mark, descriptor beneath */}
              <Typography variant="h1" aria-label={BRAND.PROJECT_NAME} sx={{ color: C.textOnDark }}>
                <Box
                  component="span"
                  aria-hidden
                  sx={{
                    display: "block",
                    fontSize: "clamp(4.2rem, 11vw, 8rem)",
                    letterSpacing: "0.14em",
                    lineHeight: 0.9,
                    animation: `sg-track-in 1.2s ${EASE.out} .2s backwards`,
                  }}
                >
                  {BRAND.PROJECT_MARK.toLocaleUpperCase("az")}
                </Box>
                {BRAND.PROJECT_DESCRIPTOR && (
                  <Box
                    component="span"
                    aria-hidden
                    sx={{
                      display: "block",
                      mt: 1.5,
                      fontSize: "clamp(1.45rem, 3.4vw, 2.45rem)",
                      letterSpacing: "0.12em",
                      lineHeight: 1.1,
                      color: C.brassLight,
                      ...enter(380),
                    }}
                  >
                    {BRAND.PROJECT_DESCRIPTOR.toLocaleUpperCase("az")}
                  </Box>
                )}
              </Typography>

              <TricolorBar
                height={4}
                animate
                delay={500}
                sx={{ width: 160, my: 3, transformOrigin: "left" }}
              />

              <Typography
                sx={{
                  ...labelCaps,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  letterSpacing: "0.16em",
                  color: C.textOnDark,
                  mb: 2,
                  ...enter(460),
                }}
              >
                Dron tədrisi və praktiki təlimlər
              </Typography>
              <Typography
                sx={{
                  color: C.textOnDarkMuted,
                  maxWidth: 560,
                  mb: 4,
                  fontSize: "1.05rem",
                  ...enter(500),
                }}
              >
                Gələcək PUA operatorlarının seçimi, nəzəri hazırlığı və
                simulyator üzərində praktiki təlimi üçün vahid platforma.
              </Typography>

              {/* Feature chips */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                  gap: 1,
                  mb: 4.5,
                  maxWidth: 560,
                }}
              >
                {featureChips.map((item, index) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.5,
                      py: 1.1,
                      border: `1px solid ${C.lineDarkStrong}`,
                      bgcolor: "rgba(11, 15, 10, 0.35)",
                      ...labelCaps,
                      fontSize: "0.8rem",
                      color: C.textOnDark,
                      transition: "border-color .25s, color .25s, background-color .25s",
                      "& svg": { color: C.brass, fontSize: 18 },
                      "&:hover": {
                        borderColor: C.brass,
                        bgcolor: "rgba(201, 166, 70, 0.08)",
                      },
                      ...enter(580 + index * 70),
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </Box>
                ))}
              </Box>

              {/* CTA Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={enter(860)}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForward />}
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
                    "& .MuiButton-endIcon": { transition: "transform .25s" },
                    "&:hover .MuiButton-endIcon": { transform: "translateX(4px)" },
                  }}
                >
                  {STRINGS.GET_STARTED}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    color: C.textOnDark,
                    borderColor: C.lineDarkStrong,
                    "&:hover": {
                      borderColor: C.brass,
                      color: C.brass,
                      bgcolor: "rgba(201, 166, 70, 0.06)",
                    },
                  }}
                >
                  {STRINGS.SIGN_IN}
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <TrainingRoute />
            </Grid>
          </Grid>
        </Container>

        {/* Briefing strip */}
        <Box
          sx={{
            position: "relative",
            borderTop: `1px solid ${C.lineDark}`,
            bgcolor: "rgba(11, 15, 10, 0.4)",
          }}
        >
          <Container maxWidth="lg">
            <Grid container>
              {STRINGS.FEATURES.map((feature, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  key={feature.title}
                  sx={{
                    py: 3.5,
                    pl: { md: index ? 4 : 0 },
                    pr: { md: index ? 0 : 4 },
                    borderLeft: { md: index ? `1px solid ${C.lineDark}` : "none" },
                    borderTop: { xs: index ? `1px solid ${C.lineDark}` : "none", md: "none" },
                    ...enter(1000 + index * 120),
                  }}
                >
                  <Stack direction="row" spacing={2.5}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${C.lineDarkStrong}`,
                        color: C.brass,
                        "& svg": { fontSize: 22 },
                      }}
                    >
                      {BRIEFING_ICONS[index] || <FlightTakeoff />}
                    </Box>
                    <Box>
                      <Typography
                        sx={{ ...labelCaps, fontSize: "1rem", color: C.textOnDark, mb: 0.75 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: C.textOnDarkMuted, lineHeight: 1.7 }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Information */}
      <Box id="information">
        <Information />
      </Box>

      {/* About */}
      <Box id="about">
        <AboutUs />
      </Box>

      {/* Contact */}
      <Box id="contact">
        <ContactUs />
      </Box>

      <Footer />

      {/* Floating Down Arrow Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1000,
        }}
      >
        <Button
          aria-label="Aşağı sürüşdür"
          sx={{
            width: 52,
            height: 52,
            minWidth: 52,
            p: 0,
            bgcolor: "rgba(16, 21, 15, 0.9)",
            color: C.brass,
            border: `1px solid ${C.brass}`,
            boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.6)",
            "& svg": { animation: "sg-chevron 1.8s ease-in-out infinite" },
            "&:hover": {
              bgcolor: C.brass,
              color: C.ink,
            },
          }}
          onClick={() =>
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
          }
        >
          <KeyboardArrowDown sx={{ fontSize: 28 }} />
        </Button>
      </Box>
    </>
  );
};

export default LandingPage;

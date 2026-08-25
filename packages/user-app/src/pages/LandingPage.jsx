import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Typography,
  Paper,
  Fade,
  Stack,
  Grid,
  Chip,
  Container,
  useTheme,
} from "@mui/material";
import {
  School,
  ArrowForward,
  RocketLaunch,
  ControlCamera,
  GppGood,
  KeyboardArrowDown,
} from "@mui/icons-material";
import Logo from "../assets/icons/Logo";
import ResponsiveContainer from "../components/common/ResponsiveContainer";
import { BRAND } from "../config/brand";
import { STRINGS } from "../config/constants";
import Navbar from "../components/landing/Navbar";
import Information from "../components/landing/Information";
import AboutUs from "../components/landing/AboutUs";
import ContactUs from "../components/landing/ContactUs";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            pb: 4,
          }}
        >
          {/* Background decorative elements */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                borderRadius: "50%",
                filter: "blur(100px)",
                opacity: 0.1,
              },
              "&::before": {
                width: 400,
                height: 400,
                top: -100,
                left: -100,
                background: theme.palette.secondary.main,
              },
              "&::after": {
                width: 500,
                height: 500,
                bottom: -150,
                right: -150,
                background:
                  theme.palette.accent?.main || theme.palette.secondary.light,
              },
            }}
          />

          {/* Main content using both ResponsiveContainer and Container for different sections */}
          <ResponsiveContainer maxWidth="lg" centerContent fullHeight>
            <Fade in timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 4,
                  textAlign: "center",
                  background: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(20px)",
                  boxShadow: `0 32px 64px rgba(54, 79, 107, 0.2)`,
                  position: "relative",
                  overflow: "hidden",
                  maxWidth: 800,
                  mx: "auto",
                }}
              >
                {/* Header section */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    <Logo size={80} />
                  </Box>

                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {BRAND.PROJECT_NAME}
                  </Typography>

                  {/* <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  {BRAND.COURSE_NAME}
                </Typography> */}
                </Box>

                {/* Feature chips */}
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  flexWrap="wrap"
                  sx={{ mb: 4, gap: 1 }}
                >
                  {featureChips.map((item) => (
                    <Chip
                      key={item.label}
                      icon={item.icon}
                      label={item.label}
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                        borderColor: "primary.light",
                        color: "primary.main",
                        "& .MuiChip-icon": {
                          color: "secondary.main",
                        },
                        "&:hover": {
                          bgcolor: "primary.light",
                          color: "white",
                          "& .MuiChip-icon": {
                            color: "white",
                          },
                        },
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Stack>

                {/* CTA Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    boxShadow: `0 8px 32px rgba(54, 79, 107, 0.3)`,
                    mb: 4,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 40px rgba(54, 79, 107, 0.4)`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {STRINGS.GET_STARTED}
                </Button>

                {/* Features section using Container for constrained width */}
                <Container maxWidth="md" sx={{ px: 0 }}>
                  <Grid
                    container
                    spacing={3}
                    textAlign="left"
                    justifyContent="center"
                  >
                    {STRINGS.FEATURES.map((feature, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            mx: "auto",
                            maxWidth: 500,
                            bgcolor: "grey.50",
                            height: "100%",
                            border: "1px solid",
                            borderColor: "grey.200",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "primary.light",
                              bgcolor: "primary.light",
                              color: "white",
                              transform: "translateY(-4px)",
                              boxShadow: `0 8px 24px rgba(54, 79, 107, 0.15)`,
                            },
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: "1rem",
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.6,
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Container>

                {/* Sign-in link for existing users */}
                {/* <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {STRINGS.ALREADY_HAVE_ACCOUNT}
                  <Link
                    component="button"
                    onClick={() => navigate("/login")}
                    underline="hover"
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      pl: 0,
                      ml: 0.5,
                      color: "primary.main",
                      bgcolor: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {STRINGS.SIGN_IN}
                  </Link>
                </Typography>
              </Box> */}
              </Paper>
            </Fade>
          </ResponsiveContainer>
        </Box>

        {/* Information */}
        <Box
          id="information"
          sx={{
            width: "90%",
            mx: "auto",
            my: 8,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: 3,
          }}
        >
          <Information />
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "60%",
            mx: "auto",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #ccc, transparent)",
            opacity: 0.6,
          }}
        />

        {/* About */}
        <Box
          id="about"
          sx={{
            width: "90%",
            mx: "auto",
            my: 8,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: 3,
          }}
        >
          <AboutUs />
        </Box>

        {/* Divider */}
        <Box
          sx={{
            width: "60%",
            mx: "auto",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #ccc, transparent)",
            opacity: 0.6,
          }}
        />

        {/* Contact */}
        <Box
          id="contact"
          sx={{
            width: "90%",
            mx: "auto",
            my: 8,
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "white",
            boxShadow: 3,
          }}
        >
          <ContactUs />
        </Box>

        {/* Footer */}
        <Box sx={{ pb: 3, textAlign: "center" }}>
          <Typography
            variant="caption"
            sx={{
              color: "white",
              opacity: 0.8,
              fontSize: "0.875rem",
            }}
          >
            © {new Date().getFullYear()} {BRAND.PROJECT_NAME}.{" "}
            {STRINGS.COPYRIGHT}
          </Typography>
        </Box>
      </Box>

      {/* Floating Down Arrow Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
      >
        <Button
          sx={{
            borderRadius: "50%",
            width: 56,
            height: 56,
            minWidth: 56,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            boxShadow: `0 4px 20px rgba(54, 79, 107, 0.3)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              transform: "translateY(4px)",
              boxShadow: `0 8px 24px rgba(54, 79, 107, 0.4)`,
            },
            transition: "all 0.3s ease",
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

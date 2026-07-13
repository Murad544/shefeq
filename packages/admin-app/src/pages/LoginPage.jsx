import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Fade,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Container,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
} from "@mui/material";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdLock,
  MdSecurity,
} from "react-icons/md";
import Logo from "../assets/Logo";
import dayjs from "dayjs";
import "dayjs/locale/az";
import { BRAND } from "../config/brand";
import { authApi } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPwd, setShowPwd] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  dayjs.locale("az");

  useEffect(() => {
    document.title = BRAND.fullAdminTitle
      ? BRAND.fullAdminTitle()
      : `${BRAND.PROJECT_NAME} - Admin`;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await authApi.login(email, password);
      navigate(state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Giriş uğursuz oldu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.main} 100%)`,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
      }}
    >
      {/* Enhanced Background Effects */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            borderRadius: "50%",
            filter: { xs: "blur(80px)", md: "blur(120px)" },
            opacity: { xs: 0.15, md: 0.2 },
          },
          "&::before": {
            width: { xs: 300, md: 500 },
            height: { xs: 300, md: 500 },
            top: { xs: -50, md: -100 },
            left: { xs: -50, md: -100 },
            background: theme.palette.secondary.main,
          },
          "&::after": {
            width: { xs: 400, md: 600 },
            height: { xs: 400, md: 600 },
            bottom: { xs: -100, md: -150 },
            right: { xs: -100, md: -150 },
            background:
              theme.palette.accent?.main || theme.palette.secondary.light,
          },
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ minHeight: { md: "80vh" } }}
        >
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Fade in timeout={800}>
              <Card
                elevation={24}
                sx={{
                  borderRadius: { xs: 3, md: 4 },
                  background: "rgba(255, 255, 255, 0.98)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 24px 48px rgba(54, 79, 107, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  overflow: "hidden",
                }}
              >
                <Grid container>
                  {/* Header Section */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                        color: "white",
                        p: { xs: 4, sm: 5, md: 6 },
                        textAlign: "center",
                      }}
                    >
                      <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: { xs: 64, md: 80 },
                              height: { xs: 64, md: 80 },
                              borderRadius: 3,
                              bgcolor: "rgba(255, 255, 255, 0.15)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              mx: "auto",
                              mb: 2,
                            }}
                          >
                            <MdSecurity size={isMobile ? 32 : 40} />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Logo size={isMobile ? 56 : 72} variant="default" />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                              fontWeight: 800,
                              fontSize: {
                                xs: "1.25rem",
                                sm: "1.5rem",
                                md: "1.75rem",
                              },
                              mb: 1,
                            }}
                          >
                            {BRAND.PROJECT_NAME}
                          </Typography>
                          <Typography
                            variant={isMobile ? "body2" : "subtitle1"}
                            sx={{
                              fontSize: {
                                xs: "0.875rem",
                                sm: "0.9rem",
                                md: "1rem",
                              },
                              fontWeight: 500,
                              opacity: 0.95,
                            }}
                          >
                            {isMobile ? "Admin Paneli" : "İdarəetmə Paneli"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  {/* Form Section */}
                  <Grid item xs={12}>
                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{
                        p: { xs: 4, sm: 5, md: 6 },
                      }}
                    >
                      <Grid container spacing={{ xs: 2.5, md: 3 }}>
                        {/* Error Alert */}
                        {error && (
                          <Grid item xs={12}>
                            <Alert
                              severity="error"
                              sx={{
                                borderRadius: 2,
                                fontSize: { xs: "0.875rem", md: "0.9rem" },
                                bgcolor: "error.light",
                                color: "error.dark",
                              }}
                            >
                              {error}
                            </Alert>
                          </Grid>
                        )}

                        {/* Email Field */}
                        <Grid item xs={12}>
                          <TextField
                            type="email"
                            label="E-poçt"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            autoComplete="email"
                            size={isMobile ? "medium" : "large"}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdEmail
                                    size={isMobile ? 20 : 22}
                                    color={theme.palette.primary.main}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                bgcolor: "grey.50",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: "grey.100",
                                },
                                "&.Mui-focused": {
                                  bgcolor: "background.paper",
                                  boxShadow: "0 0 0 2px rgba(54, 79, 107, 0.1)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "text.secondary",
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                fontWeight: 500,
                              },
                              "& .MuiInputBase-input": {
                                color: "text.primary",
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Grid>

                        {/* Password Field */}
                        <Grid item xs={12}>
                          <TextField
                            type={showPwd ? "text" : "password"}
                            label="Şifrə"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete="current-password"
                            size={isMobile ? "medium" : "large"}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MdLock
                                    size={isMobile ? 20 : 22}
                                    color={theme.palette.primary.main}
                                  />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPwd((s) => !s)}
                                    edge="end"
                                    aria-label="Şifrəni göstər"
                                    size={isMobile ? "medium" : "large"}
                                    sx={{
                                      color: "text.secondary",
                                      "&:hover": {
                                        color: "primary.main",
                                        bgcolor: "primary.light",
                                        "& svg": {
                                          color: "white",
                                        },
                                      },
                                    }}
                                  >
                                    {showPwd ? (
                                      <MdVisibilityOff
                                        size={isMobile ? 20 : 22}
                                      />
                                    ) : (
                                      <MdVisibility size={isMobile ? 20 : 22} />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: 2,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                bgcolor: "grey.50",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  bgcolor: "grey.100",
                                },
                                "&.Mui-focused": {
                                  bgcolor: "background.paper",
                                  boxShadow: "0 0 0 2px rgba(54, 79, 107, 0.1)",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "text.secondary",
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                fontWeight: 500,
                              },
                              "& .MuiInputBase-input": {
                                color: "text.primary",
                                fontWeight: 500,
                              },
                            }}
                          />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={submitting}
                            fullWidth
                            sx={{
                              mt: { xs: 1.5, md: 2 },
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              color: "#fff",
                              fontWeight: 700,
                              py: { xs: 1.5, md: 1.75 },
                              fontSize: { xs: "1rem", md: "1.1rem" },
                              borderRadius: 2,
                              textTransform: "none",
                              boxShadow: "0 8px 24px rgba(54, 79, 107, 0.25)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                transform: "translateY(-2px)",
                                boxShadow:
                                  "0 12px 32px rgba(54, 79, 107, 0.35)",
                              },
                              "&:active": {
                                transform: "translateY(0px)",
                              },
                              "&:disabled": {
                                background: "grey.300",
                                transform: "none",
                                boxShadow: "none",
                                color: "grey.600",
                              },
                            }}
                          >
                            {submitting ? (
                              <Grid
                                container
                                alignItems="center"
                                justifyContent="center"
                                spacing={2}
                              >
                                <Grid item>
                                  <CircularProgress
                                    size={isMobile ? 18 : 22}
                                    sx={{ color: "#fff" }}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography variant="inherit">
                                    Daxil olunur…
                                  </Typography>
                                </Grid>
                              </Grid>
                            ) : (
                              "Daxil ol"
                            )}
                          </Button>
                        </Grid>

                        {/* Footer */}
                        <Grid item xs={12}>
                          <Box
                            sx={{ textAlign: "center", mt: { xs: 2, md: 3 } }}
                          >
                            <Divider sx={{ mb: 3, borderColor: "grey.200" }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: { xs: "0.75rem", md: "0.8rem" },
                                fontWeight: 500,
                                display: "block",
                              }}
                            >
                              © {new Date().getFullYear()} {BRAND.PROJECT_NAME}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: { xs: "0.7rem", md: "0.75rem" },
                                opacity: 0.8,
                                display: "block",
                                mt: 0.5,
                              }}
                            >
                              Bütün hüquqlar qorunur.
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

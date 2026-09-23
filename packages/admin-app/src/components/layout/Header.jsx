import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Stack,
  Chip,
  Grid,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { BRAND } from "../../config/brand";
import Logo from "../../assets/Logo";
import { authApi } from "../../api/authApi";

export default function Header() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery("(max-width: 480px)");

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        color: "text.primary",
        zIndex: theme.zIndex.appBar,
        boxShadow: "0 2px 12px rgba(54, 79, 107, 0.08)",
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: { xl: "1800px" } }}>
        <Toolbar
          sx={{
            minHeight: { xs: 64, sm: 72, md: 80 },
            px: { xs: 0, sm: 0 },
          }}
        >
          <Grid container alignItems="center" spacing={{ xs: 1, sm: 2 }}>
            {/* Logo and Brand Section */}
            <Grid item xs>
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1, sm: 1.5, md: 2 }}
                sx={{ minWidth: 0 }}
              >
                <Logo
                  size={isMobile ? 32 : isTablet ? 36 : 40}
                  variant="default"
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 800,
                      fontSize: {
                        xs: "1rem",
                        sm: "1.1rem",
                        md: "1.25rem",
                        lg: "1.35rem",
                      },
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "primary.main",
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {isSmall
                      ? BRAND.PROJECT_NAME
                      : isMobile
                        ? `${BRAND.PROJECT_NAME} Admin`
                        : `${BRAND.PROJECT_NAME} — ${
                            BRAND.ADMIN_NAME || "İdarəetmə"
                          }`}
                  </Typography>

                  {/* Subtitle for larger screens */}
                  {!isMobile && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        lineHeight: 1,
                        fontSize: { sm: "0.75rem", md: "0.8rem" },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                      }}
                    >
                      {isTablet
                        ? "İdarəetmə Paneli"
                        : "İdarəetmə Paneli • Müraciətlərin İdarə Edilməsi"}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Grid>

            {/* Status and Actions Section */}
            <Grid item xs="auto">
              <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1, sm: 1.5, md: 2 }}
              >
                {/* Status Indicator */}
                {!isSmall && (
                  <Chip
                    label="Aktiv"
                    size="small"
                    sx={{
                      height: { xs: 24, md: 28 },
                      fontSize: { xs: "0.7rem", md: "0.75rem" },
                      fontWeight: 600,
                      bgcolor: "success.light",
                      color: "primary.contrastText",
                      border: `1px solid ${theme.palette.success.main}`,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                )}

                {/* Logout Button */}
                {isMobile ? (
                  <IconButton
                    onClick={handleLogout}
                    disabled={loading}
                    size="medium"
                    sx={{
                      color: "error.main",
                      border: "1px solid",
                      borderColor: "error.light",
                      borderRadius: 2,
                      width: 40,
                      height: 40,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "error.light",
                        borderColor: "error.main",
                        color: "white",
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        opacity: 0.6,
                        borderColor: "grey.300",
                        color: "grey.400",
                      },
                    }}
                  >
                    <MdLogout size={18} />
                  </IconButton>
                ) : (
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    startIcon={<MdLogout size={16} />}
                    disabled={loading}
                    color="error"
                    sx={{
                      fontSize: { xs: "0.8rem", md: "0.875rem", lg: "0.9rem" },
                      fontWeight: 600,
                      px: { xs: 2, md: 2.5, lg: 3 },
                      py: { xs: 0.75, md: 1 },
                      minWidth: { xs: "auto", md: 120 },
                      borderRadius: 2,
                      textTransform: "none",
                      transition: "all 0.2s ease",
                      borderWidth: 1.5,
                      "&:hover": {
                        borderWidth: 1.5,
                        bgcolor: "error.main",
                        color: "white",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                      },
                      "&:disabled": {
                        opacity: 0.6,
                        borderColor: "grey.300",
                        color: "grey.400",
                      },
                    }}
                  >
                    {loading ? "Çıxılır..." : isTablet ? "Çıxış" : "Çıxış"}
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

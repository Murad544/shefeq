import * as React from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Container,
  Grid,
  Fade,
} from "@mui/material";
import {
  MdGroup,
  MdSupervisorAccount,
  MdDashboard,
  MdCheckCircle,
} from "react-icons/md";
import { BRAND } from "../config/brand";
import AdminsView from "../components/features/admins/AdminsView";
import ApplicantsView from "../components/features/applicants/ApplicantsView";
import AcceptedApplicantsView from "../components/features/acceptedApplicants/AcceptedApplicantsView";

export default function DashboardPage() {
  const [tab, setTab] = React.useState("applicants");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const renderTabContent = () => {
    switch (tab) {
      case "admins":
        return <AdminsView />;
      case "applicants":
        return <ApplicantsView />;
      case "accepted":
        return <AcceptedApplicantsView />;
      default:
        return <ApplicantsView />;
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        px: { xs: 0, sm: 0, md: 2, lg: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* Enhanced Header Section */}
      <Fade in timeout={600}>
        <Paper
          sx={{
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: 0, sm: 3 },
            boxShadow: "0 4px 20px rgba(54, 79, 107, 0.08)",
            border: "1px solid",
            borderColor: "grey.200",
            background:
              "linear-gradient(135deg, rgba(54, 79, 107, 0.02) 0%, background.paper 100%)",
            overflow: "hidden",
          }}
        >
          <Grid container>
            {/* Header Content */}
            <Grid item xs={12}>
              <Box sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
                  {/* Title Section */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs="auto">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "white",
                          }}
                        >
                          <MdDashboard size={isMobile ? 20 : 24} />
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <Typography
                          variant={isSmall ? "h5" : isMobile ? "h4" : "h3"}
                          sx={{
                            fontWeight: 800,
                            fontSize: {
                              xs: "1.25rem",
                              sm: "1.5rem",
                              md: "1.75rem",
                              lg: "2rem",
                            },
                            lineHeight: { xs: 1.3, md: 1.2 },
                            color: "primary.main",
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.dark})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 1,
                          }}
                        >
                          {BRAND.COURSE_NAME}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            fontWeight: 500,
                          }}
                        >
                          İdarəetmə paneli və müraciətlərin idarə edilməsi
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Enhanced Navigation Tabs */}
            <Grid item xs={12}>
              <Box
                sx={{
                  px: { xs: 2, sm: 3, md: 3.5 }, // reduced padding
                  pb: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    p: 0.35, // reduced padding
                    border: "1px solid",
                    borderColor: "grey.200",
                    boxShadow: "0 2px 6px rgba(54, 79, 107, 0.05)", // lighter shadow
                    display: "inline-block",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant={isMobile ? "fullWidth" : "standard"}
                    sx={{
                      minHeight: { xs: 30, md: 34 }, // ↓ ~30%
                      "& .MuiTab-root": {
                        minHeight: { xs: 30, md: 34 }, // ↓ ~30%
                        fontSize: { xs: "0.7rem", md: "0.75rem" }, // ↓ ~30%
                        fontWeight: 600,
                        textTransform: "none",
                        minWidth: { xs: 85, md: 100 }, // ↓ ~30%
                        px: { xs: 1.5, md: 2 }, // ↓ padding
                        borderRadius: 1.2,
                        transition: "all 0.2s ease",
                        color: "text.secondary",
                        "&.Mui-selected": {
                          color: "white",
                          bgcolor: "primary.main",
                          boxShadow: "0 1px 5px rgba(54, 79, 107, 0.2)", // smaller shadow
                        },
                        "&:hover:not(.Mui-selected)": {
                          bgcolor: "grey.100",
                          color: "primary.main",
                        },
                      },
                      "& .MuiTabs-indicator": {
                        display: "none",
                      },
                    }}
                  >
                    <Tab
                      value="admins"
                      label={
                        <Grid container alignItems="center" spacing={0.5}>
                          <Grid item>
                            <MdSupervisorAccount size={12} /> {/* ↓ ~30% */}
                          </Grid>
                          <Grid item>
                            <Typography variant="inherit">Adminlər</Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                    <Tab
                      value="applicants"
                      label={
                        <Grid container alignItems="center" spacing={0.5}>
                          <Grid item>
                            <MdGroup size={12} /> {/* ↓ ~30% */}
                          </Grid>
                          <Grid item>
                            <Typography variant="inherit">
                              Müraciətlər
                            </Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                    <Tab
                      value="accepted"
                      label={
                        <Grid container alignItems="center" spacing={0.5}>
                          <Grid item>
                            <MdCheckCircle size={12} /> {/* ↓ ~30% */}
                          </Grid>
                          <Grid item>
                            <Typography variant="inherit">Qəbullar</Typography>
                          </Grid>
                        </Grid>
                      }
                    />
                  </Tabs>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      {/* Content Section with Animation */}
      <Fade in timeout={800} style={{ transitionDelay: "200ms" }}>
        <Box
          sx={{
            width: "100%",
            minHeight: 500,
            "& > *": {
              width: "100%",
            },
          }}
        >
          {renderTabContent()}
        </Box>
      </Fade>
    </Container>
  );
}

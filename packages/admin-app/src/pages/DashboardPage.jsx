import * as React from "react";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { MdGroup, MdSupervisorAccount, MdCheckCircle } from "react-icons/md";
import { BRAND } from "../config/brand";
import AdminsView from "../components/features/admins/AdminsView";
import ApplicantsView from "../components/features/applicants/ApplicantsView";
import AcceptedApplicantsView from "../components/features/acceptedApplicants/AcceptedApplicantsView";
import Emblem from "../components/ui/Military/Emblem";
import TacticalBackground from "../components/ui/Military/TacticalBackground";
import { C, EASE, FONT, labelCaps } from "../styles/tokens";

const TABS = [
  { value: "admins", label: "Adminlər", icon: MdSupervisorAccount },
  { value: "applicants", label: "Müraciətlər", icon: MdGroup },
  { value: "accepted", label: "Qəbullar", icon: MdCheckCircle },
];

export default function DashboardPage() {
  const [tab, setTab] = React.useState("applicants");

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
    <Box sx={{ width: "100%" }}>
      {/* Command header */}
      <Box
        sx={{
          position: "relative",
          mb: { xs: 3, md: 4 },
          bgcolor: C.field800,
          color: C.textOnDark,
          overflow: "hidden",
          animation: `sg-fade-up .6s ${EASE.out} backwards`,
        }}
      >
        <TacticalBackground />
        <Emblem
          decorative
          size={220}
          opacity={0.07}
          sx={{ position: "absolute", right: { xs: -60, md: 40 }, top: -30 }}
        />
        <Box sx={{ position: "relative", p: { xs: 2.5, sm: 3.5, md: 4.5 } }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ mb: 1.5, fontFamily: FONT.mono, fontSize: "0.72rem", letterSpacing: "0.12em" }}
          >
            <Box component="span" sx={{ color: C.brass }}>
              İDARƏETMƏ MƏRKƏZİ
            </Box>
            <Box sx={{ width: 36, height: "1px", bgcolor: C.brass, opacity: 0.7 }} />
          </Stack>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: C.textOnDark,
              fontSize: { xs: "1.7rem", sm: "2.1rem", md: "2.6rem" },
              maxWidth: 820,
              mb: 1,
            }}
          >
            {BRAND.COURSE_NAME}
          </Typography>
          <Typography sx={{ color: C.textOnDarkMuted, fontSize: { xs: "0.92rem", md: "1rem" } }}>
            İdarəetmə paneli və müraciətlərin idarə edilməsi
          </Typography>
        </Box>

        {/* Sector selector */}
        <Box
          role="tablist"
          aria-label="Bölmələr"
          sx={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, 1fr)", md: "repeat(3, minmax(0, 220px))" },
            borderTop: `1px solid ${C.lineDark}`,
            bgcolor: "rgba(11, 15, 10, 0.35)",
          }}
        >
          {TABS.map(({ value, label, icon: Icon }) => {
            const selected = tab === value;
            return (
              <ButtonBase
                key={value}
                role="tab"
                aria-selected={selected}
                onClick={() => setTab(value)}
                sx={{
                  position: "relative",
                  justifyContent: { xs: "center", md: "flex-start" },
                  gap: 1.25,
                  px: { xs: 1, md: 3 },
                  py: { xs: 1.5, md: 1.75 },
                  borderRight: `1px solid ${C.lineDark}`,
                  color: selected ? C.brassLight : C.textOnDarkMuted,
                  bgcolor: selected ? "rgba(201, 166, 70, 0.1)" : "transparent",
                  transition: "color .2s, background-color .2s",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 3,
                    bgcolor: C.brass,
                    transform: selected ? "scaleX(1)" : "scaleX(0)",
                    transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
                  },
                  "&:hover": { color: C.textOnDark, bgcolor: "rgba(232, 228, 212, 0.05)" },
                }}
              >
                <Icon size={18} />
                <Box component="span" sx={{ ...labelCaps, fontSize: { xs: "0.78rem", md: "0.9rem" } }}>
                  {label}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* Content Section with Animation */}
      <Box
        key={tab}
        sx={{
          width: "100%",
          minHeight: 500,
          "& > *": {
            width: "100%",
          },
          animation: `sg-fade-up .5s ${EASE.out} backwards`,
        }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
}

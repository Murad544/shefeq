import React from "react";
import { Box, ButtonBase, Stack } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { BRAND } from "../../config/brand";
import { C, FONT, labelCaps } from "../../config/tokens";
import BrandLockup from "../military/BrandLockup";
import Emblem from "../military/Emblem";
import TricolorBar from "../military/TricolorBar";

export const NAV_ITEMS = [
  { id: 'profile', label: 'Profil', icon: <AccountCircleIcon /> },
  { id: 'training', label: 'Təlim', icon: <SchoolIcon /> },
  { id: 'download', label: 'Oyun yükləmə', icon: <DownloadIcon /> },
  { id: 'stats', label: 'Oyun Statistikası', icon: <BarChartIcon /> },
  { id: 'leaderboard', label: 'Liderlik cədvəli', icon: <LeaderboardIcon /> },
  // { id: 'levels', label: 'Levellər', icon: <VideogameAssetIcon /> },

];

// Desktop: a dark command rail. Mobile (variant="tabs"): a scrollable tab strip.
const Sidebar = ({ active, onSelect, userRole, variant = "rail" }) => {
  const isTrainer = userRole === 'trainer';
  const visibleNavItems = isTrainer
    ? NAV_ITEMS.filter((item) => ['profile', 'training'].includes(item.id))
    : NAV_ITEMS;

  if (variant === "tabs") {
    return (
      <Box
        component="nav"
        aria-label="Bölmələr"
        sx={{
          display: "flex",
          overflowX: "auto",
          bgcolor: C.field800,
          borderTop: `1px solid ${C.lineDark}`,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {visibleNavItems.map((item) => {
          const selected = active === item.id;
          return (
            <ButtonBase
              key={item.id}
              onClick={() => onSelect && onSelect(item.id)}
              aria-current={selected ? "page" : undefined}
              sx={{
                flexShrink: 0,
                gap: 1,
                px: 2,
                py: 1.5,
                ...labelCaps,
                fontSize: "0.82rem",
                color: selected ? C.brassLight : C.textOnDarkMuted,
                borderBottom: `2px solid ${selected ? C.brass : "transparent"}`,
                transition: "color .2s, border-color .2s",
                "& svg": { fontSize: 18 },
              }}
            >
              {item.icon}
              {item.label}
            </ButtonBase>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      aria-label="Bölmələr"
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: 264,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        bgcolor: C.field900,
        color: C.textOnDark,
        borderRight: `1px solid ${C.lineDarkStrong}`,
        overflow: "hidden",
      }}
    >
      <TricolorBar height={4} />
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: 3, py: 2.75, borderBottom: `1px solid ${C.lineDark}` }}
      >
        <BrandLockup />
      </Stack>

      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 1.5,
          fontFamily: FONT.mono,
          fontSize: "0.64rem",
          letterSpacing: "0.16em",
          color: C.textOnDarkMuted,
        }}
      >
        ŞƏXSİ KABİNET
      </Box>

      <Box sx={{ px: 1.5, flex: 1 }}>
        {visibleNavItems.map((item, index) => {
          const selected = active === item.id;
          return (
            <ButtonBase
              key={item.id}
              onClick={() => onSelect && onSelect(item.id)}
              aria-current={selected ? "page" : undefined}
              sx={{
                width: "100%",
                justifyContent: "flex-start",
                gap: 1.5,
                px: 1.5,
                py: 1.4,
                mb: 0.5,
                position: "relative",
                color: selected ? C.brassLight : C.textOnDark,
                bgcolor: selected ? "rgba(201, 166, 70, 0.1)" : "transparent",
                transition: "background-color .2s, color .2s",
                animation: `sg-slide-in-left .45s ease ${index * 60 + 100}ms backwards`,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  bgcolor: C.brass,
                  transform: selected ? "scaleY(1)" : "scaleY(0)",
                  transition: "transform .3s cubic-bezier(0.16, 1, 0.3, 1)",
                },
                "&:hover": {
                  bgcolor: selected ? "rgba(201, 166, 70, 0.14)" : "rgba(232, 228, 212, 0.05)",
                },
                "& svg": {
                  fontSize: 20,
                  color: selected ? C.brass : C.textOnDarkMuted,
                  transition: "color .2s",
                },
              }}
            >
              {item.icon}
              <Box component="span" sx={{ ...labelCaps, fontSize: "0.9rem", textAlign: "left" }}>
                {item.label}
              </Box>
            </ButtonBase>
          );
        })}
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ px: 3, py: 2.5, borderTop: `1px solid ${C.lineDark}` }}
      >
        <Emblem size={30} />
        <Box
          sx={{
            fontFamily: FONT.mono,
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
            lineHeight: 1.6,
            color: C.textOnDarkMuted,
          }}
        >
          {BRAND.COURSE_NAME}
        </Box>
      </Stack>
    </Box>
  );
};

export default Sidebar;

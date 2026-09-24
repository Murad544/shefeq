import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  useScrollTrigger,
} from "@mui/material";
import { Close as CloseIcon, Menu as MenuIcon } from "@mui/icons-material";
import { C, labelCaps } from "../../config/tokens";
import BrandLockup from "../military/BrandLockup";
import TricolorBar from "../military/TricolorBar";

const NAV_ITEMS = [
  { id: "information", label: "Məlumat" },
  { id: "about", label: "Haqqımızda" },
  { id: "contact", label: "Əlaqə" },
];

const outlinedOnDark = {
  color: C.textOnDark,
  borderColor: C.lineDarkStrong,
  "&:hover": {
    borderColor: C.brass,
    color: C.brass,
    bgcolor: "rgba(201, 166, 70, 0.06)",
  },
};

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 12 });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const yOffset = -80; // height of navbar
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  };

  const closeThen = (action) => () => {
    setMenuOpen(false);
    action();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: scrolled ? "rgba(16, 21, 15, 0.94)" : C.field900,
        backdropFilter: "blur(10px)",
        color: C.textOnDark,
        borderBottom: `1px solid ${scrolled ? C.lineDarkStrong : C.lineDark}`,
        boxShadow: scrolled ? "0 12px 32px -20px rgba(0, 0, 0, 0.8)" : "none",
        transition: "background-color .3s, box-shadow .3s, border-color .3s",
      }}
    >
      <TricolorBar height={4} />
      <Toolbar sx={{ minHeight: { xs: 64, md: 70 }, px: { xs: 2, md: 4 }, gap: 2 }}>
        {/* Logo + Brand */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <BrandLockup />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Navigation Links */}
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={() => scrollToSection(item.id)}
              sx={navLinkStyle}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "1px",
            height: 28,
            bgcolor: C.lineDarkStrong,
            mx: 1,
          }}
        />

        <Stack direction="row" spacing={1.5} sx={{ display: { xs: "none", md: "flex" } }}>
          {/* Login */}
          <Button variant="outlined" onClick={() => navigate("/login")} sx={outlinedOnDark}>
            Daxil ol
          </Button>

          {/* Register */}
          <Button variant="contained" color="secondary" onClick={() => navigate("/register")}>
            Qeydiyyat
          </Button>
        </Stack>

        <IconButton
          aria-label="Menyunu aç"
          onClick={() => setMenuOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: C.textOnDark,
            border: `1px solid ${C.lineDarkStrong}`,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            maxWidth: "85vw",
            bgcolor: C.field900,
            color: C.textOnDark,
            borderLeft: `1px solid ${C.lineDarkStrong}`,
          },
        }}
      >
        <TricolorBar height={4} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5 }}>
          <IconButton
            aria-label="Menyunu bağla"
            onClick={() => setMenuOpen(false)}
            sx={{ color: C.textOnDark }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Stack sx={{ px: 2 }}>
          {NAV_ITEMS.map((item, index) => (
            <Button
              key={item.id}
              color="inherit"
              onClick={closeThen(() => scrollToSection(item.id))}
              sx={{
                justifyContent: "flex-start",
                py: 1.75,
                borderBottom: `1px solid ${C.lineDark}`,
                borderRadius: 0,
                fontSize: "1.05rem",
                animation: `sg-slide-in-left .45s ease ${index * 70 + 80}ms backwards`,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>
        <Stack spacing={1.5} sx={{ p: 2, mt: 2 }}>
          <Button variant="outlined" onClick={closeThen(() => navigate("/login"))} sx={outlinedOnDark}>
            Daxil ol
          </Button>
          <Button variant="contained" color="secondary" onClick={closeThen(() => navigate("/register"))}>
            Qeydiyyat
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
};

const navLinkStyle = {
  ...labelCaps,
  fontSize: "0.92rem",
  color: C.textOnDark,
  position: "relative",
  px: 1.75,
  "&::after": {
    content: '""',
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 4,
    height: "2px",
    bgcolor: C.brass,
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform .3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  "&:hover": {
    color: C.brassLight,
    backgroundColor: "transparent",
  },
  "&:hover::after": { transform: "scaleX(1)" },
};

export default Navbar;

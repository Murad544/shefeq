import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import Logo from "../../assets/icons/Logo";
import { BRAND } from "../../config/brand";

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
        px: { xs: 2, md: 4 },
        
        
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo + Brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <Logo size={40} />
          <Typography
            variant="h6"
            sx={{
              ml: 1.5,
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {BRAND.PROJECT_NAME}
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            color="inherit"
            onClick={() => scrollToSection("information")}
            sx={navLinkStyle}
          >
            Məlumat
          </Button>

          <Button
            color="inherit"
            onClick={() => scrollToSection("about")}
            sx={navLinkStyle}
          >
            Haqqımızda
          </Button>

          <Button
            color="inherit"
            onClick={() => scrollToSection("contact")}
            sx={navLinkStyle}
          >
            Əlaqə
          </Button>

          {/* Login */}
          <Button
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
            }}
          >
            Daxil ol
          </Button>

          {/* Register */}
          <Button
            variant="contained"
            onClick={() => navigate("/register")}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: "0 8px 24px rgba(54, 79, 107, 0.25)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(54, 79, 107, 0.35)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Qeydiyyat
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

const navLinkStyle = {
  fontWeight: 600,
  textTransform: "none",
  color: "text.primary",
  position: "relative",
  "&:hover": {
    color: "primary.main",
    backgroundColor: "transparent",
  },
};

export default Navbar;

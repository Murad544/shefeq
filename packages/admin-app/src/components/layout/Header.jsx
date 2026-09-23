import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { BRAND } from "../../config/brand";
import { authApi } from "../../api/authApi";
import { C } from "../../styles/tokens";
import BrandLockup from "../ui/Military/BrandLockup";
import TricolorBar from "../ui/Military/TricolorBar";

const logoutHover = {
  borderColor: C.redLight,
  color: C.redLight,
  bgcolor: "rgba(200, 85, 76, 0.1)",
};

export default function Header() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        bgcolor: C.field900,
        color: C.textOnDark,
        borderBottom: `1px solid ${C.lineDarkStrong}`,
        boxShadow: "0 10px 30px -22px rgba(0, 0, 0, 0.9)",
        zIndex: theme.zIndex.appBar,
      }}
    >
      <TricolorBar height={4} />
      <Container maxWidth={false} sx={{ maxWidth: { xl: "1800px" } }}>
        <Toolbar
          disableGutters
          sx={{ minHeight: { xs: 60, md: 68 }, gap: { xs: 1.5, md: 2.5 } }}
        >
          {/* Logo and Brand Section */}
          <Box sx={{ minWidth: 0, flex: 1, display: "flex" }}>
            <BrandLockup size={isMobile ? "sm" : "md"} tag={BRAND.ADMIN_NAME} />
          </Box>

          {/* Logout Button */}
          {isMobile ? (
            <IconButton
              onClick={handleLogout}
              disabled={loading}
              aria-label="Çıxış"
              sx={{
                color: C.textOnDark,
                border: `1px solid ${C.lineDarkStrong}`,
                width: 40,
                height: 40,
                "&:hover": logoutHover,
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
              sx={{
                color: C.textOnDark,
                borderColor: C.lineDarkStrong,
                minWidth: 120,
                "&:hover": logoutHover,
                "&.Mui-disabled": { color: C.textOnDarkMuted, borderColor: C.lineDark },
              }}
            >
              {loading ? "Çıxılır..." : "Çıxış"}
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

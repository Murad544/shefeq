import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdLock,
  MdSecurity,
} from "react-icons/md";
import dayjs from "dayjs";
import "dayjs/locale/az";
import { BRAND } from "../config/brand";
import { authApi } from "../api/authApi";
import { C, EASE, FONT, labelCaps } from "../styles/tokens";
import BrandLockup from "../components/ui/Military/BrandLockup";
import CornerBrackets from "../components/ui/Military/CornerBrackets";
import Emblem from "../components/ui/Military/Emblem";
import TacticalBackground from "../components/ui/Military/TacticalBackground";
import TricolorBar from "../components/ui/Military/TricolorBar";

const BrandMark = ({ size = "lg" }) => <BrandLockup size={size} />;

export default function LoginPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

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
      navigate(state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Giriş uğursuz oldu.");
    } finally {
      setSubmitting(false);
    }
  };

  const adornment = { color: C.olive, display: "flex" };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: C.paper }}>
      {/* Briefing panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          width: { md: "46%", lg: "42%" },
          position: "relative",
          bgcolor: C.field900,
          color: C.textOnDark,
          overflow: "hidden",
        }}
      >
        <TricolorBar />
        <TacticalBackground />
        <Emblem
          decorative
          size={440}
          opacity={0.06}
          sx={{ position: "absolute", right: -100, bottom: -70 }}
        />
        <Box
          sx={{
            position: "relative",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            p: { md: 5, lg: 7 },
            gap: 6,
          }}
        >
          <Box sx={{ animation: "sg-fade-in .6s ease backwards" }}>
            <BrandMark />
          </Box>

          <Box
            sx={{
              maxWidth: 480,
              my: "auto",
              pb: 6,
              animation: `sg-fade-up .8s ${EASE.out} .15s backwards`,
            }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2, color: C.brass }}>
              <MdSecurity size={22} />
              <Typography variant="overline" sx={{ color: C.brass }}>
                Məhdud giriş
              </Typography>
            </Stack>
            <Typography variant="h2" sx={{ color: C.textOnDark, mb: 2.5 }}>
              {BRAND.COURSE_NAME}
            </Typography>
            <Box sx={{ width: 56, height: 2, bgcolor: C.brass, mb: 2.5 }} />
            <Typography sx={{ color: C.textOnDarkMuted, lineHeight: 1.75 }}>
              İdarəetmə paneli və müraciətlərin idarə edilməsi. Giriş yalnız
              səlahiyyətli administratorlar üçündür.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: { xs: "block", md: "none" }, bgcolor: C.field900 }}>
          <TricolorBar />
          <Box sx={{ px: 2.5, py: 2 }}>
            <BrandMark size="sm" />
          </Box>
        </Box>

        <Box sx={{ position: "relative", flex: 1, display: "flex" }}>
          <TacticalBackground tone="light" topo={false} />
          <Box
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2.5, sm: 4 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 460,
                bgcolor: C.paperRaised,
                border: `1px solid ${C.rule}`,
                boxShadow: "0 24px 60px -30px rgba(16, 21, 15, 0.35)",
                p: { xs: 3, sm: 5 },
                animation: `sg-fade-up .7s ${EASE.out} .1s backwards`,
              }}
            >
              <CornerBrackets inset={-7} size={18} color={C.olive} />
              <Typography variant="overline" sx={{ color: C.brassDark, display: "block", mb: 1 }}>
                Administrator
              </Typography>
              <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
                İdarəetmə Paneli
              </Typography>
              <Typography variant="body2" sx={{ color: C.textMuted, mb: 3.5 }}>
                Hesab məlumatlarınızı daxil edin
              </Typography>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 2.5, animation: "sg-fade-up .35s ease backwards" }}>
                  {error}
                </Alert>
              )}

              {/* Email Field */}
              <TextField
                type="email"
                label="E-poçt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                autoComplete="email"
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={adornment}>
                        <MdEmail size={18} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
              <TextField
                type={showPwd ? "text" : "password"}
                label="Şifrə"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                autoComplete="current-password"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={adornment}>
                        <MdLock size={18} />
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPwd((s) => !s)}
                        edge="end"
                        aria-label="Şifrəni göstər"
                      >
                        {showPwd ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                fullWidth
              >
                {submitting ? (
                  <>
                    <CircularProgress size={18} color="inherit" sx={{ mr: 1.5 }} />
                    Daxil olunur…
                  </>
                ) : (
                  "Daxil ol"
                )}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            py: 2,
            textAlign: "center",
            fontFamily: FONT.mono,
            fontSize: "0.68rem",
            letterSpacing: "0.08em",
            color: C.textFaint,
            borderTop: `1px solid ${C.rule}`,
          }}
        >
          © {new Date().getFullYear()} {BRAND.PROJECT_NAME} ·{" "}
          <Box component="span" sx={{ ...labelCaps, fontSize: "0.66rem" }}>
            Bütün hüquqlar qorunur.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

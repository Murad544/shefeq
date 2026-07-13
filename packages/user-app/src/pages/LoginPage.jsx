import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/icons/Logo";
import { apiClient } from "../services/api/apiClient";
import { endpoints } from "../services/api/endpoints";
import { Link as RouterLink } from "react-router-dom";

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

  React.useEffect(() => {
    document.title = "Hesabınıza daxil olun";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await apiClient.post(endpoints.login(), { email, password });
      // Expect backend to return token in data.token
      if (data && (data.token || data.shouldRedirect)) {
        localStorage.setItem("auth_token", data.token);
        navigate(state?.from || "/profile", { replace: true });
      } else {
        throw new Error("Giriş uğursuz oldu");
      }
    } catch (err) {
      setError(err.message || "Giriş uğursuz oldu");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
  <Box
    component={RouterLink}
    to="/"
    sx={{
      display: "inline-flex",
      justifyContent: "center",
      textDecoration: "none",
      cursor: "pointer",
    }}
  >
    <Logo size={64} />
  </Box>

  <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
    Hesaba giriş
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Email və şifrənizi daxil edin
  </Typography>
</Box>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              type="email"
              label="E-poçt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdEmail />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              type={showPwd ? "text" : "password"}
              label="Şifrə"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                    >
                      {showPwd ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.5 }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Daxil ol"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button onClick={() => navigate("/register")}>Qeydiyyat</Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}

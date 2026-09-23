import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { ArrowForward } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/military/AuthShell";
import { apiClient } from "../services/api/apiClient";
import { endpoints } from "../services/api/endpoints";
import { C } from "../config/tokens";

export default function LoginPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

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

  const adornmentColor = { color: C.olive, display: "flex" };

  return (
    <AuthShell
      eyebrow="Şəxsi kabinet"
      title="Hesaba giriş"
      subtitle="Email və şifrənizi daxil edin"
    >
      <Box component="form" onSubmit={handleSubmit}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, animation: "sg-fade-up .35s ease backwards" }}>
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
          autoComplete="email"
          sx={{ mb: 2.5 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={adornmentColor}>
                  <MdEmail size={18} />
                </Box>
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
          autoComplete="current-password"
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={adornmentColor}>
                  <MdLock size={18} />
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPwd ? "Şifrəni gizlət" : "Şifrəni göstər"}
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
          size="large"
          fullWidth
          disabled={submitting}
          endIcon={submitting ? null : <ArrowForward />}
        >
          {submitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Daxil ol"
          )}
        </Button>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 3,
            color: C.textFaint,
            "&::before, &::after": {
              content: '""',
              flex: 1,
              height: "1px",
              bgcolor: C.rule,
            },
          }}
        >
          <Box component="span" sx={{ fontSize: "0.75rem" }}>
            və ya
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/register")}
          sx={{ mt: 2 }}
        >
          Qeydiyyat
        </Button>
      </Box>
    </AuthShell>
  );
}

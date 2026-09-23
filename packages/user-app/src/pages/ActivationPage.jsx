import {
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AuthShell from "../components/military/AuthShell";
import Stamp from "../components/military/Stamp";
import { apiClient } from "../services/api/apiClient";
import { endpoints } from "../services/api/endpoints";
import { C } from "../config/tokens";

// ── Password field ────────────────────────────────────────────────────────────
const PasswordField = ({ label, name, value, onChange, error, helperText }) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl variant="outlined" fullWidth error={error} sx={{ mb: 2.5 }}>
      <InputLabel htmlFor={name}>{label} *</InputLabel>
      <OutlinedInput
        id={name}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        label={`${label} *`}
        startAdornment={
          <InputAdornment position="start">
            <LockOutlined sx={{ color: C.olive, fontSize: 18 }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? "Parolu gizlət" : "Parolu göstər"}
              onClick={() => setShow((s) => !s)}
              edge="end"
              size="small"
            >
              {show ? (
                <VisibilityOff sx={{ fontSize: 20 }} />
              ) : (
                <Visibility sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [canActivate, setCanActivate] = useState(false);
  const [application, setApplication] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: "success"|"error", text }

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get(endpoints.checkActivation(token));
        if (!mounted) return;
        setApplication(data.application || null);
        setCanActivate(!!data.canActivate);
      } catch (err) {
        if (mounted)
          setStatusMsg({
            type: "error",
            text:
              err.message ||
              "Aktivləşdirmə tokeni etibarsız və ya müddəti bitib.",
          });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    check();
    return () => (mounted = false);
  }, [token]);

  const validate = () => {
    const e = {};
    if (!password || password.length < 8)
      e.password = "Parol ən az 8 simvol olmalıdır";
    if (password !== confirmPassword)
      e.confirmPassword = "Parollar üst-üstə düşmür";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await apiClient.post(endpoints.activate(token), { password });
      setStatusMsg({
        type: "success",
        text: "Hesabınız aktivləşdirildi — giriş səhifəsinə yönləndirilirsiniz...",
      });
      setTimeout(() => navigate("/login"), 2200);
    } catch (err) {
      setStatusMsg({
        type: "error",
        text: err.message || "Aktivləşdirmə uğursuz oldu.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Link yoxlanılır" fullScreen />;
  }

  const isInvalid = !canActivate && !statusMsg;
  const isSuccess = statusMsg?.type === "success";

  return (
    <AuthShell
      eyebrow="Yeni istifadəçi"
      title="Hesab aktivləşdirmə"
      subtitle={
        canActivate && application
          ? `Salam, ${application.name} ${application.surname}. Zəhmət olmasa hesabınız üçün parol təyin edin.`
          : isInvalid
            ? "Bu aktivləşdirmə linki etibarsızdır və ya artıq istifadə olunub."
            : "Hesabınızı aktivləşdirin"
      }
    >
      {/* Status Banner */}
      {isSuccess && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1.5, mb: 1.5, overflow: "hidden" }}>
          <Stamp label="Aktivləşdirildi" tone="green" size="lg" />
        </Box>
      )}
      {statusMsg && (
        <Alert
          severity={isSuccess ? "success" : "error"}
          sx={{ mb: 2.5, animation: "sg-fade-up .35s ease backwards" }}
        >
          {statusMsg.text}
        </Alert>
      )}

      {/* Form */}
      {canActivate && !isSuccess && (
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <PasswordField
            label="Parol"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <PasswordField
            label="Parolu təsdiqlə"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            sx={{ mt: 0.5 }}
          >
            {submitting ? (
              <>
                <CircularProgress size={16} color="inherit" sx={{ mr: 1.5 }} />
                Aktivləşdirilir...
              </>
            ) : (
              "Hesabı yarat və aktivləşdir"
            )}
          </Button>
        </Box>
      )}

      {/* Invalid token — go home */}
      {(isInvalid || (statusMsg?.type === "error" && !canActivate)) && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate("/")}
          sx={{ mt: 1 }}
        >
          Ana səhifəyə qayıt
        </Button>
      )}
    </AuthShell>
  );
};

export default ActivationPage;

import {
  CheckCircleOutline,
  ErrorOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../assets/icons/Logo";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { apiClient } from "../services/api/apiClient";
import { endpoints } from "../services/api/endpoints";

// ── inline styles that mirror the login page theme ──────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #3d5a7a 0%, #2c4a6e 40%, #1e3a5f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "40px 40px 36px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0px",
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #e8f4fd 0%, #d0e8f8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  title: {
    fontWeight: 700,
    fontSize: "1.35rem",
    color: "#1a2e45",
    marginBottom: "6px",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#6b7f96",
    marginBottom: "28px",
    textAlign: "center",
    lineHeight: 1.5,
  },
  submitBtn: {
    background: "#2c4a6e",
    color: "#fff",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "0.95rem",
    fontWeight: 600,
    textTransform: "none",
    letterSpacing: "0.02em",
    width: "100%",
    marginTop: "8px",
    boxShadow: "0 4px 14px rgba(44,74,110,0.35)",
    transition: "background 0.2s, box-shadow 0.2s",
    "&:hover": {
      background: "#1e3a5f",
      boxShadow: "0 6px 20px rgba(44,74,110,0.45)",
    },
    "&:disabled": {
      background: "#8fa8c4",
    },
  },
  statusBox: (type) => ({
    width: "100%",
    borderRadius: "10px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    background:
      type === "success" ? "#edf7ed" : type === "error" ? "#fdecea" : "#e8f4fd",
    color:
      type === "success" ? "#2e7d32" : type === "error" ? "#c62828" : "#1565c0",
    fontSize: "0.875rem",
    fontWeight: 500,
  }),
};

// ── Password field ────────────────────────────────────────────────────────────
const PasswordField = ({ label, name, value, onChange, error, helperText }) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl variant="outlined" fullWidth error={error} sx={{ mb: 2 }}>
      <InputLabel htmlFor={name} sx={{ fontSize: "0.875rem" }}>
        {label} *
      </InputLabel>
      <OutlinedInput
        id={name}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        label={`${label} *`}
        startAdornment={
          <InputAdornment position="start">
            <LockOutlined sx={{ color: "#8fa8c4", fontSize: 18 }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              size="small"
            >
              {show ? (
                <VisibilityOff sx={{ color: "#8fa8c4", fontSize: 20 }} />
              ) : (
                <Visibility sx={{ color: "#8fa8c4", fontSize: 20 }} />
              )}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          borderRadius: "10px",
          fontSize: "0.9rem",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0dcea" },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8fa8c4",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#2c4a6e",
          },
        }}
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
    return <LoadingSpinner message="Suallar yüklənir..." />;
  }

  const isInvalid = !canActivate && !statusMsg;
  const isSuccess = statusMsg?.type === "success";

  return (
    <Box sx={styles.root}>
      <Box sx={styles.card}>
        {/* Logo */}
        <Box sx={styles.logoWrap}>
          <Logo size={64} />
        </Box>

        {/* Title */}
        <Typography sx={styles.title}>Hesab aktivləşdirmə</Typography>
        <Typography sx={styles.subtitle}>
          {canActivate && application
            ? `Salam, ${application.name} ${application.surname}. Zəhmət olmasa hesabınız üçün parol təyin edin.`
            : isInvalid
              ? "Bu aktivləşdirmə linki etibarsızdır və ya artıq istifadə olunub."
              : "Hesabınızı aktivləşdirin"}
        </Typography>

        {/* Status Banner */}
        {statusMsg && (
          <Box sx={styles.statusBox(statusMsg.type)}>
            {isSuccess ? (
              <CheckCircleOutline fontSize="small" />
            ) : (
              <ErrorOutline fontSize="small" />
            )}
            {statusMsg.text}
          </Box>
        )}

        {/* Form */}
        {canActivate && !isSuccess && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
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
              disabled={submitting}
              sx={styles.submitBtn}
            >
              {submitting ? (
                <>
                  <CircularProgress size={16} sx={{ color: "#fff", mr: 1 }} />{" "}
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
            onClick={() => navigate("/")}
            sx={{ ...styles.submitBtn, mt: 2 }}
          >
            Ana səhifəyə qayıt
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ActivationPage;

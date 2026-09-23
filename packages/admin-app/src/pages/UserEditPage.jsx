import * as React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave, MdEditDocument } from "react-icons/md";
import { adminApi } from "../api/adminApi";
import { educationLevelOptions } from "../constants/educationLevelOptions";
import InfoCard from "../components/ui/Display/InfoCard";
import RadarLoader from "../components/ui/Military/RadarLoader";
import TricolorBar from "../components/ui/Military/TricolorBar";
import { C, EASE, FONT, labelCaps } from "../styles/tokens";

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [form, setForm] = React.useState({
    name: "",
    surname: "",
    fatherName: "",
    educationLevel: "",
    university: "",
    profession: "",
    phoneNumber: "",
    password: "",
  });

  const initialFormValues = React.useRef(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getUserEditData(id);
        const applicationData = res?.application || {};
        const userData = res?.user || {};
        const applicant = { ...userData, ...applicationData };
        const nextForm = {
          name: applicant.name || "",
          surname: applicant.surname || "",
          fatherName: applicant.father_name || applicant.fatherName || "",
          educationLevel:
            applicant.education_level || applicant.educationLevel || "",
          university: applicant.university || "",
          profession: applicant.profession || "",
          phoneNumber: applicant.phone_number || applicant.phoneNumber || "",
          password: "",
        };
        initialFormValues.current = nextForm;
        setForm(nextForm);
      } catch (err) {
        setError(err.message || "Məlumatlar yüklənmədi");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadUser();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: form.name || undefined,
        surname: form.surname || undefined,
        fatherName: form.fatherName || undefined,
        educationLevel: form.educationLevel || undefined,
        university: form.university || undefined,
        profession: form.profession || undefined,
        phoneNumber: form.phoneNumber || undefined,
        password: form.password || undefined,
      };

      await adminApi.updateUserData(id, payload);
      setSuccess("İstifadəçi məlumatları uğurla yeniləndi");
      setForm((prev) => ({ ...prev, password: "" }));
      initialFormValues.current = {
        ...initialFormValues.current,
        ...form,
        password: "",
      };
    } catch (err) {
      setError(err.message || "Yeniləmə uğursuz oldu");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, display: "flex", justifyContent: "center" }}>
        <RadarLoader message="Məlumatlar yüklənir" />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{ py: { xs: 1, md: 3 }, px: { xs: 0, sm: 2 } }}
    >
      <Box
        sx={{
          bgcolor: C.paperRaised,
          border: `1px solid ${C.rule}`,
          animation: `sg-fade-up .6s ${EASE.out} backwards`,
        }}
      >
        <TricolorBar height={4} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{
            p: { xs: 2.5, md: 4 },
            pb: { xs: 2, md: 3 },
            borderBottom: `2px solid ${C.text}`,
          }}
        >
          <Box>
            <Box
              sx={{
                fontFamily: FONT.mono,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                color: C.brassDark,
                mb: 0.5,
              }}
            >
              FORMA · REDAKTƏ
            </Box>
            <Typography variant="h4" component="h1">
              İstifadəçi məlumatlarını redaktə et
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Şəxsi məlumatlar, təhsil və telefon nömrəsi dəyişdirilə bilər.
              Şifrə də yenilənə bilər.
            </Typography>
          </Box>
          <Button
            startIcon={<MdArrowBack />}
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Geri
          </Button>
        </Stack>

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <InfoCard
            title="Redaktə forması"
            icon={<MdEditDocument size={18} />}
            actions={
              <Box
                sx={{
                  ...labelCaps,
                  fontSize: "0.7rem",
                  px: 1,
                  py: 0.25,
                  border: `1px solid ${C.brassDark}`,
                  color: C.brassDark,
                }}
              >
                Superadmin
              </Box>
            }
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Yalnız superadmin bu səhifəni istifadə edə bilər
            </Typography>
            <Box key={id} component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ad"
                    name="name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Soyad"
                    name="surname"
                    fullWidth
                    value={form.surname}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Ata adı"
                    name="fatherName"
                    fullWidth
                    value={form.fatherName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Telefon"
                    name="phoneNumber"
                    fullWidth
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="+994501234567"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    label="Təhsil"
                    name="educationLevel"
                    fullWidth
                    value={form.educationLevel}
                    onChange={handleChange}
                  >
                    {educationLevelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Universitet"
                    name="university"
                    fullWidth
                    value={form.university}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Peşə"
                    name="profession"
                    fullWidth
                    value={form.profession}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Yeni şifrə"
                    name="password"
                    type="password"
                    fullWidth
                    value={form.password}
                    onChange={handleChange}
                    helperText="Boş buraxsanız, şifrə dəyişdirilməyəcək"
                  />
                </Grid>
              </Grid>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<MdSave />}
                  disabled={submitting}
                >
                  {submitting ? "Yadda saxlanılır..." : "Yadda saxla"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/")}>
                  Ləğv et
                </Button>
              </Stack>
            </Box>
          </InfoCard>
        </Box>
      </Box>
    </Container>
  );
}

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import { adminApi } from "../api/adminApi";
import { educationLevelOptions } from "../constants/educationLevelOptions";

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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              İstifadəçi məlumatlarını redaktə et
            </Typography>
            <Typography variant="body2" color="text.secondary">
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

        <Card variant="outlined">
          <CardHeader
            title="Redaktə forması"
            subheader="Yalnız superadmin bu səhifəni istifadə edə bilər"
            action={<Chip label="Superadmin" color="primary" size="small" />}
          />
          <CardContent>
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
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
}

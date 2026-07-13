import CloseIcon from "@mui/icons-material/Close";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { authApi } from "../../../api/authApi";
import { validate } from "../../validation/validators";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  repeatPassword: "",
  role: "admin",
};

const CreateAdminModal = ({ modalOpen, onClose }) => {
  const [form, setForm] = React.useState(initialFormState);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  React.useEffect(() => {
    if (!modalOpen) {
      setForm(initialFormState);
      setErrors({});
    }
  }, [modalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = await validate(form);
      const newErrors = { ...validation.errors };

      if (form.password !== form.repeatPassword) {
        newErrors.repeatPassword = "Şifrələr bir-biri ilə uyğun deyil";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      await authApi.createAdmin({
        email: form.email,
        password: form.password,
        name: form.name,
        type: form.role,
      });

      onClose();
      setTimeout(() => setForm(initialFormState), 300);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
    >
      <Fade in={modalOpen} timeout={400}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            width: 400,
          }}
        >
          <IconButton
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Yeni adminin məlumatları
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Ad"
                value={form.name}
                onChange={handleChange}
                fullWidth
                placeholder="Ad"
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="email"
                label="E-Mail Ünvanı"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                placeholder="Email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password"
                label="Şifrə"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                placeholder="Şifrə"
                error={!!errors.password}
                helperText={errors.password}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="repeatPassword"
                label="Şifrəni Təkrar Daxil Et"
                type="password"
                value={form.repeatPassword}
                onChange={handleChange}
                fullWidth
                placeholder="Təkrar Şifrə"
                error={!!errors.repeatPassword}
                helperText={errors.repeatPassword}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-label">Rolu</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  label="Rolu"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} textAlign="right">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Yaradılır..." : "Yarat"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CreateAdminModal;

import { Grid, Box, Stack, Typography } from "@mui/material";
import FormField from "../common/FormField";
import { roleOptions } from "../../constants/options/roleOptions";
import { C } from "../../config/tokens";

const TemporaryRegistrationStep = ({ values, onChange, errors = {} }) => (
  <Box>
    <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 3 }}>
      <Typography variant="h6" component="h2">
        Qeydiyyat məlumatları
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: C.rule, alignSelf: "center" }} />
    </Stack>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <FormField
          name="name"
          label="Ad"
          value={values.name}
          onChange={onChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          name="surname"
          label="Soyad"
          value={values.surname}
          onChange={onChange}
          error={!!errors.surname}
          helperText={errors.surname}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          type="select"
          name="role"
          label="Rolu"
          value={values.role || "trainee"}
          onChange={onChange}
          options={roleOptions}
          error={!!errors.role}
          helperText={errors.role}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          name="nationalIdNumber"
          label="FİN kodu"
          value={values.nationalIdNumber}
          onChange={onChange}
          error={!!errors.nationalIdNumber}
          helperText={errors.nationalIdNumber}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          type="tel"
          name="phoneNumber"
          label="Telefon"
          value={values.phoneNumber}
          onChange={onChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          required
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          type="email"
          name="email"
          label="Email"
          value={values.email}
          onChange={onChange}
          error={!!errors.email}
          helperText={errors.email}
          required
        />
      </Grid>
    </Grid>
  </Box>
);

export default TemporaryRegistrationStep;

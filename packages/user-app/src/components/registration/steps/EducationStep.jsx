import { Grid, Box, Typography } from "@mui/material";
import FormField from "../../common/FormField";
import { educationLevelOptions } from "../../../constants/options/educationLevelOptions";
import { universityOptions } from "../../../constants/options/universityOptions";
import { professionOptions } from "../../../constants/options/professionOptions";

const EducationStep = ({ values, onChange, errors = {} }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Təhsil məlumatları
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormField
            type="select"
            name="educationLevel"
            label="Təhsil pilləsi"
            value={values.educationLevel}
            onChange={onChange}
            options={educationLevelOptions}
            error={!!errors.educationLevel}
            helperText={errors.educationLevel}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="autocomplete"
            name="university"
            label="Universitet"
            value={values.university}
            onChange={onChange}
            options={universityOptions}
            error={!!errors.university}
            helperText={errors.university}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            type="autocomplete"
            name="profession"
            label="İxtisas"
            value={values.profession}
            onChange={onChange}
            options={professionOptions}
            error={!!errors.profession}
            helperText={errors.profession}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EducationStep;

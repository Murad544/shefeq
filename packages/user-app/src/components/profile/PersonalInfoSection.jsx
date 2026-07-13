import { Person as PersonIcon } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import CollapsibleSection from "../common/CollapsibleSection";
import { educationLevelOptions, professionOptions } from "../../constants/options";
import { getOptionLabel } from "../../utils/getOptionLabel";

const PersonalInfoSection = ({ personalInfo }) => {
  return (
    <CollapsibleSection title="Şəxsi Məlumatlar" icon={PersonIcon}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            AD SOYAD
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {personalInfo?.name || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            TƏHSİL SƏVİYYƏSİ
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {getOptionLabel(educationLevelOptions, personalInfo?.educationLevel)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            DOĞUM TARİXİ
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {personalInfo?.dateOfBirth || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            UNİVERSİTET
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {personalInfo?.university || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            DOĞUM YERİ
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {personalInfo?.birthPlace || "-"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" display="block">
            PEŞƏ
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {getOptionLabel(professionOptions, personalInfo?.profession)}
          </Typography>
        </Grid>
      </Grid>
    </CollapsibleSection>
  );
};

export default PersonalInfoSection;

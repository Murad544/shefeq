import { Person as PersonIcon } from "@mui/icons-material";
import { Grid } from "@mui/material";
import CollapsibleSection from "../common/CollapsibleSection";
import DataField from "../military/DataField";
import { educationLevelOptions, professionOptions } from "../../constants/options";
import { getOptionLabel } from "../../utils/getOptionLabel";

const PersonalInfoSection = ({ personalInfo }) => {
  const fields = [
    { label: "Ad soyad", value: personalInfo?.name, translateValue: false },
    {
      label: "Təhsil səviyyəsi",
      value: getOptionLabel(educationLevelOptions, personalInfo?.educationLevel),
    },
    { label: "Doğum tarixi", value: personalInfo?.dateOfBirth, mono: true },
    { label: "Universitet", value: personalInfo?.university, translateValue: false },
    { label: "Doğum yeri", value: personalInfo?.birthPlace, translateValue: false },
    {
      label: "Peşə",
      value: getOptionLabel(professionOptions, personalInfo?.profession),
    },
  ];

  return (
    <CollapsibleSection title="Şəxsi Məlumatlar" icon={PersonIcon} defaultOpen>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.label}>
            <DataField label={field.label} value={field.value} mono={field.mono} translateValue={field.translateValue} />
          </Grid>
        ))}
      </Grid>
    </CollapsibleSection>
  );
};

export default PersonalInfoSection;

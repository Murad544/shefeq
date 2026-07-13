import { Grid, Skeleton } from "@mui/material";
import { MdPerson } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import FieldRow from "../../../ui/Forms/FieldRow";

export default function PersonalInfo({ loading, personalFields }) {
  return (
    <InfoCard title="Şəxsi Məlumatlar" icon={<MdPerson size={20} />}>
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="text" height={60} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {personalFields.map(([label, value]) => (
            <FieldRow key={label} label={label} value={value} xs={12} sm={6} />
          ))}
        </Grid>
      )}
    </InfoCard>
  );
}

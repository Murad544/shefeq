import { Grid, Skeleton } from "@mui/material";
import { MdSchool } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import FieldRow from "../../../ui/Forms/FieldRow";

export default function EducationInfo({ loading, educationFields }) {
  return (
    <InfoCard title="Təhsil və Karyera" icon={<MdSchool size={20} />}>
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="text" height={60} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {educationFields.map(([label, value]) => (
            <FieldRow key={label} label={label} value={value} xs={12} />
          ))}
        </Grid>
      )}
    </InfoCard>
  );
}

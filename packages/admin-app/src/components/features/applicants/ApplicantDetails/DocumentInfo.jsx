import { Grid, Skeleton } from "@mui/material";
import { MdDescription } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import FieldRow from "../../../ui/Forms/FieldRow";

export default function DocumentInfo({ loading, documentFields }) {
  return (
    <InfoCard title="Sənəd Məlumatları" icon={<MdDescription size={20} />}>
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Skeleton variant="text" height={60} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {documentFields.map(([label, value]) => (
            <FieldRow key={label} label={label} value={value} xs={12} sm={6} />
          ))}
        </Grid>
      )}
    </InfoCard>
  );
}

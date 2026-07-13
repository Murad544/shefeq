import { Grid, Skeleton } from "@mui/material";
import { MdContactMail, MdPhone, MdEmail } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import FieldRow from "../../../ui/Forms/FieldRow";

export default function ContactInfo({ loading, contactFields }) {
  return (
    <InfoCard title="Əlaqə Məlumatları" icon={<MdContactMail size={20} />}>
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Grid item xs={12} key={i}>
              <Skeleton variant="text" height={60} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <FieldRow
            label="Telefon"
            value={contactFields[0][1]}
            icon={<MdPhone size={16} />}
            xs={12}
          />
          <FieldRow
            label="E-poçt"
            value={contactFields[1][1]}
            icon={<MdEmail size={16} />}
            xs={12}
          />
        </Grid>
      )}
    </InfoCard>
  );
}

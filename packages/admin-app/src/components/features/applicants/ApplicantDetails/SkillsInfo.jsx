import { Grid, Typography, Skeleton } from "@mui/material";
import { MdWork } from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import SkillsChips from "../../../ui/Display/SkillsChips";

export default function SkillsInfo({ loading, skills, isMobile }) {
  return (
    <InfoCard title="Bacarıqlar" icon={<MdWork size={20} />}>
      {loading ? (
        <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
      ) : skills?.length ? (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <SkillsChips
              value={skills}
              limit={isMobile ? 3 : 6}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Bacarıq məlumatı yoxdur
        </Typography>
      )}
    </InfoCard>
  );
}

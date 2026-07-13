import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { createCardStyles } from "../../../styles/commonStyles";

export default function InfoCard({ title, children, icon, actions }) {
  return (
    <Card sx={{ ...createCardStyles(), mb: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs="auto">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 32, md: 36 },
                height: { xs: 32, md: 36 },
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              {icon}
            </Box>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              {title}
            </Typography>
          </Grid>
          {actions && (
            <Grid item xs="auto">
              {actions}
            </Grid>
          )}
        </Grid>
        {children}
      </CardContent>
    </Card>
  );
}

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { BRAND } from "../../config/brand";
import { STRINGS } from "../../config/constants";
import { C, FONT } from "../../config/tokens";
import BrandLockup from "../military/BrandLockup";
import TricolorBar from "../military/TricolorBar";

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: C.field900, color: C.textOnDarkMuted }}>
    <TricolorBar height={4} />
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 5 } }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack spacing={1.5}>
            <BrandLockup size="lg" />
            <Typography
              variant="caption"
              sx={{ color: C.textOnDark, letterSpacing: "0.08em" }}
            >
              {BRAND.ORGANIZATION_NAME}
            </Typography>
            <Typography variant="body2" sx={{ color: C.textOnDarkMuted }}>
              {BRAND.COURSE_NAME}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              textAlign: { xs: "left", md: "right" },
              fontFamily: FONT.mono,
              fontSize: "0.72rem",
              letterSpacing: "0.06em",
              lineHeight: 1.9,
            }}
          >
            <Box>
              © {new Date().getFullYear()} {BRAND.PROJECT_NAME}. {STRINGS.COPYRIGHT}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Footer;

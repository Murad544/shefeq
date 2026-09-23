import {
  Box,
  Typography,
  Grid,
  Container,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { Email, Phone, LocationOn, Send } from "@mui/icons-material";
import { C, FONT, labelCaps } from "../../config/tokens";
import Emblem from "../military/Emblem";
import Panel from "../military/Panel";
import Reveal from "../military/Reveal";
import SectionHeader from "../military/SectionHeader";
import TricolorBar from "../military/TricolorBar";

/* Telefon: (012) 404-18-45
Çağrı mərkəzi: *0811
E-poçt: mmu@mod.gov.az
Müraciət üçün e-poçt: mmu-muraciet@mod.gov.az
Ünvan: Bakı şəhəri, Qızıl Şərq 13. AZ1065*/
const contacts = [
  { icon: Email, label: "E-poçt", value: "mmu@mod.gov.az", mono: true },
  { icon: Phone, label: "Telefon", value: "(012) 404-18-45", mono: true },
  { icon: LocationOn, label: "Ünvan", value: "Bakı şəhəri, Qızıl Şərq 13. AZ1065" },
];

const ContactUs = () => (
  <Box
    component="section"
    sx={{ position: "relative", bgcolor: C.paper, py: { xs: 10, md: 14 } }}
  >
    <Container maxWidth="lg">
      <Reveal>
        <SectionHeader
          overline="Əlaqə"
          title="Bizimlə əlaqə"
          subtitle="Əlavə suallarınız üçün bizimlə əlaqə saxlayın. Müraciətiniz ən qısa zamanda cavablandırılacaq."
        />
      </Reveal>

      <Grid container spacing={3} alignItems="stretch">
        {/* SOL – Məlumat */}
        <Grid item xs={12} md={5}>
          <Reveal sx={{ height: "100%" }}>
            <Box
              sx={{
                position: "relative",
                height: "100%",
                bgcolor: C.field800,
                color: C.textOnDark,
                p: { xs: 3, md: 4 },
                overflow: "hidden",
              }}
            >
              <TricolorBar
                height={4}
                sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
              />
              <Emblem
                decorative
                size={260}
                opacity={0.06}
                sx={{ position: "absolute", right: -50, bottom: -40 }}
              />
              <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 4, position: "relative" }}>
                <Emblem size={64} />
                <Box>
                  <Typography variant="overline" sx={{ color: C.brass, display: "block", lineHeight: 1.4 }}>
                    Rəsmi əlaqə
                  </Typography>
                  <Typography sx={{ ...labelCaps, fontSize: "1.1rem", color: C.textOnDark }}>
                    Əlaqə məlumatları
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={0} sx={{ position: "relative" }}>
                {contacts.map(({ icon: Icon, label, value, mono }) => (
                  <Stack
                    key={label}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    sx={{ py: 2, borderTop: `1px solid ${C.lineDark}` }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${C.lineDarkStrong}`,
                        color: C.brass,
                      }}
                    >
                      <Icon sx={{ fontSize: 18 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ ...labelCaps, fontSize: "0.7rem", color: C.textOnDarkMuted, mb: 0.25 }}>
                        {label}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: mono ? FONT.mono : FONT.body,
                          fontSize: mono ? "0.95rem" : "1rem",
                          wordBreak: "break-word",
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Reveal>
        </Grid>

        {/* SAĞ – Forma */}
        <Grid item xs={12} md={7}>
          <Reveal delay={120} sx={{ height: "100%" }}>
            <Panel title="Müraciət forması" sx={{ height: "100%" }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Ad" variant="outlined" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="E-poçt" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Mövzu" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mesaj"
                    multiline
                    rows={5}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" size="large" endIcon={<Send />}>
                    Mesaj Göndər
                  </Button>
                </Grid>
              </Grid>
            </Panel>
          </Reveal>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default ContactUs;

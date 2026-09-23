import { Box, Typography, Container, Stack } from "@mui/material";
import {
  Air,
  Public,
  Timeline,
  SettingsRemote,
  Thunderstorm,
  School,
} from "@mui/icons-material";
import { C } from "../../config/tokens";
import CornerBrackets from "../military/CornerBrackets";
import Reveal from "../military/Reveal";
import SectionHeader from "../military/SectionHeader";
import TacticalBackground from "../military/TacticalBackground";

const features = [
  {
    icon: Air,
    title: "Realistik Fizika",
    description:
      "Külək, cazibə qüvvəsi və pərvanə dinamikasını yüksək dəqiqliklə simulyasiya edən inkişaf etmiş aerodinamika mühərriki.",
  },
  {
    icon: Public,
    title: "Real Dünya Əraziləri",
    description:
      "Şəhərlərdən dağlara qədər dünya üzrə fotogrammetriya ilə skan edilmiş mühitlər üzərində uçuş.",
  },
  {
    icon: Timeline,
    title: "Canlı Telemetriya",
    description:
      "Hündürlük, sürət, batareya, siqnal gücü və GPS məlumatlarını real vaxtda izləyin.",
  },
  {
    icon: SettingsRemote,
    title: "Pult Dəstəyi",
    description:
      "Məşhur RC ötürücülər, gamepad-lər və fərdi qurğularla tam uyğunluq.",
  },
  {
    icon: Thunderstorm,
    title: "Hava Sistemi",
    description:
      "Külək şiddətlənmələri, yağış, duman və turbulentlik daxil olmaqla dinamik hava şəraiti.",
  },
  {
    icon: School,
    title: "Təlim Missiyaları",
    description:
      "Yeni başlayanlar üçün hover məşqlərindən tutmuş, inkişaf etmiş FPV yarış treklərinə qədər strukturlaşdırılmış kurslar.",
  },
];

const Information = () => (
  <Box
    component="section"
    sx={{
      position: "relative",
      bgcolor: C.paper,
      py: { xs: 10, md: 14 },
      overflow: "hidden",
    }}
  >
    <TacticalBackground tone="light" topo={false} vignette={false} />
    <Container maxWidth="lg" sx={{ position: "relative" }}>
      <Reveal>
        <SectionHeader
          overline="İmkanlar"
          title="Simulyasiya xüsusiyyətləri"
          subtitle="Peşəkar pilot kimi məşq etmək üçün lazım olan hər şey."
        />
      </Reveal>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
          borderTop: `1px solid ${C.ruleStrong}`,
          borderLeft: `1px solid ${C.ruleStrong}`,
        }}
      >
        {features.map(({ icon: Icon, title, description }, index) => (
          <Reveal
            key={title}
            delay={index * 80}
            sx={{
              borderRight: `1px solid ${C.ruleStrong}`,
              borderBottom: `1px solid ${C.ruleStrong}`,
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "100%",
                p: { xs: 3, md: 4 },
                bgcolor: "rgba(251, 250, 245, 0.7)",
                transition: "background-color .3s ease",
                "& .sg-brackets": {
                  opacity: 0,
                  transform: "scale(1.06)",
                  transition: "opacity .3s ease, transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
                },
                "&:hover": { bgcolor: C.paperRaised },
                "&:hover .sg-brackets": { opacity: 1, transform: "none" },
                "&:hover .sg-icon": {
                  bgcolor: C.olive,
                  borderColor: C.olive,
                  color: C.paper,
                },
              }}
            >
              <CornerBrackets size={12} inset={10} color={C.brassDark} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 3 }}
              >
                <Box
                  className="sg-icon"
                  sx={{
                    width: 52,
                    height: 52,
                    display: "grid",
                    placeItems: "center",
                    border: `1px solid ${C.ruleStrong}`,
                    color: C.olive,
                    transition: "all .3s ease",
                  }}
                >
                  <Icon sx={{ fontSize: 26 }} />
                </Box>
              </Stack>
              <Typography variant="h6" sx={{ mb: 1.25 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: C.textMuted, lineHeight: 1.7 }}>
                {description}
              </Typography>
            </Box>
          </Reveal>
        ))}
      </Box>
    </Container>
  </Box>
);

export default Information;

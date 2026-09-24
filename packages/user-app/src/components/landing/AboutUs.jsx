import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import {
  RocketLaunch,
  Engineering,
  Public,
  EmojiObjects,
} from "@mui/icons-material";
import { C } from "../../config/tokens";
import Reveal from "../military/Reveal";
import SectionHeader from "../military/SectionHeader";
import TacticalBackground from "../military/TacticalBackground";

const values = [
  {
    icon: RocketLaunch,
    title: "İnnovasiya",
    description:
      "Biz inkişaf etmiş fizika mühərrikləri və immersiv dron mühitləri ilə simulyasiya texnologiyasını davamlı olaraq irəli aparırıq.",
  },
  {
    icon: Engineering,
    title: "Mühəndislik Mükəmməlliyi",
    description:
      "Realizm və performansın optimallaşdırılmasına fokuslanan aviasiya mühəndisləri və proqram təminatı mütəxəssisləri tərəfindən hazırlanıb.",
  },
  {
    icon: Public,
    title: "Qlobal İcma",
    description:
      "Biz dünya üzrə dron pilotlarını, həvəskarları və peşəkarları rəqabət və təlim yönümlü alətlərlə dəstəkləyirik.",
  },
  {
    icon: EmojiObjects,
    title: "Gələcək Baxışı",
    description:
      "Missiyamız təlim, yarış və analitika üçün aparıcı dron simulyasiya ekosisteminə çevrilməkdir.",
  },
];

const paragraphs = [
  "Biz aviasiya mühəndisləri, proqramçılar və dron texnologiyaları sahəsində ixtisaslaşmış peşəkarlardan ibarət komandayıq.",
  "Məqsədimiz müasir texnologiyalar əsasında realistik dron simulyasiya platforması yaradaraq, dron operatoru hazırlığı prosesini yeni səviyyəyə yüksəltməkdir.",
  "Platformamız qabaqcıl alətlər, inkişaf etmiş analitik imkanlar və müxtəlif real uçuş ssenarilərini əhatə edən simulyasiya mühitləri təqdim edir.",
];

const AboutUs = () => (
  <Box
    component="section"
    sx={{
      position: "relative",
      bgcolor: C.field900,
      color: C.textOnDark,
      py: { xs: 10, md: 14 },
      overflow: "hidden",
    }}
  >
    <TacticalBackground />
    <Container maxWidth="lg" sx={{ position: "relative" }}>
      <Grid container spacing={{ xs: 6, md: 8 }}>
        <Grid item xs={12} md={5}>
          <Reveal>
            <SectionHeader
              dark
              overline="Haqqımızda"
              title="Biz kimik"
              sx={{ mb: 4 }}
            />
          </Reveal>
          <Reveal delay={120}>
            <Stack spacing={2} sx={{ borderLeft: `2px solid ${C.brass}`, pl: 3 }}>
              {paragraphs.map((text) => (
                <Typography
                  key={text.slice(0, 24)}
                  sx={{ color: C.textOnDarkMuted, lineHeight: 1.8, fontSize: "1.02rem" }}
                >
                  {text}
                </Typography>
              ))}
            </Stack>
          </Reveal>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              borderTop: `1px solid ${C.lineDarkStrong}`,
              borderLeft: `1px solid ${C.lineDarkStrong}`,
            }}
          >
            {values.map(({ icon: Icon, title, description }, index) => (
              <Reveal
                key={title}
                delay={index * 90}
                sx={{
                  borderRight: `1px solid ${C.lineDarkStrong}`,
                  borderBottom: `1px solid ${C.lineDarkStrong}`,
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 4 },
                    transition: "background-color .3s ease",
                    "&:hover": { bgcolor: "rgba(201, 166, 70, 0.05)" },
                    "&:hover .sg-rule": { transform: "scaleX(1)" },
                  }}
                >
                  <Icon sx={{ color: C.brass, fontSize: 30, mb: 2.5, display: "block" }} />
                  <Typography variant="h6" sx={{ color: C.textOnDark, mb: 1 }}>
                    {title}
                  </Typography>
                  <Box
                    className="sg-rule"
                    sx={{
                      width: 40,
                      height: 2,
                      bgcolor: C.brass,
                      mb: 1.5,
                      transform: "scaleX(0.5)",
                      transformOrigin: "left",
                      transition: "transform .35s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: C.textOnDarkMuted, lineHeight: 1.7 }}
                  >
                    {description}
                  </Typography>
                </Box>
              </Reveal>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default AboutUs;

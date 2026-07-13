import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  useTheme,
} from "@mui/material";
import {
  RocketLaunch,
  Engineering,
  Public,
  EmojiObjects,
} from "@mui/icons-material";

const AboutUs = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <RocketLaunch fontSize="large" color="primary" />,
      title: "İnnovasiya",
      description:
        "Biz inkişaf etmiş fizika mühərrikləri və immersiv dron mühitləri ilə simulyasiya texnologiyasını davamlı olaraq irəli aparırıq.",
    },
    {
      icon: <Engineering fontSize="large" color="secondary" />,
      title: "Mühəndislik Mükəmməlliyi",
      description:
        "Realizm və performansın optimallaşdırılmasına fokuslanan aviasiya mühəndisləri və proqram təminatı mütəxəssisləri tərəfindən hazırlanıb.",
    },
    {
      icon: <Public fontSize="large" color="primary" />,
      title: "Qlobal İcma",
      description:
        "Biz dünya üzrə dron pilotlarını, həvəskarları və peşəkarları rəqabət və təlim yönümlü alətlərlə dəstəkləyirik.",
    },
    {
      icon: <EmojiObjects fontSize="large" color="secondary" />,
      title: "Gələcək Baxışı",
      description:
        "Missiyamız təlim, yarış və analitika üçün aparıcı dron simulyasiya ekosisteminə çevrilməkdir.",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        
        py: { xs: 8, md: 12 },
       
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* SOL TƏRƏF – MƏTN */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 2,
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
            >
              HAQQIMIZDA
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1,
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Biz Kimik
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
                Biz aviasiya mühəndisləri, proqramçılar və dron texnologiyaları sahəsində ixtisaslaşmış peşəkarlardan ibarət komandayıq.<br/> Məqsədimiz müasir texnologiyalar əsasında realistik dron simulyasiya platforması yaradaraq, dron operatoru hazırlığı prosesini yeni səviyyəyə yüksəltməkdir.

<br/>Platformamız qabaqcıl alətlər, inkişaf etmiş analitik imkanlar və müxtəlif real uçuş ssenarilərini əhatə edən simulyasiya mühitləri təqdim edir.
</Typography>
          </Grid>

          {/* SAĞ TƏRƏF – DƏYƏR BLOKLARI */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              {values.map((value, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      height: "100%",
                      boxShadow:
                        "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box mb={2}>{value.icon}</Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {value.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {value.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;

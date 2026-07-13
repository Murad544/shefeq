import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  useTheme,
} from "@mui/material";
import {
  Air,
  Public,
  Timeline,
  SettingsRemote,
  Thunderstorm,
  School,
} from "@mui/icons-material";

const Information = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <Air fontSize="large" color="primary" />,
      title: "Realistik Fizika",
      description:
        "Külək, cazibə qüvvəsi və pərvanə dinamikasını yüksək dəqiqliklə simulyasiya edən inkişaf etmiş aerodinamika mühərriki.",
    },
    {
      icon: <Public fontSize="large" color="secondary" />,
      title: "Real Dünya Əraziləri",
      description:
        "Şəhərlərdən dağlara qədər dünya üzrə fotogrammetriya ilə skan edilmiş mühitlər üzərində uçuş.",
    },
    {
      icon: <Timeline fontSize="large" color="primary" />,
      title: "Canlı Telemetriya",
      description:
        "Hündürlük, sürət, batareya, siqnal gücü və GPS məlumatlarını real vaxtda izləyin.",
    },
    {
      icon: <SettingsRemote fontSize="large" color="secondary" />,
      title: "Pult Dəstəyi",
      description:
        "Məşhur RC ötürücülər, gamepad-lər və fərdi qurğularla tam uyğunluq.",
    },
    {
      icon: <Thunderstorm fontSize="large" color="primary" />,
      title: "Hava Sistemi",
      description:
        "Külək şiddətlənmələri, yağış, duman və turbulentlik daxil olmaqla dinamik hava şəraiti.",
    },
    {
      icon: <School fontSize="large" color="secondary" />,
      title: "Təlim Missiyaları",
      description:
        "Yeni başlayanlar üçün hover məşqlərindən tutmuş, inkişaf etmiş FPV yarış treklərinə qədər strukturlaşdırılmış kurslar.",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 8, md: 12 },
        background: "#f7f9fc",
      }}
    >
      <Container maxWidth="xl">
        {/* Bölmə Etiketi */}
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          İMKANLAR
        </Typography>

        {/* Əsas Başlıq */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mt: 1,
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SİMULYASİYA XÜSUSİYYƏTLƏRİ
        </Typography>

        {/* Alt Başlıq */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 700 }}
        >
          Peşəkar pilot kimi məşq etmək üçün lazım olan hər şey.
        </Typography>

        {/* Xüsusiyyətlər Şəbəkəsi */}
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 4,
                  boxShadow:
                    "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box mb={2}>{feature.icon}</Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Information;

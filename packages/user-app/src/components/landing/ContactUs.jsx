import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { Email, Phone, LocationOn } from "@mui/icons-material";

const R2_BASE_URL = process.env.REACT_APP_R2_BASE_URL;
const AzerbaijaniLogo = `${R2_BASE_URL}/photos/Azerbaijani_Armed_Forces_logo.png`;

const ContactUs = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
       
        py: { xs: 8, md: 12 },
        
      }}
    >
      <Container maxWidth="md">
        {/* Bölmə Başlığı */}
        <Box textAlign="center" mb={6}>
          

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
            BİZİMLƏ ƏLAQƏ
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Əlavə suallarınız üçün bizimlə əlaqə saxlayın.
            <br/> Müraciətiniz ən qısa zamanda cavablandırılacaq.
          </Typography>
        </Box>

        {/* Əlaqə Kartı */}
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Grid container spacing={6}>
            {/* SOL – Məlumat */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" gap={3}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Email color="primary" />
                  <Typography variant="body1">mmu@mod.gov.az</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <Phone color="primary" />
                  <Typography variant="body1">(012) 404-18-45</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOn color="primary" />
                  <Typography variant="body1">
                    Bakı şəhəri, Qızıl Şərq 13. AZ1065
                  </Typography>
                </Box>
                <Box sx={{
                  backgroundImage: `url(${AzerbaijaniLogo})`,
                  backgroundPosition: "top center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  width: "100%",
                  height: "200px",
                  mt: 3,
                }}>
                </Box>
              

              </Box>
            </Grid>
            {/* Telefon: (012) 404-18-45
Çağrı mərkəzi: *0811
E-poçt: mmu@mod.gov.az
Müraciət üçün e-poçt: mmu-muraciet@mod.gov.az
Ünvan: Bakı şəhəri, Qızıl Şərq 13. AZ1065*/}

            {/* SAĞ – Forma */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
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
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      fontWeight: 700,
                      py: 1.5,
                      px: 5,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 12px 40px rgba(54,79,107,0.4)`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Mesaj Göndər
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ContactUs;

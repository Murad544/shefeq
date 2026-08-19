import {
  Box,
  Typography,
  Divider,
  Grid,
  Chip,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Person,
  School,
  EmojiObjects,
  QuestionAnswer,
  Attachment,
  VideoFile,
  PictureAsPdf,
  CheckCircle,
  Phone,
  Email,
  DateRange,
  LocationOn,
  Badge,
  Fingerprint,
} from "@mui/icons-material";
import {
  sexOptions,
  roleOptions,
  placeOfBirthOptions,
  educationLevelOptions,
  universityOptions,
  professionOptions,
} from "../../../constants/options";
import { getOptionLabel } from "../../../utils/getOptionLabel";

const ReviewStep = ({ form, questions }) => {
  const personalInfoFields = [
    { label: "Ad", value: form.name, icon: <Person fontSize="small" /> },
    { label: "Soyad", value: form.surname, icon: <Person fontSize="small" /> },
    {
      label: "Ata adı",
      value: form.fatherName,
      icon: <Person fontSize="small" />,
    },
    {
      label: "Cinsi",
      value: getOptionLabel(sexOptions, form.sex),
      icon: <Badge fontSize="small" />,
    },
    {
      label: "Rolu",
      value: getOptionLabel(roleOptions, form.role),
      icon: <Badge fontSize="small" />,
    },
    {
      label: "Doğum tarixi",
      value: form.dateOfBirth,
      icon: <DateRange fontSize="small" />,
    },
    {
      label: "Doğulduğu yer",
      value: getOptionLabel(placeOfBirthOptions, form.placeOfBirth),
      icon: <LocationOn fontSize="small" />,
    },
    {
      label: "Şəxsiyyət vəsiqəsi",
      value: form.nationalSerialNumber,
      icon: <Badge fontSize="small" />,
    },
    {
      label: "FİN",
      value: form.nationalIdNumber,
      icon: <Fingerprint fontSize="small" />,
    },
    {
      label: "Telefon",
      value: form.phoneNumber,
      icon: <Phone fontSize="small" />,
    },
    { label: "Email", value: form.email, icon: <Email fontSize="small" /> },
  ];

  const educationFields = [
    {
      label: "Təhsil pilləsi",
      value: getOptionLabel(educationLevelOptions, form.educationLevel),
    },
    {
      label: "Universitet",
      value: getOptionLabel(universityOptions, form.university),
    },
    {
      label: "İxtisas",
      value: getOptionLabel(professionOptions, form.profession),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Məlumatların yoxlanışı
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Göndərmədən əvvəl bütün məlumatlarınızı yoxlayın. Səhv tapıldığı halda
        geri düyməsi ilə düzəliş edə bilərsiniz.
      </Typography>

      <Stack spacing={3}>
        {/* Personal Info with Icons */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Person />
            <Typography variant="h6" fontWeight={600}>
              Şəxsi məlumatlar
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {personalInfoFields.map((field, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ListItemIcon
                    sx={{ minWidth: "auto", color: "primary.main" }}
                  >
                    {field.icon}
                  </ListItemIcon>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                    >
                      {field.label}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {field.value || "-"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Education Info */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <School />
            <Typography variant="h6" fontWeight={600}>
              Təhsil məlumatları
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {educationFields.map((field, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {field.value || "-"}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Skills */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <EmojiObjects />
            <Typography variant="h6" fontWeight={600}>
              Bacarıqlar ({form.skills.length})
            </Typography>
          </Box>

          {form.skills.length > 0 ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {form.skills.map((skill, idx) => (
                <Chip
                  key={idx}
                  icon={<CheckCircle fontSize="small" />}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Heç bir bacarıq əlavə edilməyib
            </Typography>
          )}
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Questions */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <QuestionAnswer />
            <Typography variant="h6" fontWeight={600}>
              Açıq suallar ({questions.length})
            </Typography>
          </Box>

          <List dense>
            {questions.map((q, idx) => (
              <ListItem
                key={q.id || idx}
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 1,
                  // Ensure the list item allows wrapping
                  flexWrap: "wrap",
                }}
              >
                <ListItemIcon sx={{ mt: 1, minWidth: 40 }}>
                  <QuestionAnswer fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    // Prevent text overflow and ensure wrapping
                    overflow: "hidden",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    minWidth: 0, // Important for flex items
                    flex: 1,
                  }}
                  primary={
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{
                        mb: 1,
                        // Text wrapping styles
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap", // Preserves line breaks and wraps
                        overflowWrap: "break-word",
                      }}
                    >
                      {q.text}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        // Text wrapping styles for secondary text
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      }}
                    >
                      {form.answers[idx]?.answer || "Cavab verilməyib"}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* Files */}
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Attachment />
            <Typography variant="h6" fontWeight={600}>
              Yüklənmiş fayllar
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Video fayllar (MP4) - {form.mp4Files.length} fayl
              </Typography>
              {form.mp4Files.length > 0 ? (
                <Stack spacing={1}>
                  {form.mp4Files.map((file, idx) => (
                    <Chip
                      key={idx}
                      icon={<VideoFile />}
                      label={file.name}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Heç bir video yüklənməyib
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Sənədlər (PDF) - {form.pdfFiles.length} fayl
              </Typography>
              {form.pdfFiles.length > 0 ? (
                <Stack spacing={1}>
                  {form.pdfFiles.map((file, idx) => (
                    <Chip
                      key={idx}
                      icon={<PictureAsPdf />}
                      label={file.name}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" variant="body2">
                  Heç bir sənəd yüklənməyib
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ReviewStep;

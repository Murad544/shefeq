import { useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import { CloudUpload, VideoFile, PictureAsPdf } from "@mui/icons-material";
import { FILE_CONSTRAINTS } from "../../../config/constants";

const UploadStep = ({
  mp4Files,
  pdfFiles,
  onFileUpload,
  onFileDelete,
  errors = {},
}) => {
  const mp4InputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleFileUpload = (e, fileType) => {
    onFileUpload(e, fileType);
    // Clear input to allow re-uploading same file
    if (e.target) {
      e.target.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Təsdiqləyici materiallar
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Qeyd:</strong> Hər fayl maksimum{" "}
          {formatFileSize(FILE_CONSTRAINTS.MAX_FILE_SIZE) + " "}
          ölçüsündə olmalıdır. Video fayllar MP4, sənədlər isə PDF formatında
          olmalıdır.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* MP4 Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderColor: errors.mp4Files ? "error.main" : "grey.200",
              bgcolor: "background.paper",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VideoFile color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Video fayllar (MP4)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                FPV uçuş videolarınızı, texniki bacarıqlarınızı nümayiş etdirən
                materialları yükləyin.
              </Typography>

              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Video seç (MP4)
                <input
                  ref={mp4InputRef}
                  type="file"
                  accept="video/mp4"
                  multiple
                  hidden
                  onChange={(e) => handleFileUpload(e, "mp4Files")}
                />
              </Button>

              {errors.mp4Files && (
                <Typography color="error" variant="body2">
                  {errors.mp4Files}
                </Typography>
              )}

              {mp4Files.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Yüklənmiş videolar ({mp4Files.length})
                  </Typography>
                  <Stack spacing={1}>
                    {mp4Files.map((file, idx) => (
                      <Chip
                        key={idx}
                        icon={<VideoFile />}
                        label={`${file.name} (${formatFileSize(file.size)})`}
                        onDelete={() => onFileDelete("mp4Files", idx)}
                        color="primary"
                        variant="outlined"
                        sx={{ justifyContent: "flex-start" }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* PDF Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderColor: errors.pdfFiles ? "error.main" : "grey.200",
              bgcolor: "background.paper",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PictureAsPdf color="secondary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Sənədlər (PDF)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                CV, sertifikatlar, diplomlar və digər təsdiqləyici sənədlərinizi
                yükləyin.
              </Typography>

              <Button
                variant="contained"
                component="label"
                color="secondary"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Sənəd seç (PDF)
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  hidden
                  onChange={(e) => handleFileUpload(e, "pdfFiles")}
                />
              </Button>

              {errors.pdfFiles && (
                <Typography color="error" variant="body2">
                  {errors.pdfFiles}
                </Typography>
              )}

              {pdfFiles.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Yüklənmiş sənədlər ({pdfFiles.length})
                  </Typography>
                  <Stack spacing={1}>
                    {pdfFiles.map((file, idx) => (
                      <Chip
                        key={idx}
                        icon={<PictureAsPdf />}
                        label={`${file.name} (${formatFileSize(file.size)})`}
                        onDelete={() => onFileDelete("pdfFiles", idx)}
                        color="secondary"
                        variant="outlined"
                        sx={{ justifyContent: "flex-start" }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadStep;

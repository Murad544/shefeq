import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CloudUpload, VideoFile, PictureAsPdf, Delete, UploadFile } from "@mui/icons-material";
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

  const [dragOverMp4, setDragOverMp4] = useState(false);
  const [dragOverPdf, setDragOverPdf] = useState(false);

  const handleFileUpload = (e, fileType) => {
    onFileUpload(e, fileType);
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = (e, fileType, expectedMime) => {
    e.preventDefault();
    e.stopPropagation();

    if (fileType === "mp4Files") setDragOverMp4(false);
    if (fileType === "pdfFiles") setDragOverPdf(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      expectedMime === "video/mp4"
        ? file.type === "video/mp4" || file.name.endsWith(".mp4")
        : file.type === "application/pdf" || file.name.endsWith(".pdf")
    );

    if (droppedFiles.length > 0) {
      const syntheticEvent = { target: { files: droppedFiles } };
      onFileUpload(syntheticEvent, fileType);
    }
  };

  const handleDragOver = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === "mp4Files" && !dragOverMp4) setDragOverMp4(true);
    if (fileType === "pdfFiles" && !dragOverPdf) setDragOverPdf(true);
  };

  const handleDragLeave = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileType === "mp4Files") setDragOverMp4(false);
    if (fileType === "pdfFiles") setDragOverPdf(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
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

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>Qeyd:</strong> Hər fayl maksimum{" "}
          {formatFileSize(FILE_CONSTRAINTS.MAX_FILE_SIZE) + " "}
          ölçüsündə olmalıdır. Video fayllar MP4, sənədlər isə PDF formatında
          olmalıdır. Faylları klikləyərək və ya dartıb daxilə buraxaraq yükləyə bilərsiniz.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* MP4 Upload Section */}
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            onDragOver={(e) => handleDragOver(e, "mp4Files")}
            onDragLeave={(e) => handleDragLeave(e, "mp4Files")}
            onDrop={(e) => handleDrop(e, "mp4Files", "video/mp4")}
            sx={{
              p: 3,
              borderRadius: 3,
              borderColor: errors.mp4Files
                ? "error.main"
                : dragOverMp4
                ? "primary.main"
                : "grey.300",
              bgcolor: dragOverMp4 ? "action.hover" : "background.paper",
              borderStyle: dragOverMp4 ? "dashed" : "solid",
              borderWidth: 2,
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VideoFile color="primary" fontSize="medium" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Video fayllar (MP4)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                FPV uçuş videolarınızı, texniki bacarıqlarınızı nümayiş etdirən
                materialları yükləyin.
              </Typography>

              <Box
                onClick={() => mp4InputRef.current?.click()}
                sx={{
                  border: "2px dashed",
                  borderColor: dragOverMp4 ? "primary.main" : "primary.light",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "background.default",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <UploadFile color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="primary">
                  Faylı buraya sürüşdürün və ya klikləyin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maksimum 10 video (MP4)
                </Typography>
                <input
                  ref={mp4InputRef}
                  type="file"
                  accept="video/mp4"
                  multiple
                  hidden
                  onChange={(e) => handleFileUpload(e, "mp4Files")}
                />
              </Box>

              {errors.mp4Files && (
                <Typography color="error" variant="body2">
                  {errors.mp4Files}
                </Typography>
              )}

              {mp4Files.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Yüklənmiş videolar ({mp4Files.length})
                  </Typography>
                  <Stack spacing={1}>
                    {mp4Files.map((file, idx) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
                          <VideoFile color="primary" />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onFileDelete("mp4Files", idx)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
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
            onDragOver={(e) => handleDragOver(e, "pdfFiles")}
            onDragLeave={(e) => handleDragLeave(e, "pdfFiles")}
            onDrop={(e) => handleDrop(e, "pdfFiles", "application/pdf")}
            sx={{
              p: 3,
              borderRadius: 3,
              borderColor: errors.pdfFiles
                ? "error.main"
                : dragOverPdf
                ? "secondary.main"
                : "grey.300",
              bgcolor: dragOverPdf ? "action.hover" : "background.paper",
              borderStyle: dragOverPdf ? "dashed" : "solid",
              borderWidth: 2,
              transition: "all 0.2s ease-in-out",
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PictureAsPdf color="secondary" fontSize="medium" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Sənədlər (PDF)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                CV, sertifikatlar, diplomlar və digər təsdiqləyici sənədlərinizi
                yükləyin.
              </Typography>

              <Box
                onClick={() => pdfInputRef.current?.click()}
                sx={{
                  border: "2px dashed",
                  borderColor: dragOverPdf ? "secondary.main" : "secondary.light",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: "background.default",
                  "&:hover": {
                    borderColor: "secondary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <UploadFile color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="secondary">
                  Faylı buraya sürüşdürün və ya klikləyin
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maksimum 10 sənəd (PDF)
                </Typography>
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  hidden
                  onChange={(e) => handleFileUpload(e, "pdfFiles")}
                />
              </Box>

              {errors.pdfFiles && (
                <Typography color="error" variant="body2">
                  {errors.pdfFiles}
                </Typography>
              )}

              {pdfFiles.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                    Yüklənmiş sənədlər ({pdfFiles.length})
                  </Typography>
                  <Stack spacing={1}>
                    {pdfFiles.map((file, idx) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 2,
                          bgcolor: "background.default",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
                          <PictureAsPdf color="secondary" />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                        <Tooltip title="Sil">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onFileDelete("pdfFiles", idx)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Paper>
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

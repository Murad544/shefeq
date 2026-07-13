import {
  Grid,
  Button,
  Typography,
  Stack,
  Skeleton,
  Paper,
  Box,
  Link,
} from "@mui/material";
import {
  MdAttachFile,
  MdFileDownload,
  MdPictureAsPdf,
  MdMovie,
} from "react-icons/md";
import InfoCard from "../../../ui/Display/InfoCard";
import { formatBytes } from "../../../../utils/formatters";
import { downloadFile, downloadAll } from "../../../../utils/download";

function FileItem({ file, index }) {
  const name =
    file.original_name || file.filename || `file_${file.id || index}`;
  const url =
    file.url || (file.id ? `/api/admin/files/${file.id}/download` : "");
  const mime = (file.mime || file.mimetype || "").toLowerCase();
  const type = (file.type || "").toLowerCase();
  const isPdf = mime.includes("pdf");
  const isVideo = mime.includes("mp4") || type === "mp4";
  const Icon = isPdf ? MdPictureAsPdf : isVideo ? MdMovie : MdFileDownload;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        borderColor: "grey.200",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 2px 8px rgba(54, 79, 107, 0.1)",
        },
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs="auto">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: isPdf
                ? "rgba(244, 67, 54, 0.1)"
                : isVideo
                ? "rgba(156, 39, 176, 0.1)"
                : "rgba(63, 193, 201, 0.1)",
              color: isPdf
                ? "error.main"
                : isVideo
                ? "#9c27b0"
                : "secondary.main",
            }}
          >
            <Icon size={24} />
          </Box>
        </Grid>

        <Grid item xs>
          {url ? (
            <Link
              component="button"
              type="button"
              underline="hover"
              color="primary"
              onClick={async () => {
                try {
                  await downloadFile(url, name);
                } catch (e) {
                  console.error(e);
                }
              }}
              sx={{
                cursor: "pointer",
                textAlign: "left",
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 600,
                wordBreak: "break-word",
                "&:hover": {
                  color: "primary.dark",
                },
              }}
            >
              {name}
            </Link>
          ) : (
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: 600,
                wordBreak: "break-word",
              }}
            >
              {name}
            </Typography>
          )}

          {file.file_size != null && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: "block",
                fontSize: { xs: "0.75rem", md: "0.8rem" },
                mt: 0.5,
              }}
            >
              {formatBytes(file.file_size)}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function FilesInfo({ loading, files }) {
  const downloadAllButton =
    files.length > 0 ? (
      <Button
        size="small"
        variant="outlined"
        onClick={() => downloadAll(files)}
        startIcon={<MdFileDownload size={16} />}
        sx={{
          fontSize: { xs: "0.75rem", md: "0.875rem" },
          px: 2,
          py: 0.5,
          borderRadius: 2,
          borderColor: "secondary.main",
          color: "secondary.main",
          "&:hover": {
            bgcolor: "secondary.main",
            color: "white",
          },
        }}
      >
        Yüklə
      </Button>
    ) : null;

  return (
    <InfoCard
      title="Fayllar"
      icon={<MdAttachFile size={20} />}
      actions={downloadAllButton}
    >
      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={64}
              sx={{ borderRadius: 2 }}
            />
          ))}
        </Stack>
      ) : files.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Fayl yoxdur.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {files.map((file, i) => (
            <FileItem key={i} file={file} index={i} />
          ))}
        </Stack>
      )}
    </InfoCard>
  );
}

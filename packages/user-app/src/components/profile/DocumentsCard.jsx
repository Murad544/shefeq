import {
  Folder as FolderIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf,
  VideoFile,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const DocumentsCard = ({ documents, onDownloadDocument }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FolderIcon sx={{ mr: 1.5, color: "warning.main" }} />
        <Typography variant="h6" fontWeight={600}>
          Yüklənmiş Fayllar ({documents?.length || 0})
        </Typography>
      </Box>

      {documents && documents.length > 0 ? (
        <List disablePadding>
          {documents.map((doc, index) => (
            <React.Fragment key={doc.id || index}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <ListItem
                disablePadding
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: doc.type === "pdf" ? "#ffebee" : "#e3f2fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                      flexShrink: 0,
                    }}
                  >
                    {doc.type === "pdf" ? (
                      <PictureAsPdf sx={{ color: "#d32f2f", fontSize: 20 }} />
                    ) : (
                      <VideoFile sx={{ color: "#1976d2", fontSize: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1, mr: 2 }}>
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {doc.name}
                    </Typography>
                    {doc.size ? (
                      <Typography variant="caption" color="text.secondary">
                        {formatBytes(doc.size)}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
                {onDownloadDocument && (
                  <IconButton
                    size="small"
                    onClick={() => onDownloadDocument(doc)}
                    sx={{ color: "text.secondary" }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Sənəd yoxdur
        </Typography>
      )}
    </Paper>
  );
};

export default DocumentsCard;

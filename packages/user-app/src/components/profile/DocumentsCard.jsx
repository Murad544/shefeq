import {
  Folder as FolderIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import Panel from "../military/Panel";
import { C, FONT } from "../../config/tokens";

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const DocumentsCard = ({ documents, onDownloadDocument }) => {
  const count = documents?.length || 0;

  return (
    <Panel
      title={`Yüklənmiş Fayllar (${count})`}
      icon={<FolderIcon />}
      noPadding
    >
      {documents && documents.length > 0 ? (
        <Box>
          {documents.map((doc, index) => {
            const isPdf = doc.type === "pdf";
            return (
              <Stack
                key={doc.id || index}
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  px: { xs: 2, sm: 2.5 },
                  py: 1.5,
                  borderTop: index ? `1px solid ${C.rule}` : "none",
                  transition: "background-color .2s",
                  animation: `sg-fade-up .4s ease ${index * 60}ms backwards`,
                  "&:hover": { bgcolor: "rgba(201, 166, 70, 0.07)" },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 30,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    border: `1.5px solid ${isPdf ? C.red : C.blue}`,
                    color: isPdf ? C.red : C.blue,
                    fontFamily: FONT.mono,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                  }}
                >
                  {isPdf ? "PDF" : "MP4"}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {doc.name}
                  </Typography>
                  {doc.size ? (
                    <Box sx={{ fontFamily: FONT.mono, fontSize: "0.72rem", color: C.textMuted }}>
                      {formatBytes(doc.size)}
                    </Box>
                  ) : null}
                </Box>
                {onDownloadDocument && (
                  <Tooltip title="Bax">
                    <IconButton
                      size="small"
                      onClick={() => onDownloadDocument(doc)}
                      sx={{
                        border: `1px solid ${C.rule}`,
                        color: C.olive,
                        "&:hover": { bgcolor: C.olive, color: C.paper, borderColor: C.olive },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            );
          })}
        </Box>
      ) : (
        <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Box
            sx={{
              py: 3,
              textAlign: "center",
              border: `1px dashed ${C.ruleStrong}`,
              color: C.textMuted,
              fontSize: "0.9rem",
            }}
          >
            Sənəd yoxdur
          </Box>
        </Box>
      )}
    </Panel>
  );
};

export default DocumentsCard;

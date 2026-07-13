import {
  Folder as FolderIcon,
  Visibility as VisibilityIcon,
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

const DocumentsCard = ({ documents, onDownloadDocument }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FolderIcon sx={{ mr: 1.5, color: "warning.main" }} />
        <Typography variant="h6" fontWeight={600}>
          Sənədlər
        </Typography>
      </Box>

      {documents && documents.length > 0 ? (
        <List disablePadding>
          {documents.map((doc, index) => (
            <React.Fragment key={doc.id}>
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
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: doc.type === "pdf" ? "#ffebee" : "#e3f2fd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 1.5,
                    }}
                  >
                    📄
                  </Box>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {doc.name}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => onDownloadDocument(doc)}
                  sx={{ color: "text.secondary" }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
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

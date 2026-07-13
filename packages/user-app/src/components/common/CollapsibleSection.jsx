import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Box, Collapse, IconButton, Paper, Typography } from "@mui/material";
import { useState } from "react";

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          cursor: "pointer",
          bgcolor: "white",
          "&:hover": {
            bgcolor: "grey.50",
          },
          transition: "background-color 0.2s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {Icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "grey.100",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 20, color: "text.secondary" }} />
            </Box>
          )}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isOpen}>
        <Box sx={{ p: 3, pt: 0 }}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default CollapsibleSection;

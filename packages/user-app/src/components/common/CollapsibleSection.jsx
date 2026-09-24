import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Box, ButtonBase, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import { C, FONT, labelCaps } from "../../config/tokens";

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Box sx={{ mb: 3, bgcolor: C.paperRaised, border: `1px solid ${C.rule}` }}>
      <ButtonBase
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1.5,
          px: { xs: 2, sm: 2.5 },
          minHeight: 54,
          textAlign: "left",
          bgcolor: C.paperSunk,
          borderBottom: `1px solid ${isOpen ? C.rule : "transparent"}`,
          transition: "background-color .2s",
          "&:hover": { bgcolor: "#E4DECB" },
        }}
      >
        {Icon && (
          <Box
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              bgcolor: C.olive,
              color: C.paper,
            }}
          >
            <Icon sx={{ fontSize: 18 }} />
          </Box>
        )}
        <Typography
          component="h3"
          sx={{ ...labelCaps, fontSize: "1rem", fontWeight: 700, flex: 1 }}
        >
          {title}
        </Typography>
        <Box
          component="span"
          sx={{ fontFamily: FONT.mono, fontSize: "0.66rem", letterSpacing: "0.12em", color: C.textFaint }}
        >
          {isOpen ? "BAĞLA" : "AÇ"}
        </Box>
        <ExpandMoreIcon
          sx={{
            color: C.textMuted,
            transform: isOpen ? "rotate(180deg)" : "none",
            transition: "transform .3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </ButtonBase>
      <Collapse in={isOpen}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;

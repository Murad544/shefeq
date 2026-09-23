import { Box, Typography } from "@mui/material";
import { C, labelCaps } from "../../config/tokens";
import CornerBrackets from "./CornerBrackets";

// Document panel: ruled header bar (icon · TITLE · actions) over a body.
const Panel = ({
  title,
  icon,
  actions,
  children,
  tone = "paper",
  brackets = false,
  noPadding = false,
  sx,
  headerSx,
  bodySx,
}) => {
  const dark = tone === "dark";
  const border = dark ? C.lineDarkStrong : C.rule;

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: dark ? C.field800 : C.paperRaised,
        border: `1px solid ${border}`,
        color: dark ? C.textOnDark : C.text,
        overflow: brackets ? "visible" : "hidden",
        ...sx,
      }}
    >
      {brackets && <CornerBrackets inset={-1} size={10} />}
      {(title || actions) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: { xs: 2, sm: 2.5 },
            minHeight: 50,
            borderBottom: `1px solid ${border}`,
            bgcolor: dark ? C.field700 : C.paperSunk,
            ...headerSx,
          }}
        >
          {icon && (
            <Box
              sx={{
                display: "flex",
                color: dark ? C.brass : C.olive,
                "& svg": { fontSize: 20 },
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            component="h3"
            sx={{
              ...labelCaps,
              fontSize: "0.98rem",
              fontWeight: 700,
              flex: 1,
              minWidth: 0,
              py: 1.25,
            }}
          >
            {title}
          </Typography>
          {actions}
        </Box>
      )}
      <Box sx={{ p: noPadding ? 0 : { xs: 2, sm: 3 }, ...bodySx }}>
        {children}
      </Box>
    </Box>
  );
};

export default Panel;

import { Box } from "@mui/material";
import { C, FONT, labelCaps } from "../../../styles/tokens";

// Label / value pair styled like a filled-in line on an official form.
const DataField = ({ label, value, icon, mono = false, dark = false, sx }) => {
  const empty = value === null || value === undefined || value === "" || value === "-";

  return (
    <Box sx={{ minWidth: 0, ...sx }}>
      <Box
        sx={{
          ...labelCaps,
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mb: 0.5,
          fontSize: "0.72rem",
          color: dark ? C.textOnDarkMuted : C.textMuted,
          "& svg": { fontSize: 15 },
        }}
      >
        {icon}
        {label}
      </Box>
      <Box
        sx={{
          fontFamily: mono ? FONT.mono : FONT.body,
          fontWeight: 500,
          fontSize: mono ? "0.92rem" : "1rem",
          color: empty ? (dark ? C.textOnDarkMuted : C.textFaint) : dark ? C.textOnDark : C.text,
          wordBreak: "break-word",
          pb: 0.75,
          borderBottom: `1px dashed ${dark ? C.lineDarkStrong : C.ruleStrong}`,
        }}
      >
        {empty ? "—" : value}
      </Box>
    </Box>
  );
};

export default DataField;

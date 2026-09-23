import { TextField, InputAdornment } from "@mui/material";
import { MdSearch } from "react-icons/md";
import { C, FONT } from "../../../styles/tokens";

// Search input styled for the dark table command bar.
export default function SearchField({
  value,
  onChange,
  placeholder = "Axtar...",
  color = "primary",
  fullWidth = true,
  size = "small",
  isMobile,
  ...props
}) {
  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: C.field800,
          color: C.textOnDark,
          fontSize: { xs: "0.9rem", md: "0.95rem" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: C.lineDarkStrong },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: C.brassDark },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: C.brass },
        },
        "& .MuiInputBase-input": {
          py: 1.1,
          "&::placeholder": {
            color: C.textOnDarkMuted,
            opacity: 1,
            fontFamily: FONT.mono,
            fontSize: "0.82rem",
            letterSpacing: "0.04em",
          },
        },
        ...props.sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MdSearch size={isMobile ? 18 : 20} color={C.brass} />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
      {...props}
    />
  );
}

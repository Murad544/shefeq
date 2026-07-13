import { TextField, InputAdornment } from "@mui/material";
import { MdSearch } from "react-icons/md";

export default function SearchField({
  value,
  onChange,
  placeholder = "Axtar...",
  color = "primary",
  fullWidth = true,
  size = "small",
  ...props
}) {
  const getColorValue = (color) => {
    const colorMap = {
      primary: "#364F6B",
      secondary: "#3FC1C9",
      success: "#10B981",
      error: "#EF4444",
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <TextField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      sx={{
        "& .MuiInputBase-root": {
          bgcolor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 2,
          fontSize: { xs: "0.9rem", md: "1rem" },
          color: `${color}.main`,
        },
        "& .MuiInputBase-input": {
          "&::placeholder": {
            color: `rgba(${
              color === "primary"
                ? "54, 79, 107"
                : color === "success"
                ? "16, 185, 129"
                : "63, 193, 201"
            }, 0.7)`,
            opacity: 1,
          },
        },
        ...props.sx,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <MdSearch
              size={props.isMobile ? 18 : 20}
              color={getColorValue(color)}
            />
          </InputAdornment>
        ),
        ...props.InputProps,
      }}
      {...props}
    />
  );
}

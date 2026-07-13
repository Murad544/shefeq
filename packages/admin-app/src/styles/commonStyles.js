import { getColorScheme } from "../constants/colors";

export const createHoverRowStyles = (colorScheme = "primary") => {
  const colors = getColorScheme(colorScheme);

  return {
    "&:hover": {
      bgcolor: colors.light,
      "& .MuiTableCell-root": { color: "white" },
      "& .MuiChip-root": {
        bgcolor: "rgba(255, 255, 255, 0.2)",
        color: "white",
      },
      "& .secret-key-cell": {
        "& .MuiBox-root": {
          bgcolor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        "& .MuiTypography-root": { color: "white" },
      },
    },
    transition: "all 0.2s ease",
    cursor: "inherit",
  };
};

export const createTableHeaderStyles = (colorScheme = "primary") => {
  const colors = getColorScheme(colorScheme);

  return {
    fontWeight: 700,
    color: `${colorScheme}.main`,
    bgcolor: "grey.50",
    borderBottom: "2px solid",
    borderColor: colors.light,
    fontSize: { xs: "0.8rem", md: "0.875rem" },
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 10,
  };
};

export const createScrollContainerStyles = () => ({
  maxHeight: 600,
  overflowX: "auto",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    height: 8,
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    bgcolor: "grey.100",
    borderRadius: 1,
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "grey.400",
    borderRadius: 1,
    "&:hover": {
      bgcolor: "grey.500",
    },
  },
  scrollBehavior: "smooth",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
});

export const createCardStyles = () => ({
  borderRadius: 3,
  border: "1px solid",
  borderColor: "grey.200",
  boxShadow: "0 2px 12px rgba(54, 79, 107, 0.08)",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "primary.light",
    boxShadow: "0 4px 20px rgba(54, 79, 107, 0.15)",
    transform: "translateY(-1px)",
  },
});

export const createActionButtonStyles = (color = "primary") => ({
  border: "1px solid",
  borderColor: `${color}.light`,
  borderRadius: 1.5,
  width: 32,
  height: 32,
  "&:hover": {
    bgcolor: `${color}.main`,
    color: "white",
    transform: "scale(1.05)",
  },
  pointerEvents: "auto",
});

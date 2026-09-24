import { getColorScheme } from "../constants/colors";
import { C, labelCaps } from "./tokens";

// Row hover: a brass wash with a scheme-colored rule on the leading edge.
export const createHoverRowStyles = (colorScheme = "primary") => {
  const colors = getColorScheme(colorScheme);

  return {
    "&:hover": {
      bgcolor: "rgba(201, 166, 70, 0.09)",
      boxShadow: `inset 3px 0 0 ${colors.main}`,
    },
    transition: "background-color .2s ease, box-shadow .2s ease",
    cursor: "inherit",
  };
};

export const createTableHeaderStyles = (colorScheme = "primary") => {
  const colors = getColorScheme(colorScheme);

  return {
    ...labelCaps,
    fontSize: { xs: "0.72rem", md: "0.78rem" },
    color: C.text,
    bgcolor: C.paperSunk,
    borderBottom: "2px solid",
    borderColor: colors.main,
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
    bgcolor: C.paperSunk,
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: C.ruleStrong,
    "&:hover": {
      bgcolor: C.olive,
    },
  },
  scrollBehavior: "smooth",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
});

export const createCardStyles = () => ({
  borderRadius: "2px",
  border: "1px solid",
  borderColor: C.rule,
  boxShadow: "none",
  bgcolor: C.paperRaised,
  transition: "border-color .2s ease",
  "&:hover": {
    borderColor: C.ruleStrong,
  },
});

export const createActionButtonStyles = (color = "primary") => ({
  border: "1px solid",
  borderColor: C.ruleStrong,
  borderRadius: "2px",
  width: 32,
  height: 32,
  "&:hover": {
    bgcolor: `${color}.main`,
    borderColor: `${color}.main`,
    color: "white",
  },
  pointerEvents: "auto",
});

export const COLORS = {
  primary: {
    main: "#364F6B",
    light: "#5A7298",
    dark: "#243348",
  },
  secondary: {
    main: "#3FC1C9",
    light: "#6DD4DB",
    dark: "#2B878D",
  },
  success: {
    main: "#10B981",
    light: "#34D399",
    dark: "#059669",
  },
  error: {
    main: "#EF4444",
    light: "#F87171",
    dark: "#DC2626",
  },
  warning: {
    main: "#F59E0B",
    light: "#FCD34D",
    dark: "#D97706",
  },
  accent: {
    main: "#FC5185",
    light: "#FD789D",
    dark: "#E0385D",
  },
};

export const COLOR_SCHEMES = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  error: COLORS.error,
};

export const getColorScheme = (scheme) =>
  COLOR_SCHEMES[scheme] || COLOR_SCHEMES.primary;

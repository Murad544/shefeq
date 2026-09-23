import { C } from "../styles/tokens";

export const COLORS = {
  primary: {
    main: C.olive,
    light: C.oliveLight,
    dark: C.oliveDark,
  },
  secondary: {
    main: C.brass,
    light: C.brassLight,
    dark: C.brassDark,
  },
  success: {
    main: C.green,
    light: C.greenLight,
    dark: "#2C5A29",
  },
  error: {
    main: C.red,
    light: C.redLight,
    dark: "#7E241E",
  },
  warning: {
    main: C.amber,
    light: "#D9A441",
    dark: "#8F6614",
  },
  accent: {
    main: C.brass,
    light: C.brassLight,
    dark: C.brassDark,
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

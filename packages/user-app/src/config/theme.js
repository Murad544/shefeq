import { createTheme } from "@mui/material/styles";
import { C, FONT, EASE } from "./tokens";

// Global keyframes; components reference them by name in sx `animation`.
const keyframes = {
  "@keyframes sg-fade-up": {
    from: { opacity: 0, transform: "translate3d(0, 14px, 0)" },
    to: { opacity: 1, transform: "none" },
  },
  "@keyframes sg-fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
  "@keyframes sg-scale-in": {
    from: { opacity: 0, transform: "scale(0.94)" },
    to: { opacity: 1, transform: "none" },
  },
  "@keyframes sg-slide-in-left": {
    from: { opacity: 0, transform: "translate3d(-18px, 0, 0)" },
    to: { opacity: 1, transform: "none" },
  },
  "@keyframes sg-draw-x": {
    from: { transform: "scaleX(0)" },
    to: { transform: "scaleX(1)" },
  },
  "@keyframes sg-grow-y": {
    from: { transform: "scaleY(0)" },
    to: { transform: "scaleY(1)" },
  },
  "@keyframes sg-sweep": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  "@keyframes sg-pulse": {
    "0%": { boxShadow: "0 0 0 0 currentColor" },
    "70%": { boxShadow: "0 0 0 7px transparent" },
    "100%": { boxShadow: "0 0 0 0 transparent" },
  },
  "@keyframes sg-blink": {
    "0%, 49%": { opacity: 1 },
    "50%, 100%": { opacity: 0 },
  },
  "@keyframes sg-stamp": {
    "0%": { opacity: 0, transform: "scale(1.7) rotate(-16deg)" },
    "55%": { opacity: 0.95, transform: "scale(0.93) rotate(var(--sg-rot, -8deg))" },
    "75%": { transform: "scale(1.04) rotate(var(--sg-rot, -8deg))" },
    "100%": { opacity: 0.92, transform: "scale(1) rotate(var(--sg-rot, -8deg))" },
  },
  "@keyframes sg-ping": {
    "0%": { transform: "scale(0.4)", opacity: 0.9 },
    "100%": { transform: "scale(2.6)", opacity: 0 },
  },
  "@keyframes sg-blip": {
    "0%, 100%": { opacity: 0.15 },
    "8%": { opacity: 1 },
    "45%": { opacity: 0.35 },
  },
  "@keyframes sg-chevron": {
    "0%, 100%": { transform: "translateY(0)", opacity: 0.45 },
    "50%": { transform: "translateY(5px)", opacity: 1 },
  },
  "@keyframes sg-scan": {
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(100%)" },
  },
  "@keyframes sg-shimmer": {
    from: { backgroundPosition: "-200% 0" },
    to: { backgroundPosition: "200% 0" },
  },
  "@keyframes sg-door-up": { to: { transform: "translateY(-100%)" } },
  "@keyframes sg-door-down": { to: { transform: "translateY(100%)" } },
  "@keyframes sg-track-in": {
    from: { opacity: 0, letterSpacing: "0.7em", filter: "blur(6px)" },
    to: { opacity: 1, filter: "blur(0)" },
  },
  "@keyframes sg-dash": { to: { strokeDashoffset: 0 } },
};

const shadows = [
  "none",
  ...Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    return `0 ${Math.ceil(n / 2)}px ${n * 2}px -${Math.floor(n / 3)}px rgba(16, 21, 15, ${(
      0.14 +
      n * 0.005
    ).toFixed(3)}), 0 1px 0 rgba(16, 21, 15, 0.05)`;
  }),
];

const labelCaps = {
  fontFamily: FONT.display,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: C.olive,
      light: C.oliveLight,
      dark: C.oliveDark,
      contrastText: C.paper,
    },
    secondary: {
      main: C.brass,
      light: C.brassLight,
      dark: C.brassDark,
      contrastText: C.ink,
    },
    accent: {
      main: C.brass,
      light: C.brassLight,
      dark: C.brassDark,
    },
    error: { main: C.red, light: C.redLight, dark: "#7E241E", contrastText: "#FFFFFF" },
    success: { main: C.green, light: C.greenLight, dark: "#2C5A29", contrastText: "#FFFFFF" },
    warning: { main: C.amber, light: "#D9A441", dark: "#8F6614", contrastText: C.ink },
    info: { main: C.blue, light: "#4F8FAF", dark: "#1F4F66", contrastText: "#FFFFFF" },
    background: {
      default: C.paper,
      paper: C.paperRaised,
    },
    text: {
      primary: C.text,
      secondary: C.textMuted,
      disabled: C.textFaint,
    },
    divider: C.rule,
    grey: {
      50: "#F7F5EE",
      100: "#EFEBDF",
      200: "#E2DCC9",
      300: "#CFC8B0",
      400: "#A9A38A",
      500: "#7F7C68",
      600: "#5E5D4D",
      700: "#454638",
      800: "#2E3126",
      900: "#1A1D15",
    },
    action: {
      hover: "rgba(75, 83, 32, 0.06)",
      selected: "rgba(75, 83, 32, 0.12)",
    },
  },
  typography: {
    fontFamily: FONT.body,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontFamily: FONT.serif,
      fontWeight: 700,
      fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
      lineHeight: 1.05,
      letterSpacing: "0.01em",
    },
    h2: {
      fontFamily: FONT.serif,
      fontWeight: 700,
      fontSize: "clamp(2rem, 3.6vw, 2.75rem)",
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: FONT.serif,
      fontWeight: 600,
      fontSize: "clamp(1.75rem, 2.8vw, 2.25rem)",
      lineHeight: 1.15,
    },
    h4: {
      fontFamily: FONT.serif,
      fontWeight: 600,
      fontSize: "1.6rem",
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: "1.35rem",
      lineHeight: 1.25,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
    h6: {
      fontFamily: FONT.display,
      fontWeight: 600,
      fontSize: "1.15rem",
      lineHeight: 1.3,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
    },
    subtitle1: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.5 },
    subtitle2: {
      fontFamily: FONT.display,
      fontWeight: 600,
      fontSize: "0.9rem",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    body1: { fontSize: "1rem", lineHeight: 1.65 },
    body2: { fontSize: "0.875rem", lineHeight: 1.6 },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, letterSpacing: "0.02em" },
    overline: {
      fontFamily: FONT.display,
      fontWeight: 600,
      fontSize: "0.8rem",
      letterSpacing: "0.2em",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: FONT.display,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 2,
  },
  shadows,
  spacing: 8,
  transitions: {
    easing: {
      easeOut: EASE.out,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          textRendering: "optimizeLegibility",
        },
        body: {
          backgroundColor: C.paper,
          color: C.text,
        },
        "::selection": {
          backgroundColor: "rgba(201, 166, 70, 0.4)",
          color: C.ink,
        },
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-track": { background: "transparent" },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(92, 97, 82, 0.45)",
          border: "2px solid transparent",
          backgroundClip: "content-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(75, 83, 32, 0.7)",
        },
        ...keyframes,
        "@media (prefers-reduced-motion: reduce)": {
          "*, *::before, *::after": {
            animationDuration: "1ms !important",
            animationDelay: "0ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "1ms !important",
            transitionDelay: "0ms !important",
            scrollBehavior: "auto !important",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 2,
          padding: "9px 22px",
          fontSize: "0.95rem",
          lineHeight: 1.5,
          transition:
            "background-color .2s, border-color .2s, color .2s, box-shadow .2s, transform .12s",
          "&:active": { transform: "translateY(1px)" },
          "&.Mui-focusVisible": {
            outline: `2px solid ${C.brass}`,
            outlineOffset: 2,
          },
        },
        sizeLarge: { padding: "12px 28px", fontSize: "1.05rem" },
        sizeSmall: { padding: "4px 12px", fontSize: "0.82rem" },
        containedPrimary: {
          "&:hover": { backgroundColor: C.oliveDark },
        },
        containedSecondary: {
          "&:hover": { backgroundColor: C.brassLight },
        },
        outlined: {
          "&:hover": { borderWidth: 1 },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          "&.Mui-focusVisible": {
            outline: `2px solid ${C.brass}`,
            outlineOffset: 1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: 2 },
        outlined: { borderColor: C.rule },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          border: `1px solid ${C.rule}`,
          boxShadow: "none",
          backgroundColor: C.paperRaised,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          backgroundColor: C.paperRaised,
          transition: "box-shadow .2s ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: C.rule,
            "& legend": labelCaps,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: C.ruleStrong,
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(201, 166, 70, 0.22)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: C.olive,
            borderWidth: 1.5,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: C.red,
          },
          "&.Mui-disabled": { backgroundColor: C.paperSunk },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          ...labelCaps,
          color: C.textMuted,
          "&.Mui-focused": { color: C.olive },
          "&.Mui-error": { color: C.red },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontSize: "0.78rem", marginLeft: 2, marginTop: 6 },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: { border: `1px solid ${C.rule}`, borderRadius: 2 },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { border: `1px solid ${C.rule}`, borderRadius: 2 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.94rem",
          "&:hover": { backgroundColor: "rgba(201, 166, 70, 0.14)" },
          "&.Mui-selected": { backgroundColor: "rgba(75, 83, 32, 0.12)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          fontFamily: FONT.display,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.8rem",
        },
        sizeSmall: { height: 22, fontSize: "0.74rem" },
        outlined: { borderColor: C.ruleStrong },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          borderLeft: "4px solid",
          alignItems: "flex-start",
        },
        standardError: {
          backgroundColor: "#F5E4E0",
          borderColor: C.red,
          color: "#5E1C17",
        },
        standardSuccess: {
          backgroundColor: "#E4EEDC",
          borderColor: C.green,
          color: "#23461F",
        },
        standardInfo: {
          backgroundColor: "#E1ECEF",
          borderColor: C.blue,
          color: "#173F52",
        },
        standardWarning: {
          backgroundColor: "#F5EBD2",
          borderColor: C.amber,
          color: "#5A4210",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${C.rule}` },
        head: {
          ...labelCaps,
          fontSize: "0.78rem",
          color: C.text,
          backgroundColor: C.paperSunk,
          borderBottom: `2px solid ${C.ruleStrong}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        hover: {
          "&:hover": { backgroundColor: "rgba(201, 166, 70, 0.08)" },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        selectLabel: { fontFamily: FONT.mono, fontSize: "0.78rem" },
        displayedRows: { fontFamily: FONT.mono, fontSize: "0.78rem" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 0, backgroundColor: C.paperSunk },
        bar: { borderRadius: 0, backgroundColor: C.olive },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: C.field900,
          color: C.textOnDark,
          fontFamily: FONT.mono,
          fontSize: "0.72rem",
          border: `1px solid ${C.lineDarkStrong}`,
          borderRadius: 2,
        },
        arrow: { color: C.field900 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 2,
          borderTop: `3px solid ${C.brass}`,
          backgroundColor: C.paperRaised,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          ...labelCaps,
          fontWeight: 700,
          fontSize: "1.3rem",
          letterSpacing: "0.08em",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          "&:not(.MuiBackdrop-invisible)": {
            backgroundColor: "rgba(11, 15, 10, 0.72)",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { borderRadius: 2 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: C.rule },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { backgroundColor: C.paperSunk, borderRadius: 2 },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: labelCaps,
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 2 },
      },
    },
  },
});

export default theme;

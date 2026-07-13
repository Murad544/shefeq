import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#364F6B",
      light: "#5A7298",
      dark: "#243348",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#3FC1C9",
      light: "#6DD4DB",
      dark: "#2B878D",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    accent: {
      main: "#FC5185",
      light: "#FD789D",
      dark: "#E0385D",
    },
    text: {
      primary: "#364F6B",
      secondary: "#6B7280",
    },
    grey: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    info: {
      main: "#3FC1C9",
      light: "#6DD4DB",
      dark: "#2B878D",
    },
  },
  typography: {
    fontFamily:
      "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    fontWeightHeavy: 700,
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      "@media (max-width:600px)": {
        fontSize: "2rem",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      "@media (max-width:600px)": {
        fontSize: "1.75rem",
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.3,
      "@media (max-width:600px)": {
        fontSize: "1.5rem",
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.4,
      "@media (max-width:600px)": {
        fontSize: "1.25rem",
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
      "@media (max-width:600px)": {
        fontSize: "1.1rem",
      },
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
      "@media (max-width:600px)": {
        fontSize: "1rem",
      },
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      "@media (max-width:600px)": {
        fontSize: "0.9rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
      "@media (max-width:600px)": {
        fontSize: "0.8rem",
      },
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
    caption: {
      fontSize: "0.75rem",
      "@media (max-width:600px)": {
        fontSize: "0.7rem",
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(54, 79, 107, 0.3) transparent",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(54, 79, 107, 0.3)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(54, 79, 107, 0.5)",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "12px 24px",
          fontSize: "0.95rem",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(54, 79, 107, 0.15)",
          },
          "@media (max-width:600px)": {
            padding: "10px 20px",
            fontSize: "0.9rem",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0 6px 20px rgba(54, 79, 107, 0.25)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "rgba(54, 79, 107, 0.04)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(54, 79, 107, 0.08)",
          },
          "@media (max-width:600px)": {
            padding: "8px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            transition: "all 0.2s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5A7298",
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#364F6B",
                borderWidth: "2px",
              },
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#364F6B",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(54, 79, 107, 0.08)",
          backgroundImage: "none",
          "@media (max-width:600px)": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(54, 79, 107, 0.08)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(54, 79, 107, 0.12)",
          },
          "@media (max-width:600px)": {
            borderRadius: 12,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
          "@media (max-width:600px)": {
            fontSize: "0.75rem",
            height: 28,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "@media (max-width:600px)": {
            fontSize: "0.85rem",
            borderRadius: 8,
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            padding: "16px 0",
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 500,
          fontSize: "0.875rem",
          "&.Mui-active": {
            fontWeight: 600,
            color: "#364F6B",
          },
          "&.Mui-completed": {
            fontWeight: 600,
            color: "#364F6B",
          },
          "@media (max-width:600px)": {
            fontSize: "0.75rem",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          minHeight: 48,
          "@media (max-width:600px)": {
            fontSize: "0.8rem",
            minHeight: 40,
            padding: "6px 12px",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
          "@media (max-width:600px)": {
            minHeight: 40,
          },
        },
        indicator: {
          height: 3,
          borderRadius: "2px 2px 0 0",
          backgroundColor: "#364F6B",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(54, 79, 107, 0.12)",
          "@media (max-width:960px)": {
            padding: "8px",
            fontSize: "0.8rem",
          },
          "@media (max-width:600px)": {
            padding: "6px",
            fontSize: "0.75rem",
          },
        },
        head: {
          fontWeight: 700,
          backgroundColor: "rgba(54, 79, 107, 0.04)",
          "@media (max-width:600px)": {
            fontSize: "0.7rem",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(54, 79, 107, 0.3)",
            borderRadius: "3px",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          "@media (max-width:600px)": {
            borderRadius: 12,
            margin: 16,
            maxHeight: "calc(100% - 32px)",
            maxWidth: "calc(100% - 32px)",
          },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "1.25rem",
          "@media (max-width:600px)": {
            fontSize: "1.1rem",
            padding: "16px",
          },
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          "@media (max-width:600px)": {
            padding: "8px 16px",
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
          "@media (max-width:600px)": {
            padding: "12px 16px",
          },
        },
      },
    },
  },
  // Custom responsive helpers
  responsive: {
    isMobile: "@media (max-width:600px)",
    isTablet: "@media (max-width:960px)",
    isDesktop: "@media (min-width:1280px)",
  },
});

export default theme;

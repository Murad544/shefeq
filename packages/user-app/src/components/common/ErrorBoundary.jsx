import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { C, FONT } from "../../config/tokens";

// The outermost boundary renders outside ThemeProvider, so colors here come
// straight from the tokens rather than the theme palette.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: C.field900,
            p: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 520,
              bgcolor: C.paperRaised,
              borderTop: `4px solid ${C.red}`,
              p: { xs: 3, sm: 4 },
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                mb: 2.5,
                border: `2px solid ${C.red}`,
                color: C.red,
                fontFamily: FONT.display,
                fontWeight: 700,
                letterSpacing: "0.16em",
                transform: "rotate(-4deg)",
              }}
            >
              SİSTEM XƏTASI
            </Box>
            <Typography
              sx={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: "1.8rem",
                color: C.text,
                mb: 1.5,
              }}
            >
              Xəta baş verdi
            </Typography>
            <Typography sx={{ fontFamily: FONT.body, color: C.textMuted, mb: 3 }}>
              Gözlənilməz bir xəta baş verdi. Səhifəni yenidən yükləməyi cəhd
              edin.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
              sx={{
                bgcolor: C.olive,
                color: C.paper,
                borderRadius: "2px",
                fontFamily: FONT.display,
                letterSpacing: "0.12em",
                "&:hover": { bgcolor: C.oliveDark },
              }}
            >
              Səhifəni yenilə
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

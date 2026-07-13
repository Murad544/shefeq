import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ErrorOutline, Refresh } from "@mui/icons-material";

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
            bgcolor: "background.default",
            p: 3,
          }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              maxWidth: 500,
              width: "100%",
            }}
          >
            <ErrorOutline color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Xəta baş verdi
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Gözlənilməz bir xəta baş verdi. Səhifəni yenidən yükləməyi cəhd
              edin.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReload}
              sx={{ mt: 2 }}
            >
              Səhifəni yenilə
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

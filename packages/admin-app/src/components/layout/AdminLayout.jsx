import { Box, Container } from "@mui/material";
import Header from "./Header";

export default function AdminLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #5A7298 0%, #364F6B 50%, #243348 100%)",
        backgroundAttachment: { xs: "local", md: "fixed" },
        overflowX: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(63, 193, 201, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(252, 81, 133, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: -1,
        },
      }}
    >
      <Header />
      <Container
        maxWidth={false}
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          py: { xs: 2, sm: 3, md: 4, lg: 5 },
          maxWidth: { xl: "1800px" },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}

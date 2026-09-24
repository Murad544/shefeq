import { Box, Container } from "@mui/material";
import Header from "./Header";
import TacticalBackground from "../ui/Military/TacticalBackground";
import { C } from "../../styles/tokens";

export default function AdminLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: C.paper,
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Header />
      <Box sx={{ position: "relative" }}>
        <TacticalBackground tone="light" topo={false} vignette={false} sx={{ position: "fixed" }} />
        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            width: "100%",
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
            py: { xs: 2, sm: 3, md: 4 },
            maxWidth: { xl: "1800px" },
            mx: "auto",
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}

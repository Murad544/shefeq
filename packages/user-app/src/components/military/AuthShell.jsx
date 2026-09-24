import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { BRAND } from "../../config/brand";
import { STRINGS } from "../../config/constants";
import { C, EASE, FONT } from "../../config/tokens";
import BrandLockup from "./BrandLockup";
import CornerBrackets from "./CornerBrackets";
import Emblem from "./Emblem";
import TacticalBackground from "./TacticalBackground";
import TricolorBar from "./TricolorBar";

const BrandMark = ({ size = "lg" }) => (
  <Box
    component={RouterLink}
    to="/"
    sx={{ display: "inline-flex", textDecoration: "none", color: "inherit" }}
  >
    <BrandLockup size={size} />
  </Box>
);

// Split-screen shell for sign-in style pages: a dark briefing panel on the
// left and the form document on the right.
const AuthShell = ({ eyebrow, title, subtitle, children }) => (
  <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: C.paper }}>
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: { md: "44%", lg: "42%" },
        position: "relative",
        bgcolor: C.field900,
        color: C.textOnDark,
        overflow: "hidden",
      }}
    >
      <TricolorBar />
      <TacticalBackground />
      <Emblem
        decorative
        size={420}
        opacity={0.06}
        sx={{ position: "absolute", right: -90, bottom: -60 }}
      />
      <Box
        sx={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { md: 5, lg: 7 },
          gap: 6,
        }}
      >
        <Box sx={{ animation: `sg-fade-in .6s ease backwards` }}>
          <BrandMark />
        </Box>

        <Box
          sx={{
            maxWidth: 480,
            my: "auto",
            pb: 6,
            animation: `sg-fade-up .8s ${EASE.out} .15s backwards`,
          }}
        >
          <Typography variant="overline" sx={{ color: C.brass, display: "block", mb: 1.5 }}>
            {BRAND.COURSE_NAME}
          </Typography>
          <Typography variant="h2" sx={{ color: C.textOnDark, mb: 2.5 }}>
            Dron tədrisi və praktiki təlimlər
          </Typography>
          <Box sx={{ width: 56, height: 2, bgcolor: C.brass, mb: 2.5 }} />
          <Typography sx={{ color: C.textOnDarkMuted, lineHeight: 1.75 }}>
            {STRINGS.FEATURES[1]?.description}
          </Typography>
        </Box>
      </Box>
    </Box>

    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
      <Box sx={{ display: { xs: "block", md: "none" }, bgcolor: C.field900 }}>
        <TricolorBar />
        <Box sx={{ px: 2.5, py: 2 }}>
          <BrandMark size="sm" />
        </Box>
      </Box>

      <Box sx={{ position: "relative", flex: 1, display: "flex" }}>
        <TacticalBackground tone="light" topo={false} />
        <Box
          sx={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 2.5, sm: 4 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 460,
              bgcolor: C.paperRaised,
              border: `1px solid ${C.rule}`,
              boxShadow: "0 24px 60px -30px rgba(16, 21, 15, 0.35)",
              p: { xs: 3, sm: 5 },
              animation: `sg-fade-up .7s ${EASE.out} .1s backwards`,
            }}
          >
            <CornerBrackets inset={-7} size={18} color={C.olive} />
            {eyebrow && (
              <Typography
                variant="overline"
                sx={{ color: C.brassDark, display: "block", mb: 1 }}
              >
                {eyebrow}
              </Typography>
            )}
            <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: C.textMuted }}>
                {subtitle}
              </Typography>
            )}
            <Box sx={{ mt: 3.5 }}>{children}</Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: 2,
          textAlign: "center",
          fontFamily: FONT.mono,
          fontSize: "0.68rem",
          letterSpacing: "0.08em",
          color: C.textFaint,
          borderTop: `1px solid ${C.rule}`,
        }}
      >
        © {new Date().getFullYear()} {BRAND.PROJECT_NAME}. {STRINGS.COPYRIGHT}
      </Box>
    </Box>
  </Box>
);

export default AuthShell;

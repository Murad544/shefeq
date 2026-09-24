import { Logout as LogoutIcon } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { C, EASE, FONT, labelCaps } from "../../config/tokens";
import CornerBrackets from "../military/CornerBrackets";
import Stamp from "../military/Stamp";
import TacticalBackground from "../military/TacticalBackground";
import TricolorBar from "../military/TricolorBar";

// Personnel-file header: ID photo slot, name, role, application date and status stamp.
const ProfileHeader = ({ profile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear auth token and redirect to login
    try {
      localStorage.removeItem("auth_token");
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  const approved = profile.applicationStatus?.current === "Təsdiqlənib";

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: C.field800,
        color: C.textOnDark,
        overflow: "hidden",
        mb: 4,
        animation: `sg-fade-up .6s ${EASE.out} backwards`,
      }}
    >
      <TacticalBackground />
      <TricolorBar height={4} sx={{ position: "relative" }} />
      <Box
        sx={{
          position: "relative",
          p: { xs: 2.5, sm: 3.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          gap: { xs: 3, md: 4 },
        }}
      >
        {/* ID photo */}
        <Box
          sx={{
            position: "relative",
            width: 108,
            height: 128,
            flexShrink: 0,
            bgcolor: C.field700,
            border: `1px solid ${C.lineDarkStrong}`,
            display: "grid",
            placeItems: "center",
            overflow: "visible",
          }}
        >
          <CornerBrackets size={12} inset={-6} />
          {profile.avatar ? (
            <Box
              component="img"
              src={profile.avatar}
              alt={profile.fullName}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                fontFamily: FONT.serif,
                fontWeight: 700,
                fontSize: "3.4rem",
                color: C.brass,
                lineHeight: 1,
              }}
            >
              {profile.fullName.charAt(0)}
            </Box>
          )}
        </Box>

        {/* Identity */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              fontFamily: FONT.mono,
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              color: C.brass,
              mb: 1,
            }}
          >
            ŞƏXSİ İŞ
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ color: C.textOnDark, mb: 1.5, wordBreak: "break-word" }}
          >
            {profile.fullName}
          </Typography>
          <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
            <Box
              sx={{
                ...labelCaps,
                fontSize: "0.78rem",
                px: 1.25,
                py: 0.4,
                border: `1px solid ${C.brass}`,
                color: C.brassLight,
              }}
            >
              {profile.role}
            </Box>
            <Typography variant="body2" sx={{ color: C.textOnDarkMuted }}>
              {profile.institution}
            </Typography>
          </Stack>
        </Box>

        {/* Status */}
        <Stack
          direction={{ xs: "row", md: "column" }}
          alignItems={{ xs: "center", md: "flex-end" }}
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
          spacing={2}
          sx={{ flexShrink: 0 }}
        >
          <Box sx={{ textAlign: { md: "right" } }}>
            <Box sx={{ ...labelCaps, fontSize: "0.68rem", color: C.textOnDarkMuted }}>
              Müraciət tarixi
            </Box>
            <Box sx={{ fontFamily: FONT.mono, fontSize: "1.05rem" }}>
              {profile.applicationStatus.applicationDate || "—"}
            </Box>
          </Box>
          <Stamp
            label={profile.applicationStatus.current}
            tone={approved ? "green" : "amber"}
            onDark
            delay={450}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: C.textOnDark,
              borderColor: C.lineDarkStrong,
              "&:hover": {
                borderColor: C.redLight,
                color: C.redLight,
                bgcolor: "rgba(200, 85, 76, 0.08)",
              },
            }}
          >
            Çıxış
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ProfileHeader;

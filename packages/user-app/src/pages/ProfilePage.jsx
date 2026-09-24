import { Alert, Box, Container, Grid, Stack, Typography } from "@mui/material";
import LoadingSpinner from "../components/common/LoadingSpinner";
import AccountInfoSection from "../components/profile/AccountInfoSection";
import ApplicationStatusCard from "../components/profile/ApplicationStatusCard";
import DocumentsCard from "../components/profile/DocumentsCard";
import GameAccountSection from "../components/profile/GameAccountSection";
import GameInstallationSection from "../components/profile/GameInstallationSection";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import TrainingProgressSection from "../components/profile/TrainingProgressSection";
import Sidebar, { NAV_ITEMS } from "../components/profile/Sidebar";
import LevelsSection from "../components/profile/LevelsSection";
import LeaderboardSection from "../components/profile/LeaderboardSection";
import { useProfileData } from "../hooks/useProfileData";
import { useState } from "react";
import FlightActivitySection from "../components/profile/FlightActivitySection";
import { C, EASE, FONT, labelCaps } from "../config/tokens";
import BrandLockup from "../components/military/BrandLockup";
import TacticalBackground from "../components/military/TacticalBackground";
import TricolorBar from "../components/military/TricolorBar";

const SectionTitle = ({ title }) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
    <Typography variant="h4" component="h2">
      {title}
    </Typography>
    <Box sx={{ flex: 1, height: "1px", bgcolor: C.ruleStrong }} />
  </Stack>
);

const ProfilePage = () => {
  const { profile, loading } = useProfileData();
  const [activeSection, setActiveSection] = useState('profile');

  const handleDownloadDocument = (doc) => {
    const r2BaseUrl = process.env.REACT_APP_R2_BASE_URL || "https://pub-05d3c9c914034a949c2227d5db6227cd.r2.dev";
    const fileUrl = doc.url || (doc.storedName ? `${r2BaseUrl}/${doc.storedName}` : null);
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("File URL not available for document:", doc);
    }
  };

  const handleDownloadGame = () => {
    console.log("Download game");
    window.open(profile?.gameInstallation?.downloadLink, "_blank");
  };


  if (loading) {
    return <LoadingSpinner message="Profil yüklənir" fullScreen />;
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Profil məlumatları yüklənə bilmədi</Alert>
      </Container>
    );
  }

  const isTrainer = profile?.userRole === 'trainer';
  const effectiveSection = isTrainer && !['profile', 'training'].includes(activeSection)
    ? 'profile'
    : activeSection;

  const visibleItems = isTrainer
    ? NAV_ITEMS.filter((item) => ['profile', 'training'].includes(item.id))
    : NAV_ITEMS;
  const sectionPosition = Math.max(
    0,
    visibleItems.findIndex((item) => item.id === effectiveSection)
  );
  const sectionLabel = visibleItems[sectionPosition]?.label || "";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", bgcolor: C.paper }}>
      {/* Sidebar */}
      <Sidebar active={effectiveSection} onSelect={setActiveSection} userRole={profile?.userRole} />

      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Mobile brand bar + tabs */}
        <Box sx={{ display: { xs: "block", md: "none" }, bgcolor: C.field900, color: C.textOnDark }}>
          <TricolorBar height={4} />
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.5 }}>
            <BrandLockup size="sm" />
          </Stack>
          <Sidebar
            variant="tabs"
            active={effectiveSection}
            onSelect={setActiveSection}
            userRole={profile?.userRole}
          />
        </Box>

        {/* Top bar */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 2,
            height: 60,
            px: { md: 3, lg: 5 },
            bgcolor: "rgba(251, 250, 245, 0.92)",
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${C.rule}`,
          }}
        >
          <Box sx={{ fontFamily: FONT.mono, fontSize: "0.72rem", letterSpacing: "0.1em", color: C.textFaint }}>
            ŞƏXSİ KABİNET /
          </Box>
          <Box
            key={effectiveSection}
            sx={{ ...labelCaps, fontSize: "0.9rem", color: C.text, animation: "sg-fade-in .4s ease backwards" }}
          >
            {sectionLabel}
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ position: "relative", flex: 1 }}>
          <TacticalBackground tone="light" topo={false} vignette={false} />
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 1280,
              mx: "auto",
              px: { xs: 2, sm: 3, lg: 5 },
              py: { xs: 3, md: 4 },
            }}
          >
            {/* Header */}
            <ProfileHeader profile={profile} />

            <Box key={effectiveSection} sx={{ animation: `sg-fade-up .5s ${EASE.out} backwards` }}>
              <SectionTitle title={sectionLabel} />

              {effectiveSection === 'profile' && (
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={7}>
                    <PersonalInfoSection personalInfo={profile.personalInfo} />
                    <AccountInfoSection contactInfo={profile.contactInfo} />
                  </Grid>
                  <Grid item xs={12} lg={5}>
                    <ApplicationStatusCard
                      applicationStatus={profile.applicationStatus}
                    />
                    <DocumentsCard
                      documents={profile.documents}
                      onDownloadDocument={handleDownloadDocument}
                    />
                  </Grid>
                </Grid>
              )}

              {effectiveSection === 'training' && (
                <TrainingProgressSection />
              )}

              {!isTrainer && effectiveSection === 'levels' && (
                <LevelsSection userRole={profile?.userRole} />
              )}

              {!isTrainer && effectiveSection === 'leaderboard' && (
                <LeaderboardSection userRole={profile?.userRole} />
              )}

              {!isTrainer && effectiveSection === 'download' && (
                <GameInstallationSection
                  gameInstallation={profile.gameInstallation}
                  onDownloadGame={handleDownloadGame}
                />
              )}

              {!isTrainer && effectiveSection === 'stats' && (
                <>
                  <GameAccountSection gameAccount={profile.gameAccount} />
                  <FlightActivitySection sessions={profile.gameAccount?.sessions} />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;

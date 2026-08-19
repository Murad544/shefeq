import { Alert, Box, Container, Grid, Typography } from "@mui/material";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ResponsiveContainer from "../components/common/ResponsiveContainer";
import AccountInfoSection from "../components/profile/AccountInfoSection";
import ApplicationStatusCard from "../components/profile/ApplicationStatusCard";
import DocumentsCard from "../components/profile/DocumentsCard";
import GameAccountSection from "../components/profile/GameAccountSection";
import GameInstallationSection from "../components/profile/GameInstallationSection";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import ProfileHeader from "../components/profile/ProfileHeader";
import TrainingProgressSection from "../components/profile/TrainingProgressSection";
import Sidebar from "../components/profile/Sidebar";
import LevelsSection from "../components/profile/LevelsSection";
import LeaderboardSection from "../components/profile/LeaderboardSection";
import { useProfileData } from "../hooks/useProfileData";
import { useState } from "react";
import FlightActivitySection from "../components/profile/FlightActivitySection";

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
    return <LoadingSpinner />;
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

  return (
    <ResponsiveContainer>
      <Box
        sx={{
          bgcolor: "background.paper",
          py: 4,
          px: 2,
          borderRadius: 2,
          boxShadow: 12,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <ProfileHeader profile={profile} />

          <Grid container spacing={3}>
            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              <Sidebar active={effectiveSection} onSelect={setActiveSection} userRole={profile?.userRole} />
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {effectiveSection === 'profile' && (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>Profil məlumatları</Typography>
                  <PersonalInfoSection personalInfo={profile.personalInfo} />

                  <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Əlaqə məlumatları</Typography>
                  <AccountInfoSection contactInfo={profile.contactInfo} />

                  <ApplicationStatusCard
                    applicationStatus={profile.applicationStatus}
                  />
                  <DocumentsCard
                    documents={profile.documents}
                    onDownloadDocument={handleDownloadDocument}
                  />
                </>
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
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Oyun yükləmə
                  </Typography>
                  <GameInstallationSection
                    gameInstallation={profile.gameInstallation}
                    onDownloadGame={handleDownloadGame}
                  />
                </>
              )}

              {!isTrainer && effectiveSection === 'stats' && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Oyun Statistikası
                  </Typography>
                  <GameAccountSection gameAccount={profile.gameAccount} />
                  <FlightActivitySection sessions={profile.gameAccount?.sessions} />
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ResponsiveContainer>
  );
};

export default ProfilePage;

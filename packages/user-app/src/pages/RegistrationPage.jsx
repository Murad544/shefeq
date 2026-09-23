import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Typography, Fade, Alert, Stack } from "@mui/material";
import { ScreenRotation, VerifiedUser } from "@mui/icons-material";
import dayjs from "dayjs";
import ErrorBoundary from "../components/common/ErrorBoundary";
import RegistrationStepper from "../components/registration/RegistrationStepper";
import StepNavigation from "../components/registration/StepNavigation";
import TemporaryRegistrationStep from "../components/registration/TemporaryRegistrationStep";
import ResultDialog from "../components/dialogs/ResultDialog";
import Logo from "../assets/icons/Logo";
import BrandLockup from "../components/military/BrandLockup";
import Emblem from "../components/military/Emblem";
import RadarLoader from "../components/military/RadarLoader";
import SegmentedProgress from "../components/military/SegmentedProgress";
import TacticalBackground from "../components/military/TacticalBackground";
import TricolorBar from "../components/military/TricolorBar";

// Step components
import PersonalInfoStep from "../components/registration/steps/PersonalInfoStep";
import EducationStep from "../components/registration/steps/EducationStep";
import SkillsStep from "../components/registration/steps/SkillsStep";
import QuestionsStep from "../components/registration/steps/QuestionsStep";
import UploadStep from "../components/registration/steps/UploadStep";
import ReviewStep from "../components/registration/steps/ReviewStep";

// Hooks
import useRegistrationForm from "../hooks/useRegistrationForm";
import useResultDialog from "../hooks/useResultDialog";

// Config
import { BRAND } from "../config/brand";
import { STRINGS } from "../config/constants";
import { TEMPORARY_SIMPLE_REGISTRATION } from "../config/registration";
import { C, EASE, FONT, labelCaps } from "../config/tokens";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const {
    step,
    form,
    questions,
    errors,
    loading,
    handleNext,
    handleBack,
    handleChange,
    handleSkillInputChange,
    handleAddSkill,
    handleDeleteSkill,
    handleAnswerChange,
    handleFileUpload,
    handleFileDelete,
    handleSubmit,
    isLastStep,
    totalSteps,
  } = useRegistrationForm();

  const {
    dialogOpen,
    dialogType,
    dialogMessage,
    openDialog,
    closeDialog,
    onOpenProfile,
  } = useResultDialog({ navigate });

  const onSubmit = async () => {
    try {
      await handleSubmit({ openDialog });
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const getStepProgress = () => {
    return ((step + 1) / totalSteps) * 100;
  };

  const renderStepContent = () => {
    if (TEMPORARY_SIMPLE_REGISTRATION) {
      return (
        <TemporaryRegistrationStep
          values={form}
          onChange={handleChange}
          errors={errors}
        />
      );
    }

    if (loading && questions.length === 0 && step === 3) {
      return (
        <Box sx={{ py: 8 }}>
          <RadarLoader message="Suallar yüklənir" />
        </Box>
      );
    }

    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            values={form}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <EducationStep
            values={form}
            onChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <SkillsStep
            skills={form.skills}
            skillInput={form.skillInput}
            onSkillInputChange={handleSkillInputChange}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
            errors={errors}
          />
        );
      case 3:
        return (
          <QuestionsStep
            questions={questions}
            answers={form.answers}
            onAnswerChange={handleAnswerChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <UploadStep
            mp4Files={form.mp4Files}
            pdfFiles={form.pdfFiles}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
            errors={errors}
          />
        );
      case 5:
        return <ReviewStep form={form} questions={questions} />;
      default:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="error">
              Gözlənilməz addım nömrəsi
            </Typography>
          </Box>
        );
    }
  };

  const hasFormErrors = () => {
    return Object.keys(errors).length > 0;
  };

  const docMeta = {
    fontFamily: FONT.mono,
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    color: C.textMuted,
    lineHeight: 1.9,
  };

  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          bgcolor: C.field900,
          pb: { xs: 3, md: 6 },
        }}
      >
        <TacticalBackground />

        <Box
          sx={{
            position: "relative",
            maxWidth: 920,
            mx: "auto",
            px: { xs: 0, sm: 2 },
          }}
        >
          {/* Utility row */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: { xs: 2, sm: 0 }, py: 2.5, color: C.textOnDark }}
          >
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "inline-flex",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <BrandLockup size="sm" />
            </Box>
          </Stack>

          {/* Document */}
          <Box
            sx={{
              position: "relative",
              bgcolor: C.paperRaised,
              boxShadow: "0 40px 80px -40px rgba(0, 0, 0, 0.8)",
              overflow: "hidden",
              animation: `sg-fade-up .7s ${EASE.out} backwards`,
            }}
          >
            <TricolorBar />

            {/* Header */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 4, md: 6 },
                pt: { xs: 3, md: 4.5 },
                pb: 2.5,
                borderBottom: `2px solid ${C.text}`,
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Logo size={56} />
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: C.brassDark, display: "block", lineHeight: 1.5 }}
                    >
                      {BRAND.COURSE_NAME}
                    </Typography>
                    <Typography
                      variant="h3"
                      component="h1"
                      sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}
                    >
                      Qeydiyyat forması
                    </Typography>
                  </Box>
                </Stack>
                <Box sx={{ ...docMeta, textAlign: { sm: "right" }, flexShrink: 0 }}>
                  <div>TARİX: {dayjs().format("DD.MM.YYYY")}</div>
                  <div>
                    ADDIM {step + 1} / {totalSteps}
                  </div>
                </Box>
              </Stack>
            </Box>
            <Box sx={{ height: 3, borderBottom: `1px solid ${C.text}` }} />

            {/* Body */}
            <Box
              sx={{
                position: "relative",
                px: { xs: 2.5, sm: 4, md: 6 },
                py: { xs: 3, md: 4.5 },
              }}
            >
              <Emblem
                decorative
                size={300}
                color={C.olive}
                opacity={0.045}
                sx={{
                  position: "absolute",
                  right: { xs: -60, md: 30 },
                  bottom: 30,
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative" }}>
                {/* Progress indicator */}
                <Box sx={{ mb: 4 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ ...labelCaps, fontSize: "0.72rem", color: C.textMuted, mb: 1 }}
                  >
                    <span>Doldurulma</span>
                    <span>
                      {step + 1} / {totalSteps} addım tamamlandı
                    </span>
                  </Stack>
                  <SegmentedProgress value={getStepProgress()} segments={24} height={8} />
                </Box>

                {/* Error alert */}
                {hasFormErrors() && (
                  <Alert
                    severity="warning"
                    sx={{ mb: 3, animation: "sg-fade-up .35s ease backwards" }}
                  >
                    <Typography variant="body2">
                      Formda səhvlər var. Zəhmət olmasa qırmızı sahələri düzəldin
                      və yenidən cəhd edin.
                    </Typography>
                  </Alert>
                )}

                {/* Stepper */}
                {!TEMPORARY_SIMPLE_REGISTRATION && (
                  <RegistrationStepper activeStep={step} steps={STRINGS.STEPS} />
                )}

                {/* Step Content */}
                <Box
                  sx={{
                    mb: 2,
                    minHeight: TEMPORARY_SIMPLE_REGISTRATION ? 0 : { xs: 400, md: 500 },
                    position: "relative",
                  }}
                >
                  <Fade
                    in={!loading}
                    timeout={300}
                    style={{
                      transitionDelay: loading ? "0ms" : "150ms",
                    }}
                  >
                    <Box key={step} sx={{ animation: `sg-fade-up .45s ${EASE.out} backwards` }}>
                      {renderStepContent()}
                    </Box>
                  </Fade>

                  {/* Loading overlay for form submission */}
                  {loading && dialogType !== "loading" && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        minHeight: 180,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(251, 250, 245, 0.85)",
                        zIndex: 1,
                      }}
                    >
                      <RadarLoader message="İşlənir" />
                    </Box>
                  )}
                </Box>

                {/* Navigation */}
                <StepNavigation
                  currentStep={step}
                  totalSteps={totalSteps}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSubmit={onSubmit}
                  isLastStep={isLastStep}
                  loading={loading}
                />

                {/* Form info footer */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="flex-start"
                  sx={{
                    mt: 3,
                    pt: 3,
                    borderTop: `1px dashed ${C.ruleStrong}`,
                  }}
                >
                  <VerifiedUser sx={{ color: C.olive, fontSize: 20, mt: 0.25 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: C.textMuted, lineHeight: 1.6, fontSize: "0.8rem" }}
                  >
                    Məlumatlarınız tədris prosesinin təşkili və yekun nəticənin
                    müəyyən edilməsi məqsədilə istifadə olunur və üçüncü
                    şəxslərlə paylaşılmır.
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* Result Dialog */}
          <ResultDialog
            open={dialogOpen}
            type={dialogType}
            message={dialogMessage}
            onClose={closeDialog}
            onOpenProfile={onOpenProfile}
          />

          {/* Help text for mobile users */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              mt: 2,
              px: 2,
              display: { xs: "flex", md: "none" },
              color: C.textOnDarkMuted,
            }}
          >
            <ScreenRotation sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
              Daha yaxşı təcrübə üçün telefonu üfüqi vəziyyətə çevirin
            </Typography>
          </Stack>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default RegistrationPage;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Fade,
  useTheme,
  Alert,
  LinearProgress,
} from "@mui/material";
import ResponsiveContainer from "../components/common/ResponsiveContainer";
import ErrorBoundary from "../components/common/ErrorBoundary";
import LoadingSpinner from "../components/common/LoadingSpinner";
import RegistrationStepper from "../components/registration/RegistrationStepper";
import StepNavigation from "../components/registration/StepNavigation";
import TemporaryRegistrationStep from "../components/registration/TemporaryRegistrationStep";
import ResultDialog from "../components/dialogs/ResultDialog";

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

const RegistrationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

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
          <LoadingSpinner message="Suallar yüklənir..." />
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

  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.dark} 100%)`,
          py: { xs: 2, md: 4 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(120px)",
              opacity: 0.1,
            },
            "&::before": {
              width: 300,
              height: 300,
              top: "10%",
              left: "10%",
              background: theme.palette.secondary.main,
            },
            "&::after": {
              width: 400,
              height: 400,
              bottom: "10%",
              right: "10%",
              background:
                theme.palette.accent?.main || theme.palette.secondary.light,
            },
          }}
        />

        <ResponsiveContainer maxWidth="lg" centerContent fullHeight padding={0}>
          <Fade in timeout={600}>
            <Paper
              elevation={16}
              sx={{
                mx: "auto",
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(20px)",
                boxShadow: `0 24px 48px rgba(54, 79, 107, 0.15)`,
                width: "100%",
                maxWidth: 900,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Progress indicator */}
              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getStepProgress()}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 1,
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {step + 1} / {totalSteps} addım tamamlandı
                </Typography>
              </Box>

              {/* Header */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {BRAND.PROJECT_NAME}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                >
                  Qeydiyyat formu
                </Typography>
                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {BRAND.COURSE_NAME}
                </Typography> */}
              </Box>

              {/* Error alert */}
              {hasFormErrors() && (
                <Alert severity="warning" sx={{ mb: 3 }} onClose={() => {}}>
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
                  mb: 4,
                  minHeight: { xs: 400, md: 500 },
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
                  <Box>{renderStepContent()}</Box>
                </Fade>

                {/* Loading overlay for form submission */}
                {loading && dialogType !== "loading" && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(4px)",
                      borderRadius: 2,
                      zIndex: 1,
                    }}
                  >
                    <LoadingSpinner message="İşlənir..." />
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
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: "1px solid",
                  borderColor: "grey.200",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    lineHeight: 1.5,
                  }}
                >
                  Məlumatlarınız tədris prosesinin təşkili və yekun nəticənin
                  müəyyən edilməsi <br /> məqsədilə istifadə olunur və üçüncü
                  şəxslərlə paylaşılmır.
                </Typography>
              </Box>
            </Paper>
          </Fade>

          {/* Result Dialog */}
          <ResultDialog
            open={dialogOpen}
            type={dialogType}
            message={dialogMessage}
            onClose={closeDialog}
            onOpenProfile={onOpenProfile}
          />

          {/* Help text for mobile users */}
          <Box sx={{ mt: 2, textAlign: "center", display: { md: "none" } }}>
            <Typography
              variant="caption"
              sx={{
                color: "white",
                opacity: 0.8,
                fontSize: "0.75rem",
              }}
            >
              💡 Daha yaxşı təcrübə üçün telefonu üfüqi vəziyyətə çevirin
            </Typography>
          </Box>
        </ResponsiveContainer>
      </Box>
    </ErrorBoundary>
  );
};

export default RegistrationPage;

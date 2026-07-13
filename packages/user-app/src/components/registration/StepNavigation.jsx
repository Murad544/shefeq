import { Box, Button } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { STRINGS } from "../../config/constants";

const StepNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isLastStep,
  loading = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 4,
        pt: 3,
        borderTop: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Button
        onClick={() => window.history.back()}
        variant="text"
        startIcon={<ArrowBack />}
        sx={{ color: "text.secondary" }}
      >
        {STRINGS.HOME}
      </Button>

      <Box sx={{ display: "flex", gap: 2, }}>
        <Button
          disabled={currentStep === 0 || loading}
          onClick={onBack}
          variant="outlined"
          size="large"
        >
          {STRINGS.BACK}
        </Button>

        {isLastStep ? (
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={onSubmit}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {STRINGS.SUBMIT}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onNext}
            disabled={loading}
            endIcon={<ArrowForward />}
            size="large"
          >
            {STRINGS.NEXT} ({currentStep + 1}/{totalSteps})
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default StepNavigation;

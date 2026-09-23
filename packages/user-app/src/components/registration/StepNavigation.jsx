import { Box, Button } from "@mui/material";
import { ArrowBack, ArrowForward, Send } from "@mui/icons-material";
import { STRINGS } from "../../config/constants";
import { C } from "../../config/tokens";

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
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        mt: 4,
        pt: 3,
        borderTop: `1px solid ${C.rule}`,
      }}
    >
      <Button
        onClick={() => window.history.back()}
        variant="text"
        startIcon={<ArrowBack />}
        sx={{ color: C.textMuted, "&:hover": { color: C.olive, bgcolor: "transparent" } }}
      >
        {STRINGS.HOME}
      </Button>

      <Box sx={{ display: "flex", gap: 1.5, ml: "auto" }}>
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
            endIcon={<Send />}
            sx={{ minWidth: 160 }}
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

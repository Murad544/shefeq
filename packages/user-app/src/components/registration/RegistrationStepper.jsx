import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  useTheme,
  Box,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check } from "@mui/icons-material";

// Connector with responsive offsets
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
    [theme.breakpoints.down("sm")]: {
      top: 6,
      left: "calc(-50% + 12px)",
      right: "calc(50% + 12px)",
    },
  },
  [`& .${StepConnector.line}`]: {
    borderColor: theme.palette.grey[300],
    borderTopWidth: 2,
    borderRadius: 1,
  },
  [`&.${StepConnector.active} .${StepConnector.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${StepConnector.completed} .${StepConnector.line}`]: {
    borderColor: theme.palette.primary.main,
  },
}));

// Icon that scales down on small screens
const CustomStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.2rem",
  fontWeight: 600,
  transition: theme.transitions.create(["background-color", "transform"], {
    duration: theme.transitions.duration.short,
  }),
  ...(ownerState.active && {
    backgroundColor: theme.palette.primary.main,
    transform: "scale(1.1)",
  }),
  [theme.breakpoints.down("sm")]: {
    width: 34,
    height: 34,
    fontSize: "0.95rem",
  },
}));

const CustomStepIcon = ({ active, completed, className, icon }) => {
  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {completed ? <Check fontSize="inherit" /> : icon}
    </CustomStepIconRoot>
  );
};

const RegistrationStepper = ({ activeStep, steps }) => {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        mb: 4,
        // Let the horizontal stepper scroll on very small screens
        overflowX: isSmDown ? "auto" : "visible",
        px: isSmDown ? 1 : 0,
      }}
    >
      <Stepper
        activeStep={activeStep}
        connector={<CustomStepConnector />}
        alternativeLabel
        sx={{
          minWidth: isSmDown ? 520 : "auto", // provide a scrollable width budget on phones
          "& .MuiStepLabel-label": {
            fontSize: isSmDown ? "0.75rem" : isMdDown ? "0.85rem" : "0.9rem",
            fontWeight: 500,
            mt: isSmDown ? 0.5 : 1,
            whiteSpace: isSmDown ? "nowrap" : "normal",
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: theme.palette.primary.main,
            fontWeight: 600,
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepLabel StepIconComponent={CustomStepIcon}>
              {/* On extra-small screens, try to keep labels short */}
              {isSmDown && typeof label === "string" && label.length > 18
                ? `${label.slice(0, 16)}…`
                : label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default RegistrationStepper;

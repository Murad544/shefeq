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
import { C, FONT } from "../../config/tokens";

// Connector with responsive offsets
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${StepConnector.alternativeLabel}`]: {
    top: 20,
    left: "calc(-50% + 26px)",
    right: "calc(50% + 26px)",
    [theme.breakpoints.down("sm")]: {
      top: 15,
      left: "calc(-50% + 20px)",
      right: "calc(50% + 20px)",
    },
  },
  [`& .${StepConnector.line}`]: {
    borderColor: C.rule,
    borderTopWidth: 2,
    borderTopStyle: "dashed",
  },
  [`&.${StepConnector.active} .${StepConnector.line}`]: {
    borderColor: C.olive,
    borderTopStyle: "solid",
  },
  [`&.${StepConnector.completed} .${StepConnector.line}`]: {
    borderColor: C.olive,
    borderTopStyle: "solid",
  },
}));

// Square step marker, like a numbered field on a form
const CustomStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? C.olive : C.paperRaised,
  border: `2px solid ${ownerState.completed || ownerState.active ? C.olive : C.ruleStrong}`,
  zIndex: 1,
  color: ownerState.completed ? C.paper : ownerState.active ? C.olive : C.textFaint,
  width: 42,
  height: 42,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: FONT.mono,
  fontSize: "1rem",
  fontWeight: 600,
  transition: theme.transitions.create(["background-color", "border-color", "box-shadow"], {
    duration: theme.transitions.duration.short,
  }),
  ...(ownerState.active && {
    boxShadow: `0 0 0 4px rgba(201, 166, 70, 0.3)`,
  }),
  [theme.breakpoints.down("sm")]: {
    width: 32,
    height: 32,
    fontSize: "0.85rem",
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
            fontSize: isSmDown ? "0.72rem" : isMdDown ? "0.8rem" : "0.85rem",
            mt: isSmDown ? 0.5 : 1,
            whiteSpace: isSmDown ? "nowrap" : "normal",
            color: C.textFaint,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: C.olive,
            fontWeight: 700,
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: C.text,
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

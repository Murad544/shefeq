import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import RadarLoader from "../military/RadarLoader";
import Stamp from "../military/Stamp";
import { BRAND } from "../../config/brand";
import { STRINGS } from "../../config/constants";
import { C, FONT } from "../../config/tokens";

const ResultDialog = ({ open, type, message, onClose }) => {
  const getDialogConfig = () => {
    switch (type) {
      case "loading":
        return {
          title: STRINGS.LOADING,
          stamp: null,
          accent: C.brass,
          allowClose: false,
        };
      case "success":
        return {
          title: STRINGS.SUCCESS_TITLE,
          stamp: <Stamp label="Qəbul edildi" tone="green" size="lg" />,
          accent: C.green,
          allowClose: true,
        };
      case "error":
        return {
          title: STRINGS.ERROR_TITLE,
          stamp: <Stamp label="Xəta" tone="red" size="lg" rotate={-5} />,
          accent: C.red,
          allowClose: true,
        };
      default:
        return {
          title: "",
          stamp: null,
          accent: C.brass,
          allowClose: true,
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Dialog
      open={open}
      onClose={config.allowClose ? onClose : undefined}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 500,
          m: 2,
          borderTop: `3px solid ${config.accent}`,
        },
      }}
      disableEscapeKeyDown={!config.allowClose}
    >
      <Box
        sx={{
          px: 3,
          pt: 1.5,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT.mono,
          fontSize: "0.66rem",
          letterSpacing: "0.1em",
          color: C.textFaint,
        }}
      >
        <span>{BRAND.PROJECT_NAME.toLocaleUpperCase("az")}</span>
        <span>{type === "loading" ? "ÖTÜRÜLÜR" : "HESABAT"}</span>
      </Box>

      <DialogTitle sx={{ textAlign: "center", pb: 0.5, pt: 2 }}>
        {config.title}
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2.5,
            gap: 2.5,
          }}
        >
          {type === "loading" ? (
            <RadarLoader size={84} message={STRINGS.PLEASE_WAIT} />
          ) : (
            config.stamp && (
              <Box sx={{ py: 1.5, px: 3, overflow: "hidden" }}>{config.stamp}</Box>
            )
          )}

          {message && (
            <Typography
              variant="body1"
              color="text.primary"
              textAlign="center"
              sx={{ maxWidth: "100%", color: C.textMuted, lineHeight: 1.7 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </DialogContent>

      {config.allowClose && (
        <DialogActions
          sx={{ justifyContent: "center", pb: 3, borderTop: `1px solid ${C.rule}`, pt: 2 }}
        >
          <Button onClick={onClose} variant="contained" sx={{ minWidth: 140 }}>
            {STRINGS.CLOSE}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ResultDialog;

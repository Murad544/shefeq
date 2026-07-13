import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import LoadingSpinner from "../common/LoadingSpinner";
import { STRINGS } from "../../config/constants";

const ResultDialog = ({ open, type, message, onClose }) => {
  const getDialogConfig = () => {
    switch (type) {
      case "loading":
        return {
          title: STRINGS.LOADING,
          icon: null,
          allowClose: false,
        };
      case "success":
        return {
          title: STRINGS.SUCCESS_TITLE,
          icon: <CheckCircle color="success" sx={{ fontSize: 64 }} />,
          allowClose: true,
        };
      case "error":
        return {
          title: STRINGS.ERROR_TITLE,
          icon: <Error color="error" sx={{ fontSize: 64 }} />,
          allowClose: true,
        };
      default:
        return {
          title: "",
          icon: null,
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
          borderRadius: 3,
          minWidth: 400,
          maxWidth: 500,
        },
      }}
      disableEscapeKeyDown={!config.allowClose}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.3rem",
          pb: 1,
        }}
      >
        {config.title}
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            gap: 2,
          }}
        >
          {type === "loading" ? (
            <LoadingSpinner message={STRINGS.PLEASE_WAIT} />
          ) : (
            <>{config.icon}</>
          )}

          {message && (
            <Typography
              variant="body1"
              color="text.primary"
              textAlign="center"
              sx={{ maxWidth: "100%" }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </DialogContent>

      {config.allowClose && (
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={onClose} variant="outlined" sx={{ minWidth: 121 }}>
            {STRINGS.CLOSE}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ResultDialog;

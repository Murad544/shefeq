import { Box, Button, Alert, CircularProgress, useTheme } from "@mui/material";
import { MdCheck, MdClose } from "react-icons/md";
import { formatDate, readField } from "../../../../utils/formatters";

export default function ActionButtons({
  applicant,
  accepting,
  rejecting,
  acceptError,
  rejectError,
  acceptSuccess,
  rejectSuccess,
  isAlreadyAccepted,
  handleAcceptUser,
  handleRejectUser,
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: { xs: 3, md: 4 },
        py: 2,
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        bgcolor: "background.paper",
      }}
    >
      {/* Success Alerts */}
      {acceptSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          Müraciət uğurla qəbul edildi!
        </Alert>
      )}

      {rejectSuccess && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          {isAlreadyAccepted
            ? "Müraciət qəbul edilmişlər siyahısından çıxarıldı!"
            : "Müraciət rədd edildi!"}
        </Alert>
      )}

      {/* Error Alerts */}
      {acceptError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          Qəbul xətası: {acceptError}
        </Alert>
      )}

      {rejectError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          Rədd xətası: {rejectError}
        </Alert>
      )}

      {/* Status Info for Accepted Users */}
      {isAlreadyAccepted && !rejectSuccess && (
        <Alert
          severity="info"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          Bu müraciət artıq qəbul edilmişdir.
          {readField(applicant, "accepted_at") &&
            ` Qəbul tarixi: ${formatDate(readField(applicant, "accepted_at"))}`}
        </Alert>
      )}

      {/* Action Button */}
      {!isAlreadyAccepted ? (
        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          onClick={handleAcceptUser}
          disabled={accepting || acceptSuccess}
          startIcon={
            accepting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <MdCheck size={20} />
            )
          }
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
            },
            "&:disabled": {
              opacity: 0.7,
              transform: "none",
            },
          }}
        >
          {accepting
            ? "Qəbul edilir..."
            : acceptSuccess
            ? "Qəbul edildi!"
            : "Müraciəti qəbul et"}
        </Button>
      ) : (
        <Button
          fullWidth
          variant="contained"
          color="error"
          size="large"
          onClick={handleRejectUser}
          disabled={rejecting || rejectSuccess}
          startIcon={
            rejecting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <MdClose size={20} />
            )
          }
          sx={{
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.25)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 6px 20px rgba(239, 68, 68, 0.35)",
            },
            "&:disabled": {
              opacity: 0.7,
              transform: "none",
            },
          }}
        >
          {rejecting
            ? "Çıxarılır..."
            : rejectSuccess
            ? "Çıxarıldı!"
            : "Qəbul edilmişlərdən çıxar"}
        </Button>
      )}
    </Box>
  );
}

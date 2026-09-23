import { Box, Button, Alert, CircularProgress } from "@mui/material";
import { MdCheck, MdClose } from "react-icons/md";
import { formatDate, readField } from "../../../../utils/formatters";
import Stamp from "../../../ui/Military/Stamp";
import { C } from "../../../../styles/tokens";

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
  return (
    <Box
      sx={{
        px: { xs: 3, md: 4 },
        py: 2,
        borderBottom: `1px solid ${C.rule}`,
        bgcolor: C.paperRaised,
      }}
    >
      {/* Decision stamp */}
      {(acceptSuccess || rejectSuccess) && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 1.5, mb: 1, overflow: "hidden" }}>
          <Stamp
            label={acceptSuccess ? "Qəbul edildi" : "Rədd edildi"}
            tone={acceptSuccess ? "green" : "red"}
            size="lg"
          />
        </Box>
      )}

      {/* Success Alerts */}
      {acceptSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Müraciət uğurla qəbul edildi!
        </Alert>
      )}

      {rejectSuccess && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {isAlreadyAccepted
            ? "Müraciət qəbul edilmişlər siyahısından çıxarıldı!"
            : "Müraciət rədd edildi!"}
        </Alert>
      )}

      {/* Error Alerts */}
      {acceptError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Qəbul xətası: {acceptError}
        </Alert>
      )}

      {rejectError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Rədd xətası: {rejectError}
        </Alert>
      )}

      {/* Status Info for Accepted Users */}
      {isAlreadyAccepted && !rejectSuccess && (
        <Alert severity="info" sx={{ mb: 2 }}>
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

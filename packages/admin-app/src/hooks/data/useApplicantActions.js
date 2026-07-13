import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useApplicantActions(applicant, onActionComplete) {
  const [accepting, setAccepting] = React.useState(false);
  const [rejecting, setRejecting] = React.useState(false);
  const [acceptError, setAcceptError] = React.useState("");
  const [rejectError, setRejectError] = React.useState("");
  const [acceptSuccess, setAcceptSuccess] = React.useState(false);
  const [rejectSuccess, setRejectSuccess] = React.useState(false);
  const [isAlreadyAccepted, setIsAlreadyAccepted] = React.useState(false);

  const userId = applicant?.id || applicant?.application_id;

  const checkAcceptanceStatus = React.useCallback(async () => {
    if (!userId) return;

    try {
      const result = await adminApi.checkIfAccepted(userId);
      setIsAlreadyAccepted(result?.isApproved || false);
    } catch (error) {
      console.error("Error checking acceptance status:", error);
    }
  }, [userId]);

  React.useEffect(() => {
    checkAcceptanceStatus();
  }, [checkAcceptanceStatus]);

  const handleAcceptUser = React.useCallback(async () => {
    if (!userId || accepting || isAlreadyAccepted) return;

    setAccepting(true);
    setAcceptError("");
    setRejectError("");

    try {
      await adminApi.acceptUser(userId);
      setAcceptSuccess(true);
      setIsAlreadyAccepted(true);

      if (onActionComplete) {
        onActionComplete("accept", applicant);
      }
    } catch (error) {
      console.error("Error accepting user:", error);
      setAcceptError(error.message || "Xəta baş verdi");
    } finally {
      setAccepting(false);
    }
  }, [userId, accepting, isAlreadyAccepted, applicant, onActionComplete]);

  const handleRejectUser = React.useCallback(async () => {
    if (!userId || rejecting) return;

    setRejecting(true);
    setRejectError("");
    setAcceptError("");

    try {
      if (isAlreadyAccepted) {
        await adminApi.rejectUser(userId);
        setIsAlreadyAccepted(false);
      }

      setRejectSuccess(true);

      if (onActionComplete) {
        onActionComplete("reject", applicant);
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      setRejectError(error.message || "Xəta baş verdi");
    } finally {
      setRejecting(false);
    }
  }, [userId, rejecting, isAlreadyAccepted, applicant, onActionComplete]);

  const resetState = React.useCallback(() => {
    setAcceptSuccess(false);
    setRejectSuccess(false);
    setAcceptError("");
    setRejectError("");
  }, []);

  React.useEffect(() => {
    resetState();
  }, [applicant, resetState]);

  return {
    accepting,
    rejecting,
    acceptError,
    rejectError,
    acceptSuccess,
    rejectSuccess,
    isAlreadyAccepted,
    handleAcceptUser,
    handleRejectUser,
    resetErrors: () => {
      setAcceptError("");
      setRejectError("");
    },
    resetSuccess: () => {
      setAcceptSuccess(false);
      setRejectSuccess(false);
    },
    resetState,
  };
}

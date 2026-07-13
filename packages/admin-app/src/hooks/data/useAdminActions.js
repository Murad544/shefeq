import * as React from "react";
import { adminApi } from "../../api/adminApi";

export function useAdminActions(admin) {
  const [activating, setActivating] = React.useState(false);
  const [deactivating, setDeactivating] = React.useState(false);
  const [activationError, setActivationError] = React.useState("");
  const [deactivationError, setDeactivationError] = React.useState("");
  const [activationSuccess, setActivationSuccess] = React.useState(false);
  const [deactivationSuccess, setDeactivationSuccess] = React.useState(false);
  const [isActivated, setIsActivated] = React.useState(admin.is_active);

  const adminId = admin?.id || admin?.user_id;

  const handleActivateAdmin = React.useCallback(async () => {
    if (!adminId || activating) return;

    setActivating(true);
    setActivationError("");
    setDeactivationError("");

    try {
      await adminApi.activateAdmin(adminId);
      setActivationSuccess(true);
      setIsActivated(true);
    } catch (error) {
      console.error("Error activating admin:", error);
      setActivationError(error.message || "Xəta baş verdi");
    } finally {
      setActivating(false);
    }
  }, [adminId, activating, admin]);

  const handleDeactivateAdmin = React.useCallback(async () => {
    if (!adminId || deactivating) return;

    setDeactivating(true);
    setDeactivationError("");
    setActivationError("");

    try {
      if (admin.is_active) {
        await adminApi.deactivateAdmin(adminId);
      }

      setDeactivationSuccess(true);
      setIsActivated(false);
    } catch (error) {
      console.error("Error deactivating admin:", error);
      setDeactivationError(error.message || "Xəta baş verdi");
    } finally {
      setDeactivating(false);
    }
  }, [adminId, deactivating, admin]);

  const resetState = React.useCallback(() => {
    setActivationSuccess(false);
    setDeactivationSuccess(false);
    setActivationError("");
    setDeactivationError("");
  }, []);

  React.useEffect(() => {
    resetState();
  }, [admin, resetState]);

  return {
    activating,
    deactivating,
    activationError,
    deactivationError,
    activationSuccess,
    deactivationSuccess,
    isActivated,
    handleActivateAdmin,
    handleDeactivateAdmin,
    resetErrors: () => {
      setActivationError("");
      setDeactivationError("");
    },
    resetSuccess: () => {
      setActivationSuccess(false);
      setDeactivationSuccess(false);
    },
    resetState,
  };
}

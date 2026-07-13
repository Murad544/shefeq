import { useState, useCallback } from "react";
import { STRINGS } from "../config/constants";

export const useErrorHandler = () => {
  const [errors, setErrors] = useState({});

  const handleError = useCallback((error, context = "") => {
    console.error(`Error in ${context}:`, error);

    let errorMessage = "Gözlənilməz xəta baş verdi.";
    const message = (error?.message || "").toLowerCase();

    if (
      message.includes("national_id_num already exists") ||
      message.includes("national id already exists")
    ) {
      errorMessage =
        "Bu şəxsiyyət vəsiqəsi nömrəsi ilə artıq qeydiyyat mövcuddur.";
    } else if (message.includes("validation")) {
      errorMessage = "Məlumatlarınızı yoxlayın və yenidən cəhd edin.";
    } else if (message.includes("file too large")) {
      errorMessage = "Yüklədiyiniz fayllardan biri çox böyükdür (max 20MB).";
    } else if (message.includes("invalid file type")) {
      errorMessage =
        STRINGS.INVALID_FILE_TYPE || "Yalnız PDF və MP4 faylları qəbul edilir.";
    } else if (message.includes("network")) {
      errorMessage = "İnternet bağlantısını yoxlayın və yenidən cəhd edin.";
    } else {
      errorMessage = error.message;
    }

    // Handle validation errors from backend
    if (error?.validationErrors) {
      const backendErrors = {};

      if (error.validationErrors.fieldErrors) {
        Object.keys(error.validationErrors.fieldErrors).forEach((field) => {
          const fieldErrors = error.validationErrors.fieldErrors[field];
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            backendErrors[field] = fieldErrors[0];
          }
        });
      }

      setErrors(backendErrors);
    }

    return errorMessage;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const getErrorMessage = useCallback((errorType) => {
    // Use STRINGS constants for consistent error messaging
    switch (errorType) {
      case "REQUIRED_FIELD":
        return STRINGS.REQUIRED_FIELD;
      case "INVALID_EMAIL":
        return STRINGS.INVALID_EMAIL;
      case "INVALID_PHONE":
        return STRINGS.INVALID_PHONE;
      case "MIN_SKILLS":
        return STRINGS.MIN_SKILLS;
      default:
        return "Xəta baş verdi";
    }
  }, []);

  return {
    errors,
    handleError,
    clearErrors,
    clearFieldError,
    getErrorMessage,
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone?.replace(/[\s\-\(\)]/g, "") || "");
};

export const validateRequired = (value) => {
  return value != null && String(value).trim().length > 0;
};

export const validateLength = (value, min = 0, max = Infinity) => {
  const length = String(value || "").length;
  return length >= min && length <= max;
};

export const createValidator = (rules) => (value) => {
  for (const rule of rules) {
    const result = rule(value);
    if (result !== true) {
      return result;
    }
  }
  return true;
};

export const VALIDATION_RULES = {
  required:
    (message = "Bu sahə tələb olunur") =>
    (value) =>
      validateRequired(value) || message,

  email:
    (message = "Düzgün e-poçt ünvanı daxil edin") =>
    (value) =>
      !value || validateEmail(value) || message,

  phone:
    (message = "Düzgün telefon nömrəsi daxil edin") =>
    (value) =>
      !value || validatePhone(value) || message,

  minLength: (min, message) => (value) =>
    !value || validateLength(value, min) || message || `Minimum ${min} simvol`,

  maxLength: (max, message) => (value) =>
    !value ||
    validateLength(value, 0, max) ||
    message ||
    `Maksimum ${max} simvol`,
};

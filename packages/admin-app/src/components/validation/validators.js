import { adminSchema } from "./schemas";

export const validate = async (formData) => {
  if (!adminSchema) {
    return { isValid: true, errors: {} };
  }

  try {
    await adminSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (validationError) {
    const errors = {};

    validationError.inner.forEach((error) => {
      if (error.path && error.path.startsWith("answers[")) {
        // Handle nested answer validation
        const match = error.path.match(/^answers\[(\d+)\]\.answer$/);
        if (match) {
          const index = parseInt(match[1], 10);
          errors.answers = errors.answers || [];
          errors.answers[index] = error.message;
        }
      } else if (error.path) {
        errors[error.path] = error.message;
      }
    });

    return { isValid: false, errors };
  }
};

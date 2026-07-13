import {
  personalInfoSchema,
  educationSchema,
  skillsSchema,
  questionsSchema,
  uploadsSchema,
} from "./schemas";

const stepSchemas = [
  personalInfoSchema, // Step 0
  educationSchema, // Step 1
  skillsSchema, // Step 2
  questionsSchema, // Step 3
  uploadsSchema, // Step 4
  null, // Step 5 (Review - no validation)
];

export const validateStep = async (stepIndex, formData) => {
  const schema = stepSchemas[stepIndex];

  if (!schema) {
    return { isValid: true, errors: {} };
  }

  try {
    await schema.validate(formData, { abortEarly: false });
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

export const validateAllSteps = async (formData) => {
  const allErrors = {};
  let hasErrors = false;

  for (let i = 0; i < stepSchemas.length - 1; i++) {
    const validation = await validateStep(i, formData);
    if (!validation.isValid) {
      allErrors[`step${i}`] = validation.errors;
      hasErrors = true;
    }
  }

  return { isValid: !hasErrors, errors: allErrors };
};

export const validateField = async (fieldName, value, stepIndex) => {
  const schema = stepSchemas[stepIndex];

  if (!schema) return { isValid: true, error: null };

  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

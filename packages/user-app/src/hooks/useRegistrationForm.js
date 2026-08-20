import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useErrorHandler } from "./useErrorHandler";
import { apiClient } from "../services/api/apiClient";
import { API_ENDPOINTS } from "../config/constants";
import { validateStep } from "../services/validation/validators";
import { formatPhoneNumberForSubmission } from "../utils/formatters";

const TOTAL_STEPS = 6;

const initialFormState = {
  // Personal Information
  name: "",
  surname: "",
  fatherName: "",
  dateOfBirth: "",
  sex: "",
  role: "trainee",
  placeOfBirth: "",
  nationalSerialNumber: "",
  nationalIdNumber: "",
  phoneNumber: "",
  email: "",

  // Education
  educationLevel: "",
  university: "",
  profession: "",

  // Skills
  skills: [],
  skillInput: "",

  // Questions
  answers: [],

  // Files
  mp4Files: [],
  pdfFiles: [],
};

export const useRegistrationForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialFormState);
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(API_ENDPOINTS.QUESTIONS);

        let questionsArray = [];
        if (Array.isArray(response)) {
          questionsArray = response;
        } else if (response?.questions && Array.isArray(response.questions)) {
          questionsArray = response.questions;
        } else if (response?.data && Array.isArray(response.data)) {
          questionsArray = response.data;
        }

        setQuestions(questionsArray);
        setForm((prev) => ({
          ...prev,
          answers: questionsArray.map((q) => ({
            question_id: q.id,
            answer: "",
          })),
        }));
      } catch (error) {
        handleError(error, "Sualların yüklənməsi");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [handleError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSkillInputChange = (e) => {
    setForm((prev) => ({ ...prev, skillInput: e.target.value }));
  };

  const handleAddSkill = () => {
    const skills = form.skillInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!skills.length) return;

    setForm((prev) => {
      const existingSkills = prev.skills.map((s) => s.toLowerCase());

      const newSkills = skills
        .filter((skill) => !existingSkills.includes(skill.toLowerCase()))
        .map((skill) => skill?.[0]?.toUpperCase() + skill?.slice(1) || "");

      if (!newSkills.length) return prev;

      return {
        ...prev,
        skills: [...prev.skills, ...newSkills],
        skillInput: "",
      };
    });
  };

  const handleDeleteSkill = (skillToDelete) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToDelete),
    }));
  };

  const handleAnswerChange = (index, value) => {
    setForm((prev) => {
      const newAnswers = [...prev.answers];
      if (newAnswers[index]) {
        newAnswers[index] = { ...newAnswers[index], answer: value };
      }
      return { ...prev, answers: newAnswers };
    });

    if (errors.answers && errors.answers[index]) {
      const newAnswerErrors = [...(errors.answers || [])];
      newAnswerErrors[index] = undefined;
      setErrors((prev) => ({ ...prev, answers: newAnswerErrors }));
    }
  };

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files);

    setForm((prev) => ({
      ...prev,
      [fileType]: [...prev[fileType], ...files],
    }));

    if (errors[fileType]) {
      setErrors((prev) => ({ ...prev, [fileType]: undefined }));
    }
  };

  const handleFileDelete = (fileType, index) => {
    setForm((prev) => {
      const newFiles = [...prev[fileType]];
      newFiles.splice(index, 1);
      return { ...prev, [fileType]: newFiles };
    });
  };

  const handleNext = async () => {
    const validation = await validateStep(step, form);

    if (validation.isValid) {
      setErrors({});
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    } else {
      setErrors(validation.errors);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const buildFormData = () => {
    const formData = new FormData();

    const textFields = [
      "name",
      "surname",
      "fatherName",
      "dateOfBirth",
      "sex",
      "role",
      "placeOfBirth",
      "nationalSerialNumber",
      "nationalIdNumber",
      "email",
      "educationLevel",
      "university",
      "profession",
    ];

    textFields.forEach((field) => {
      if (!form[field]) return;

      // Convert dateOfBirth to ISO format expected by backend (YYYY-MM-DD)
      if (field === "dateOfBirth") {
        // Try parsing known frontend formats first
        let isoDate = null;
        const raw = form.dateOfBirth;
        const tryFormats = ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];
        for (const fmt of tryFormats) {
          const parsed = dayjs(raw, fmt, true);
          if (parsed.isValid()) {
            isoDate = parsed.format("YYYY-MM-DD");
            break;
          }
        }

        // Fallback: attempt generic parse
        if (!isoDate) {
          const parsed = dayjs(raw);
          if (parsed.isValid()) isoDate = parsed.format("YYYY-MM-DD");
        }

        if (isoDate) {
          formData.append(field, isoDate);
        } else {
          // If parsing failed, still append raw value to let backend validate
          formData.append(field, raw);
        }

        return;
      }

      formData.append(field, form[field]);
    });

    if (form.phoneNumber) {
      const originalPhone = form.phoneNumber;
      const formattedPhone = formatPhoneNumberForSubmission(originalPhone);
      formData.append("phoneNumber", formattedPhone);
    }

    if (form.skills.length > 0) {
      formData.append("skills", JSON.stringify(form.skills));
    }

    if (form.answers.length > 0) {
      const validAnswers = form.answers.filter((a) => a.answer.trim() !== "");
      if (validAnswers.length > 0) {
        formData.append("answers", JSON.stringify(validAnswers));
      }
    }

    form.mp4Files.forEach((file) => formData.append("mp4Files", file));
    form.pdfFiles.forEach((file) => formData.append("pdfFiles", file));

    return formData;
  };

  const handleSubmit = async ({ openDialog }) => {
    try {
      setLoading(true);
      if (openDialog) openDialog("loading", "Yüklənir...");

      for (let i = 0; i < TOTAL_STEPS - 1; i++) {
        const validation = await validateStep(i, form);
        if (!validation.isValid) {
          setErrors(validation.errors);
          if (openDialog) {
            openDialog("error", "Formda səhvlər var. Zəhmət olmasa yoxlayın.");
          }
          setStep(i);
          return;
        }
      }

      setErrors({});

      const formData = buildFormData();

      const result = await apiClient.post(API_ENDPOINTS.REGISTER, formData);

      if (openDialog) {
        openDialog(
          "success",
          "Müraciətiniz komandamız tərəfindən qiymətləndiriləcək və növbəti mərhələ üçün sizinlə əlaqə saxlanılacaq. Məlumatlarınız yalnız seçim prosesi üçün istifadə olunur və üçüncü tərəflərlə paylaşılmır.",
        );
      }

      setForm(initialFormState);
      setStep(0);
      setErrors({});

      return result;
    } catch (error) {
      const result = handleError(error, "Qeydiyyat");
      const errorMessage =
        result?.message ||
        (typeof result === "string" ? result : "Xəta baş verdi");

      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
      }

      if (openDialog) {
        openDialog("error", errorMessage);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    step,
    form,
    questions,
    errors,
    loading,

    // Setters
    setStep,
    setForm,

    // Handlers
    handleChange,
    handleSkillInputChange,
    handleAddSkill,
    handleDeleteSkill,
    handleAnswerChange,
    handleFileUpload,
    handleFileDelete,
    handleNext,
    handleBack,
    handleSubmit,

    // Utilities
    isLastStep: step === TOTAL_STEPS - 1,
    totalSteps: TOTAL_STEPS,
  };
};

export default useRegistrationForm;

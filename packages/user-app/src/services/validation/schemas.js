import * as Yup from "yup";
import { VALIDATION_RULES, STRINGS } from "../../config/constants";

export const personalInfoSchema = Yup.object({
  name: Yup.string()
    .min(2, "Ad ən azı 2 hərf olmalıdır")
    .max(50, "Ad 50 hərfdən çox ola bilməz")
    .required(STRINGS.REQUIRED_FIELD),

  surname: Yup.string()
    .min(2, "Soyad ən azı 2 hərf olmalıdır")
    .max(50, "Soyad 50 hərfdən çox ola bilməz")
    .required(STRINGS.REQUIRED_FIELD),

  fatherName: Yup.string()
    .min(2, "Ata adı ən azı 2 hərf olmalıdır")
    .max(50, "Ata adı 50 hərfdən çox ola bilməz")
    .required(STRINGS.REQUIRED_FIELD),

  sex: Yup.string().required(STRINGS.REQUIRED_FIELD),

  dateOfBirth: Yup.string().required(STRINGS.REQUIRED_FIELD),

  placeOfBirth: Yup.string().required(STRINGS.REQUIRED_FIELD),

  nationalSerialNumber: Yup.string()
    .matches(
      VALIDATION_RULES.NATIONAL_SERIAL_NUM_REGEX,
      STRINGS.INVALID_SERIAL_NUMBER
    )
    .required(STRINGS.REQUIRED_FIELD),

  nationalIdNumber: Yup.string()
    .matches(VALIDATION_RULES.NATIONAL_ID_NUM_REGEX, STRINGS.INVALID_ID_NUMBER)
    .required(STRINGS.REQUIRED_FIELD),

  phoneNumber: Yup.string()
    .matches(VALIDATION_RULES.PHONE_REGEX, STRINGS.INVALID_PHONE)
    .required(STRINGS.REQUIRED_FIELD),

  email: Yup.string()
    .email(STRINGS.INVALID_EMAIL)
    .required(STRINGS.REQUIRED_FIELD),
});

export const educationSchema = Yup.object({
  educationLevel: Yup.string().required(STRINGS.REQUIRED_FIELD),
  university: Yup.string().required(STRINGS.REQUIRED_FIELD),
  profession: Yup.string().required(STRINGS.REQUIRED_FIELD),
});

export const skillsSchema = Yup.object({
  skills: Yup.array()
    .min(VALIDATION_RULES.MIN_SKILLS, STRINGS.MIN_SKILLS)
    .required(STRINGS.REQUIRED_FIELD),
});

export const questionsSchema = Yup.object({
  answers: Yup.array()
    .of(
      Yup.object({
        question_id: Yup.number().required(),
        answer: Yup.string()
          .min(2, "Cavab ən azı 2 hərf olmalıdır")
          .max(1000, "Cavab 1000 hərfdən çox ola bilməz")
          .required(STRINGS.REQUIRED_FIELD),
      })
    )
    .min(VALIDATION_RULES.MIN_ANSWERS, "Bütün sualları cavablandırın")
    .required(STRINGS.REQUIRED_FIELD),
});

export const uploadsSchema = Yup.object({
  mp4Files: Yup.array().test(
    "file-size",
    "Hər fayl 100MB-dan kiçik olmalıdır",
    (files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 100 * 1024 * 1024);
    }
  ),

  pdfFiles: Yup.array().test(
    "file-size",
    "Hər fayl 100MB-dan kiçik olmalıdır",
    (files) => {
      if (!files) return true;
      return files.every((file) => file.size <= 100 * 1024 * 1024);
    }
  ),
});

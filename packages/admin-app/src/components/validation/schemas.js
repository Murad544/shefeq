import * as Yup from "yup";

const REQUIRED_FIELD = "Bu sahə tələb olunur";
const INVALID_EMAIL = "E-poçt ünvanı düzgün deyil";

export const adminSchema = Yup.object({
  name: Yup.string()
    .min(2, "Ad ən azı 2 hərf olmalıdır")
    .max(50, "Ad 50 hərfdən çox ola bilməz")
    .required(REQUIRED_FIELD),

  password: Yup.string()
    .min(8, "Şifrə ən az 8 hərf olmalıdır")
    .max(50, "Şifrə 50 hərfdən çox ola bilməz")
    .required(REQUIRED_FIELD),

  repeatPassword: Yup.string()
    .min(8, "Şifrə ən az 8 hərf olmalıdır")
    .max(50, "Şifrə 50 hərfdən çox ola bilməz")
    .required(REQUIRED_FIELD),

  email: Yup.string().email(INVALID_EMAIL).required(REQUIRED_FIELD),

  role: Yup.string().required(REQUIRED_FIELD),
});

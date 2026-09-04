import * as Yup from "yup";
import { STRINGS, VALIDATION_RULES } from "../../config/constants";

const temporaryRegistrationSchema = Yup.object({
  name: Yup.string().min(2).max(50).required(STRINGS.REQUIRED_FIELD),
  surname: Yup.string().min(2).max(50).required(STRINGS.REQUIRED_FIELD),
  role: Yup.string()
    .oneOf(["trainee", "trainer"])
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

export default temporaryRegistrationSchema;

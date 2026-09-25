import { Grid, Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { enUS as enPicker, ruRU as ruPicker } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import "dayjs/locale/az";
import "dayjs/locale/ru";
import FormField from "../../common/FormField";
import { useLanguage } from "../../../i18n/LanguageContext";
import { sexOptions } from "../../../constants/options/sexOptions";
import { roleOptions } from "../../../constants/options/roleOptions";
import { placeOfBirthOptions } from "../../../constants/options/placeOfBirthOptions";

const englishPickerText = enPicker.components.MuiLocalizationProvider.defaultProps.localeText;
const russianPickerText = ruPicker.components.MuiLocalizationProvider.defaultProps.localeText;
const azerbaijaniPickerText = {
  ...englishPickerText,
  previousMonth: "Əvvəlki ay",
  nextMonth: "Növbəti ay",
  openPreviousView: "Əvvəlki görünüşü aç",
  openNextView: "Növbəti görünüşü aç",
  calendarViewSwitchingButtonAriaLabel: (view) =>
    view === "year" ? "Təqvim görünüşünə keç" : "İl görünüşünə keç",
  cancelButtonLabel: "Ləğv et",
  clearButtonLabel: "Təmizlə",
  okButtonLabel: "Təsdiqlə",
  todayButtonLabel: "Bu gün",
  datePickerDefaultToolbarTitle: "Tarix seçin",
  openDatePickerDialogue: () => "Tarix seçin",
  dateTableLabel: "Tarix seçin",
};
const pickerText = { az: azerbaijaniPickerText, en: englishPickerText, ru: russianPickerText };

const PersonalInfoStep = ({ values, onChange, errors = {} }) => {
  const { language } = useLanguage();
  const handleDateChange = (date) => {
    onChange({
      target: {
        name: "dateOfBirth",
        value: date ? date.format("DD-MM-YYYY") : "",
      },
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Şəxsi məlumatlar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormField
            name="name"
            label="Ad"
            value={values.name}
            onChange={onChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            name="surname"
            label="Soyad"
            value={values.surname}
            onChange={onChange}
            error={!!errors.surname}
            helperText={errors.surname}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            name="fatherName"
            label="Ata adı"
            value={values.fatherName}
            onChange={onChange}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="select"
            name="sex"
            label="Cinsi"
            value={values.sex}
            onChange={onChange}
            options={sexOptions}
            error={!!errors.sex}
            helperText={errors.sex}
            placeholder="Seçin"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="select"
            name="role"
            label="Rolu"
            value={values.role || "trainee"}
            onChange={onChange}
            options={roleOptions}
            error={!!errors.role}
            helperText={errors.role}
            placeholder="Seçin"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language} localeText={pickerText[language]}>
            <DatePicker
              label="Doğum tarixi"
              value={
                values.dateOfBirth
                  ? dayjs(values.dateOfBirth, "DD-MM-YYYY")
                  : null
              }
              maxDate={dayjs()}
              onChange={handleDateChange}
              inputFormat="DD/MM/YYYY"
              renderInput={(params) => (
                <FormField
                  {...params}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                  placeholder="DD/MM/YYYY"
                  required
                />
              )}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="select"
            name="placeOfBirth"
            label="Doğulduğu yer"
            value={values.placeOfBirth}
            onChange={onChange}
            options={placeOfBirthOptions}
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth}
            placeholder="Seçin"
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            name="nationalSerialNumber"
            label="Şəxsiyyət vəsiqəsinin seriya və nömrəsi"
            value={values.nationalSerialNumber}
            onChange={onChange}
            error={!!errors.nationalSerialNumber}
            helperText={errors.nationalSerialNumber}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            name="nationalIdNumber"
            label="FİN (Fərdi identifikasiya nömrəsi)"
            value={values.nationalIdNumber}
            onChange={onChange}
            error={!!errors.nationalIdNumber}
            helperText={errors.nationalIdNumber}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="tel"
            name="phoneNumber"
            label="Telefon"
            value={values.phoneNumber}
            onChange={onChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            type="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={onChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;

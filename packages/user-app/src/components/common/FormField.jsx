import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useLanguage } from "../../i18n/LanguageContext";
import { translate } from "../../i18n/translations";

const filter = createFilterOptions();

const FormField = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  options = [],
  required = false,
  fullWidth = true,
  placeholder,
  multiline = false,
  minRows,
  maxRows,
  disabled = false,
  ...props
}) => {
  const { language } = useLanguage();
  const localizedOptions = options.map((option) =>
    typeof option === "string"
      ? translate(option, language)
      : { ...option, label: translate(option.label, language) }
  );

  if (type === "select") {
    return (
      <FormControl fullWidth={fullWidth} error={!!error} disabled={disabled}>
        <InputLabel required={required}>{label}</InputLabel>
        <Select
          name={name}
          value={value || ""}
          onChange={onChange}
          label={label}
          {...props}
        >
          {placeholder && (
            <MenuItem value="">
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {localizedOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  } else if (type === "autocomplete") {
    return (
      <FormControl fullWidth={fullWidth} error={!!error} disabled={disabled}>
        <Autocomplete
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          freeSolo
          options={localizedOptions}
          // Resolve current value (primitive) to option object for Autocomplete
          value={
            (value && localizedOptions.find((o) => o.value === value)) ||
            value ||
            null
          }
          onChange={(event, newValue) => {
            let finalValue = "";
            if (typeof newValue === "string") {
              finalValue = newValue;
            } else if (newValue && newValue.inputValue) {
              finalValue = newValue.inputValue;
            } else if (newValue && newValue.value !== undefined) {
              finalValue = newValue.value;
            } else if (newValue) {
              // Fallback to label if structure is unexpected
              finalValue = newValue.label || "";
            }
            onChange({ target: { name, value: finalValue } });
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) =>
                (typeof option === "string" ? option : option.label) ===
                inputValue
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                label: translate(`Əlavə et: "${inputValue}"`, language),
              });
            }
            return filtered;
          }}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            if (option.inputValue) return option.inputValue;
            return option.label ?? "";
          }}
          renderOption={(props, option) => (
            <li {...props}>{option.label ?? option}</li>
          )}
          renderInput={(params) => (
            <TextField {...params} label={label} required={required} />
          )}
        />
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  // Default: text field
  return (
    <TextField
      type={type}
      name={name}
      label={label}
      value={value || ""}
      onChange={onChange}
      error={!!error}
      helperText={error ? helperText : undefined}
      required={required}
      fullWidth={fullWidth}
      placeholder={placeholder}
      multiline={multiline}
      minRows={minRows}
      maxRows={maxRows}
      disabled={disabled}
      {...props}
    />
  );
};

export default FormField;

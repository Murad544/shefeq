export function getOptionLabel(options, value) {
  const found = options.find((o) => o.value === value);
  return found ? found.label : value || "-";
}

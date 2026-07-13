import dayjs from "dayjs";
import "dayjs/locale/az";
import { educationLevelOptions } from "../constants/educationLevelOptions";
import { professionOptions } from "../constants/professionOptions";

dayjs.locale("az");

export function readField(obj, ...keys) {
  for (const k of keys) if (obj && obj[k] != null) return obj[k];
  return "";
}

export function formatDate(d, fmt = "DD.MM.YYYY") {
  return d ? dayjs(d).format(fmt) : "";
}

export const formatBytes = (bytes) => {
  if (bytes == null) return "";
  const b = Number(bytes);
  if (Number.isNaN(b)) return "";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(b) / Math.log(1024)),
    units.length - 1
  );
  const val = (b / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
  return `${val} ${units[i]}`;
};

export function getOptionLabel(options, value) {
  const found = options.find((o) => o.value === value);
  return found ? found.label : value || "-";
}

export function formatEducationLevel(value) {
  return getOptionLabel(educationLevelOptions, value);
}

export function formatProfession(value) {
  return getOptionLabel(professionOptions, value);
}

export function parseSkills(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.map(String)
        : value.split(",").map((s) => s.trim());
    } catch {
      return value.split(",").map((s) => s.trim());
    }
  }
  return [];
}

const PROJECT_NAME =
  process.env.REACT_APP_PROJECT_NAME || "FPV Tədris Alt Sistemi";
const ADMIN_NAME = process.env.REACT_APP_ADMIN_NAME || "İdarəetmə Paneli";
const COURSE_NAME =
  process.env.REACT_APP_COURSE_NAME || "PUA Mütəxəssisləri üzrə Seçim Sorğusu";

// The wordmark is the first word of the official name ("FPV"); the rest is
// the descriptor set beneath it ("Tədris Alt Sistemi").
const [PROJECT_MARK, ...descriptorWords] = PROJECT_NAME.trim().split(/\s+/);
const PROJECT_DESCRIPTOR = descriptorWords.join(" ");

export const BRAND = {
  PROJECT_NAME,
  PROJECT_MARK,
  PROJECT_DESCRIPTOR,
  ADMIN_NAME,
  COURSE_NAME,
  fullAdminTitle: () => `${PROJECT_NAME} — ${ADMIN_NAME}`,
};

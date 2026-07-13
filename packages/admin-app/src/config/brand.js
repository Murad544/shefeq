const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || "Şəfəq";
const ADMIN_NAME = process.env.REACT_APP_ADMIN_NAME || "Admin Panel";
const COURSE_NAME =
  process.env.REACT_APP_COURSE_NAME || "PUA Mütəxəssisləri üzrə Seçim Sorğusu";

export const BRAND = {
  PROJECT_NAME,
  ADMIN_NAME,
  COURSE_NAME,
  fullAdminTitle: () => `${PROJECT_NAME} — ${ADMIN_NAME}`,
};

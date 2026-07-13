export const APPLICANTS_COLUMNS = [
  { key: "name", label: "Ad", minWidth: 120 },
  { key: "surname", label: "Soyad", minWidth: 120 },
  { key: "father_name", label: "Ata adı", minWidth: 120 },
  { key: "date_of_birth", label: "Doğum tarixi", minWidth: 120 },
  { key: "sex", label: "Cins", minWidth: 80 },
  { key: "place_of_birth", label: "Doğum yeri", minWidth: 140 },
  { key: "national_serial_num", label: "Seriya №", minWidth: 120 },
  { key: "national_id_num", label: "FIN", minWidth: 120 },
  { key: "phone_number", label: "Telefon", minWidth: 120 },
  { key: "email", label: "E-poçt", minWidth: 180 },
  { key: "education_level", label: "Təhsil", minWidth: 140 },
  { key: "university", label: "Universitet", minWidth: 160 },
  { key: "profession", label: "Peşə", minWidth: 140 },
  { key: "skills", label: "Bacarıqlar", minWidth: 200 },
  { key: "secret_key", label: "Gizli açar", minWidth: 200 },
  { key: "total_duration_seconds", label: "Ümumi oynama vaxtı", minWidth: 200 },
  { key: "actions", label: "Ətraflı", minWidth: 100 },
];

export const ACCEPTED_APPLICANTS_COLUMNS = [
  { key: "status", label: "Status", minWidth: 140 },
  { key: "name", label: "Ad", minWidth: 120 },
  { key: "surname", label: "Soyad", minWidth: 120 },
  { key: "father_name", label: "Ata adı", minWidth: 120 },
  { key: "date_of_birth", label: "Doğum tarixi", minWidth: 120 },
  { key: "sex", label: "Cins", minWidth: 80 },
  { key: "place_of_birth", label: "Doğum yeri", minWidth: 140 },
  { key: "national_serial_num", label: "Seriya №", minWidth: 120 },
  { key: "national_id_num", label: "FIN", minWidth: 120 },
  { key: "phone_number", label: "Telefon", minWidth: 120 },
  { key: "email", label: "E-poçt", minWidth: 180 },
  { key: "education_level", label: "Təhsil", minWidth: 140 },
  { key: "university", label: "Universitet", minWidth: 160 },
  { key: "profession", label: "Peşə", minWidth: 140 },
  { key: "secret_key", label: "Gizli açar", minWidth: 200 },
  { key: "total_duration_seconds", label: "Ümumi oynama vaxtı", minWidth: 200 },
  { key: "accepted_at", label: "Qəbul tarixi", minWidth: 140 },
  { key: "actions", label: "Ətraflı", minWidth: 100 },
];

export const ADMINS_COLUMNS = [
  { key: "email", label: "E-poçt", minWidth: 200 },
  { key: "name", label: "Ad", minWidth: 150 },
  { key: "role", label: "Rol", minWidth: 100 },
  { key: "is_active", label: "Status", minWidth: 100 },
  { key: "last_login_at", label: "Son giriş", minWidth: 150 },
  { key: "created_at", label: "Yaradılma", minWidth: 150 },
  { key: "actions", label: "Əməliyyatlar", minWidth: 150 },
];

export const getTableColumns = (type) => {
  switch (type) {
    case "applicants":
      return APPLICANTS_COLUMNS;
    case "accepted":
      return ACCEPTED_APPLICANTS_COLUMNS;
    case "admins":
      return ADMINS_COLUMNS;
    default:
      return [];
  }
};

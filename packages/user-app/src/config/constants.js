export const STRINGS = {
  DEFAULT_PROJECT_NAME: "FPV Tədris Alt Sistemi",
  DEFAULT_COURSE_NAME: "PUA mütəxəssisləri üzrə seçim sorğusu",

  // Navigation & Steps
  STEPS: [
    "Məlumatlar",
    "Təhsil",
    "Bacarıqlar",
    "Suallar",
    "Fayllar",
    "Yekun baxış",
  ],

  // Buttons
  BACK: "Geri",
  NEXT: "İrəli",
  SUBMIT: "Göndər",
  HOME: "Ana səhifə",
  GET_STARTED: "Qeydiyyat",
  CLOSE: "Bağla",
  SIGN_IN: "Daxil ol",

  // Messages
  LOADING: "Məlumatlar yoxlanılır",
  SUCCESS_TITLE: "Müraciətiniz qəbul edildi!",
  ERROR_TITLE: "Xəta baş verdi",
  PLEASE_WAIT: "Zəhmət olmasa gözləyin...",

  // Validation Messages
  REQUIRED_FIELD: "Bu sahə tələb olunur",
  INVALID_SERIAL_NUMBER:
    "Şəxsiyyət vəsiqəsi nömrəsi AZE + 8 rəqəm və ya AA + 7 rəqəm formatında olmalıdır",
  INVALID_ID_NUMBER:
    "FİN kodu 7 simvol olmalıdır və yalnız 0-9 rəqəmləri və a-z hərfləri ola bilər",
  INVALID_EMAIL: "E-poçt ünvanı düzgün deyil",
  INVALID_PHONE: "Telefon nömrəsi düzgün deyil",
  MIN_SKILLS: "Ən azı bir bacarıq əlavə edin",

  // Features
  FEATURES: [
    // {
    //   title: "Fokuslanmış ərizə",
    //   description:
    //     "Bu proqram yalnız bu kurs üçün zəruri məlumatları toplayır — qısa, aydın və istiqamətli proses.",
    // },
    // {
    //   title: "Sənəd yükləmələri",
    //   description:
    //     "PDF və MP4 fayllarınızı təhlükəsiz yükləyin: CV, portfel, sertifikatlar və video-materiallar.",
    // },
    
  
    {title: "Realistik simulyasiya",
description:
"Peşəkar səviyyəli uçuş fizikasına əsaslanan simulyasiya ilə real uçuş şəraitini təhlükəsiz şəkildə təcrübə edin."
},

    {title: "Təlim imkanı",
  description:
    "Dron idarəetməsini öyrənmək və bacarıqlarınızı inkişaf etdirmək üçün nəzəri dərslər, videolar və praktiki simulyasiya, innovativ təlim metodları təqdim olunur."
},
// {
//       title: "Məlumat təhlükəsizliyi",
//       description:
//         "Məlumatlarınız qiymətləndirmə məqsədilə istifadə olunur və üçüncü tərəflərlə paylaşılmır.",
//     }
  ],

  COPYRIGHT: "Bütün hüquqlar qorunur.",
  ALREADY_HAVE_ACCOUNT: "Artıq hesabınız var?",
};

export const API_ENDPOINTS = {
  QUESTIONS: "/api/questions",
  REGISTER: "/api/applications/register",
};

export const FILE_CONSTRAINTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024,
  ALLOWED_VIDEO_TYPES: ["video/mp4"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf"],
};

export const VALIDATION_RULES = {
  NATIONAL_SERIAL_NUM_REGEX: /^(AZE\d{8}|AA\d{7})$/,
  NATIONAL_ID_NUM_REGEX: /^[0-9abcdefghxijkqlmnoprstuvyz]{7}$/i,
  PHONE_REGEX: /^\+?\d{10,16}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_SKILLS: 1,
  MIN_ANSWERS: 10,
};

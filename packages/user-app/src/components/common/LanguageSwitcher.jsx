import { Box, Button } from "@mui/material";
import { useLanguage, LANGUAGES } from "../../i18n/LanguageContext";
import { C, FONT } from "../../config/tokens";

const LanguageSwitcher = ({ sx }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Box
      role="group"
      aria-label="Language / Dil / Язык"
      sx={{ display: "inline-flex", border: `1px solid ${C.lineDarkStrong}`, bgcolor: C.night, ...sx }}
    >
      {LANGUAGES.map((code) => (
        <Button
          key={code}
          size="small"
          aria-label={{ az: "Azərbaycan dili", en: "English", ru: "Русский" }[code]}
          aria-pressed={language === code}
          onClick={() => setLanguage(code)}
          sx={{
            minWidth: 38,
            px: 0.75,
            borderRadius: 0,
            fontFamily: FONT.mono,
            fontSize: "0.7rem",
            color: language === code ? C.ink : C.textOnDarkMuted,
            bgcolor: language === code ? C.brass : "transparent",
            "&:hover": { bgcolor: language === code ? C.brassLight : C.field700 },
          }}
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </Box>
  );
};

export default LanguageSwitcher;

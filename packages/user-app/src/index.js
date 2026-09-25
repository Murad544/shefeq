import ReactDOM from "react-dom/client";
import { useMemo } from "react";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { azAZ, enUS, ruRU } from "@mui/material/locale";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./config/theme";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

const muiLocales = { az: azAZ, en: enUS, ru: ruRU };
const azAutocompleteFix = {
  components: { MuiAutocomplete: { defaultProps: { openText: "Aç" } } },
};

const LocalizedTheme = ({ children }) => {
  const { language } = useLanguage();
  const localizedTheme = useMemo(
    () => createTheme(theme, muiLocales[language], language === "az" ? azAutocompleteFix : {}),
    [language]
  );
  return <ThemeProvider theme={localizedTheme}>{children}</ThemeProvider>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <LanguageProvider>
    <LocalizedTheme>
      <CssBaseline />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </LocalizedTheme>
  </LanguageProvider>
);

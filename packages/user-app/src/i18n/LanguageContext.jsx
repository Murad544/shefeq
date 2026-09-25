import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { localizeTree } from "./localizeDom";
import { translate } from "./translations";

export const LANGUAGES = ["az", "en", "ru"];
const STORAGE_KEY = "sg_language";

const LanguageContext = createContext(null);
let currentLanguage = "az";
export const getCurrentLanguage = () => currentLanguage;

const initialLanguage = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(stored) ? stored : "az";
  } catch {
    return "az";
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(initialLanguage);
  currentLanguage = language;

  useEffect(() => {
    document.documentElement.lang = language;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.content = translate(
        "FPV Tədris Alt Sistemi — PUA mütəxəssislərinin seçimi, dron tədrisi və praktiki təlimlər",
        language
      );
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // The selected language still works when storage is unavailable.
    }
  }, [language]);

  useLayoutEffect(() => {
    const root = document.body;
    const title = document.querySelector("title");
    localizeTree(root, language);
    if (title) localizeTree(title, language);
    const observer = new MutationObserver(() => {
      localizeTree(root, language);
      if (title) localizeTree(title, language);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "alt", "placeholder", "title"] });
    if (title) observer.observe(title, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

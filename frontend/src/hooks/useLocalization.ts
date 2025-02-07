import { useState, useEffect, useCallback } from "react";
import { LANGUAGES } from "../languages";

export interface Language {
  id: string;
  name: string;
  flag: string;
  api: string;
  article: string;
  code?: string;
}

export function useLocalization() {
  const getInitialLanguage = useCallback(() => {
    const savedLanguageId = localStorage.getItem("lang");
    return (
      LANGUAGES.find((lang) => lang.id === savedLanguageId) || LANGUAGES[0]
    );
  }, []);

  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem("lang", currentLanguage.id);
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    window.location.reload();
  };

  return {
    currentLanguage,
    setLanguage,
  };
}

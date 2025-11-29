import React, { createContext, useContext } from 'react';
import { Language } from "../translations";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

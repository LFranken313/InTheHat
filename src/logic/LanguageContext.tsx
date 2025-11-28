import React, { createContext, useContext } from 'react';

type LanguageContextType = {
    language: string;
    setLanguage: (lang: string) => void;
};

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

import React, { createContext, useContext, useState } from 'react';
import i18n from 'i18n-js';
import { translations } from '../i18n/translations';

i18n.translations = translations;
i18n.fallbacks = true;
i18n.defaultLocale = 'es';

type LanguageContextType = {
  t: (key: string) => string;
  setLanguage: (lang: 'en' | 'es') => void;
  language: string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const changeLanguage = (lang: 'en' | 'es') => {
    i18n.locale = lang;
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        t: (key: string) => i18n.t(key), 
        setLanguage: changeLanguage,
        language 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
};
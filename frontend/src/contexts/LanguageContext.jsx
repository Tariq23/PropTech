// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );
  const [isRTL, setIsRTL] = useState(currentLanguage === 'ar');

  useEffect(() => {
    // Update i18n language
    i18n.changeLanguage(currentLanguage);
    
    // Update RTL
    const rtl = currentLanguage === 'ar';
    setIsRTL(rtl);
    
    // Update document direction
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Save to localStorage
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  const value = {
    currentLanguage,
    isRTL,
    changeLanguage,
    languages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
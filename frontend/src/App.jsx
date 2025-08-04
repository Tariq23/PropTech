// src/App.jsx
// Minimal working version to get your app running

import React, { Suspense, createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n
i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

// Create Language Context
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage, i18n]);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple Home Component
const Home = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('common.welcome', 'Welcome to PropTech Platform')}</h1>
      <p>Current Language: {currentLanguage}</p>
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => changeLanguage('en')}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('ar')}
          style={{ padding: '10px 20px' }}
        >
          العربية
        </button>
      </div>
      <nav style={{ marginTop: '20px' }}>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>
          {t('navigation.dashboard', 'Dashboard')}
        </Link>
        <Link to="/properties">
          {t('navigation.properties', 'Properties')}
        </Link>
      </nav>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('dashboard.title', 'Dashboard')}</h1>
      <p>{t('dashboard.overview', 'Overview')}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

// Simple Properties Component
const Properties = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>{t('properties.title', 'Properties')}</h1>
      <p>{t('properties.noResults', 'No properties found')}</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading translations...</div>}>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
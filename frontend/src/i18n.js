// src/i18n.js
// Fixed i18n configuration for PropTech Platform

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Do NOT initialize i18n multiple times
if (!i18n.isInitialized) {
  i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Supported languages
      supportedLngs: ['en', 'ar'],
      
      // Fallback language
      fallbackLng: 'en',
      
      // Disable debug mode to reduce console noise
      debug: false,
      
      // Do not load language-region specific files (en-GB, ar-SA, etc.)
      load: 'languageOnly',
      
      // Interpolation settings
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      
      // Backend settings for loading translation files
      backend: {
        loadPath: '/locales/{{lng}}/translation.json',
        // Add cache busting
        queryStringParams: { v: '1.0' },
      },
      
      // Detection settings
      detection: {
        // Order of detection
        order: ['localStorage', 'navigator'],
        // Cache user language selection
        caches: ['localStorage'],
        // Exclude cookie to avoid issues
        excludeCacheFor: ['cimode'],
        // Language detector options
        lookupLocalStorage: 'language',
      },
      
      // React specific settings
      react: {
        useSuspense: true,
      },
      
      // Default namespace
      defaultNS: 'translation',
      ns: ['translation'],
    });
}

export default i18n;
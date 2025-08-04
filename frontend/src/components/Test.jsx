// src/components/Test.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const Test = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>{t('common.welcome')}</h1>
      <p>Current Language: {currentLanguage}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
};

export default Test;
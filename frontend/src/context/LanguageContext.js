import React, { createContext, useState } from 'react';
import neLabels from '../languages/ne';
import enLabels from '../languages/en';
 export const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const labels = locale === 'ne' ? neLabels : enLabels;

  const handleLanguageToggle = (selectedLocale) => {
    setLocale(selectedLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, labels, handleLanguageToggle }}>
      {children}
    </LanguageContext.Provider>
  );
};

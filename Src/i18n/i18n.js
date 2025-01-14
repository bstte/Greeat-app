import 'intl-pluralrules';  // Import the polyfill
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './Language/en.json';
import it from './Language/it.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    it: {
      translation: it,
    },
  },
  lng: 'it', // default language
  fallbackLng: 'it',
  interpolation: {
    escapeValue: false, // react already safeguards from XSS
  },
});

export default i18n;

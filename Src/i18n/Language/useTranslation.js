// src/i18n/translate.js

import i18n from "../i18n";


export const translate = (key, options = {}) => {
  return i18n.t(key, options);
};

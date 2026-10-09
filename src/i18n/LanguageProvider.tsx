import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext, translate, type Language, type LanguageValue } from './language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('myapi-language') === 'en' ? 'en' : 'th'; } catch { return 'th'; }
  });
  const setLang = useCallback((lang: 'TH' | 'EN') => setLanguage(lang === 'EN' ? 'en' : 'th'), []);
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('myapi-language', language); } catch { /* Language still works when storage is blocked. */ }
  }, [language]);
  const value = useMemo<LanguageValue>(() => ({ language, setLanguage, lang: language === 'en' ? 'EN' : 'TH', setLang, t: text => translate(text, language) }), [language, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

import { createContext, useContext } from 'react';
import { messages } from './messages';
import { extraMessages } from './extraMessages';

export type Language = 'th' | 'en';
const english = { ...messages, ...extraMessages };
const thai = Object.fromEntries(Object.entries(english).map(([th, en]) => [en, th]));
export function translate(text: string, language: Language): string {
  const key = text.trim().replace(/\s+/g, ' ');
  return (language === 'en' ? english[key] : thai[key]) ?? text;
}
export type LanguageValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  lang: 'TH' | 'EN';
  setLang: (language: 'TH' | 'EN') => void;
  t: (text: string) => string;
};
export const LanguageContext = createContext<LanguageValue | null>(null);
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageProvider is required');
  return context;
}

import { createContext, useContext } from 'react';
export type Language = 'th' | 'en';
type LandingLanguage = { language: Language; setLanguage: (language: Language) => void; t: (text: string) => string };
export const LanguageContext = createContext<LandingLanguage | null>(null);
export function useLandingLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LandingLanguageProvider is required');
  return context;
}

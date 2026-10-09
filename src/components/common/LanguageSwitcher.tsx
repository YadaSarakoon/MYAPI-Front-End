import type { FC } from 'react';
import { useLanguage } from '../../i18n/language';

export type Language = 'TH' | 'EN';

interface LanguageSwitcherProps {
    lang?: Language;
    onChange?: (lang: Language) => void;
}

const languages: Language[] = ['TH', 'EN'];

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
    lang,
    onChange,
}) => {
    const global = useLanguage();
    const selected = lang ?? global.lang;
    const change = onChange ?? global.setLang;
    return (
        <div className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-0.5">
            {languages.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => change(code)}
                    aria-label={code === 'TH' ? 'ภาษาไทย' : 'English'}
                    aria-pressed={selected === code}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                        selected === code
                            ? 'bg-white text-indigo-700 shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    {code}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;

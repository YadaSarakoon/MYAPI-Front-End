import type { FC } from 'react';

export type Language = 'TH' | 'EN';

interface LanguageSwitcherProps {
    lang: Language;
    onChange: (lang: Language) => void;
}

const languages: Language[] = ['TH', 'EN'];

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
    lang,
    onChange,
}) => {
    return (
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
            {languages.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => onChange(code)}
                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                        lang === code
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
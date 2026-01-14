
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'en' | 'kn';

interface LanguageContextType {
    lang: Lang;
    toggleLang: () => void;
    t: (en: string, kn: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: 'en',
    toggleLang: () => { },
    t: (en, _kn) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Lang>('en');

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'kn' : 'en');
    };

    const t = (en: string, kn: string) => {
        return lang === 'en' ? en : kn;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);

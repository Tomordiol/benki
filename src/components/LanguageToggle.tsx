
'use client';
import { useLanguage } from '@/lib/LanguageContext';

export default function LanguageToggle() {
    const { lang, toggleLang } = useLanguage();

    return (
        <button
            onClick={toggleLang}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '10px 20px',
                borderRadius: '30px',
                background: '#cc0000',
                color: 'white',
                fontWeight: 'bold',
                border: '2px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 9999,
                cursor: 'pointer',
                fontSize: '1rem'
            }}
        >
            {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
        </button>
    );
}


'use client';

import styles from './Footer.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import { dictionary } from '@/lib/dictionary';
import Image from 'next/image';
// We need to fetch settings differently if this is a client component, 
// or pass them in as props. For now, since we made this 'use client' for translation,
// we'll accept settings as a prop or fetch them via a Server Action wrapper if needed.
// Simplest move: Keep it Server Component and wrap the *content* in a Client Component?
// OR: Just make it a Client Component and hardcode/fetch settings via API.
// Let's go with Client Component for translation and hardcode 0 followers for now to avoid complexity, 
// or I should've passed settings as props. I'll make it accepting props.

import { Facebook, Instagram, MapPin, Phone, Mail } from 'lucide-react';

interface FooterProps {
    facebookFollowers: string;
    instagramFollowers: string;
}

export default function Footer({ facebookFollowers, instagramFollowers }: FooterProps) {
    const { lang } = useLanguage();
    const t = dictionary[lang];

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.content}`}>
                <div className={styles.column}>
                    <div className={styles.footerLogo}>
                        <Image
                            src="/logo.jpg"
                            alt={t.siteTitle}
                            width={150}
                            height={50}
                            className={styles.footerLogoImage}
                        />
                    </div>
                    <p>{lang === 'en' ? 'The fire of truth.' : 'ಸತ್ಯದ ಬೆಂಕಿ.'}</p>
                </div>

                <div className={styles.column}>
                    <h4>{t.contactUs}</h4>
                    <div className={styles.contactInfo}>
                        <div className={styles.contactItem}>
                            <Phone size={18} className={styles.icon} />
                            <span>{t.phone}</span>
                        </div>
                        <div className={styles.contactItem}>
                            <Mail size={18} className={styles.icon} />
                            <span>{t.email}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.column}>
                    <h4>{t.followUs}</h4>
                    <div className={styles.socialStats}>
                        <a href="https://www.facebook.com/p/Benki-tv-tnarasipura-%E0%B2%AC%E0%B3%86%E0%B2%82%E0%B2%95%E0%B2%BF-%E0%B2%9F%E0%B2%BF%E0%B2%B5%E0%B2%BF-%E0%B2%9F%E0%B2%BF%E0%B2%A8%E0%B2%B0%E0%B2%B8%E0%B3%80%E0%B2%AA%E0%B3%81%E0%B2%B0-100063639407615/" target="_blank" rel="noopener noreferrer" className={styles.stat} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Facebook size={24} />
                        </a>
                        <a href="https://www.instagram.com/benkitv.tnarsipura/?hl=en" target="_blank" rel="noopener noreferrer" className={styles.stat} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} {t.siteTitle}. {t.rights}
            </div>
        </footer>
    );
}

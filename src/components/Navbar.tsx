'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Search, Lock, X } from 'lucide-react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import { dictionary } from '@/lib/dictionary';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    adBannerUrl?: string;
}

export default function Navbar({ adBannerUrl }: NavbarProps) {
    const { lang } = useLanguage();
    const t = dictionary[lang];

    // keys must match dictionary keys for categories roughly, or map them manually
    // For simplicity, we stick to English keys for URL, but translate Display text
    const categories = ['Politics', 'Cinema', 'Sports', 'Crime', 'Technology'];

    return (
        <header>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={`container ${styles.topBarContent}`}>
                    <div className={styles.date}>
                        {new Date().toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className={styles.socials}>
                        {/* Socials removed as requested */}
                        <Link href="/admin/login" className={styles.socialIcon} title={t.adminLogin}>
                            <Lock size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className={`container ${styles.mainHeader}`}>
                <Link href="/" className={styles.logo}>
                    BENKI<span className={styles.tv}>TV</span> <span className={styles.location}>T.Narasipura</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={`container ${styles.navContent}`}>
                    <ul className={styles.navList}>
                        <li><Link href="/">{t.home}</Link></li>
                        {categories.map(cat => (
                            <li key={cat}>
                                <Link href={`/category/${cat.toLowerCase()}`}>
                                    {/* @ts-ignore - dynamic key access */}
                                    {dictionary[lang][cat.toLowerCase()] || cat}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.searchContainer}>
                        <form action="/search" method="GET" className={styles.searchForm}>
                            <input
                                type="text"
                                name="q"
                                placeholder={t.search + "..."}
                                className={styles.searchInput}
                                required
                            />
                            <button type="submit" className={styles.searchButton}>
                                <Search size={20} color="white" />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
        </header >
    );
}

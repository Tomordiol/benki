'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './page.module.css';
import { Facebook, Twitter, Share2, Check, Copy } from 'lucide-react';

import NewsCard from '@/components/NewsCard';

export default function ArticleContent({ article, recommended }: { article: any, recommended: any[] }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (typeof navigator !== 'undefined') {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: t(article.title_en, article.title_kn),
                        text: 'Check out this article on BenkiTv',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        }
    };

    return (
        <>
            <div className={styles.articleContainer}>
                <header className={styles.header}>
                    <span className={styles.category}>{article.category}</span>
                    <h1 className={styles.title}>{t(article.title_en, article.title_kn)}</h1>
                    <div className={styles.meta}>
                        <span>Published: {new Date(article.published_at).toLocaleString()}</span>
                        <button onClick={handleShare} className={styles.share} title="Share Article">
                            {copied ? <Check size={16} /> : <Share2 size={16} />}
                            {copied ? 'Copied!' : 'Share'}
                        </button>
                    </div>
                </header>

                {article.media_url && (
                    <div className={styles.mediaWrapper}>
                        <img src={article.media_url} alt="Article Media" className={styles.image} />
                    </div>
                )}

                <div className={styles.body}>
                    {/* Simple whitespace handling. For rich text, we'd need a parser. */}
                    {t(article.content_en, article.content_kn).split('\n').map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            </div>

            {recommended.length > 0 && (
                <div className={styles.recommendedSection}>
                    <h3 className={styles.recommendedTitle}>Recommended For You</h3>
                    <div className={styles.recommendedGrid}>
                        {recommended.map(rec => (
                            <NewsCard key={rec.id} article={rec} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

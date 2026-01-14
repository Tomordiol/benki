
'use client';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './NewsCard.module.css';

export default function NewsCard({ article, featured = false }: { article: any, featured?: boolean }) {
    const { t } = useLanguage();

    return (
        <div className={`${styles.card} ${featured ? styles.featured : ''}`}>
            <Link href={`/article/${article.id}`}>
                <div className={styles.imageWrapper}>
                    {article.media_url ? (
                        <img src={article.media_url} alt={article.title_en} className={styles.image} />
                    ) : (
                        <div className={styles.placeholderBg}>BENKI TV T.Narasipura</div>
                    )}
                    <span className={styles.category}>{article.category}</span>

                    {/* "New" Badge if article is less than 24 hours old */}
                    {new Date().getTime() - new Date(article.published_at).getTime() < 86400000 && (
                        <span className={styles.newBadge}>NEW</span>
                    )}
                </div>
                <div className={styles.content}>
                    <h2 className={styles.title}>
                        {t(article.title_en, article.title_kn)}
                    </h2>
                    <p className={styles.snippet}>
                        {/* Simple truncation */}
                        {t(article.content_en, article.content_kn).substring(0, featured ? 150 : 80)}...
                    </p>
                    <div className={styles.meta}>
                        {new Date(article.published_at).toLocaleDateString()}
                    </div>
                </div>
            </Link>
        </div>
    );
}


import { searchArticles } from '@/lib/article-actions';
import NewsCard from '@/components/NewsCard';
import styles from '../page.module.css';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q: query } = await searchParams;

    if (!query) {
        return (
            <main className="container">
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <h2>Please enter a search term</h2>
                </div>
            </main>
        );
    }

    const articles: any[] = await searchArticles(query);

    return (
        <main className="container">
            <div className={styles.sectionHeader}>
                <h1>Search Results for: "{query}"</h1>
            </div>

            {articles.length > 0 ? (
                <div className={styles.grid}>
                    {articles.map(article => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <h2>No results found</h2>
                    <p>Try searching for something else.</p>
                </div>
            )}
        </main>
    );
}

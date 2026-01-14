
import { getArticles } from '@/lib/article-actions';
import NewsCard from '@/components/NewsCard';
import styles from '../../page.module.css'; // Reuse home styles

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
    const { cat } = await params;
    const allArticles = await getArticles() as any[];

    // Filter by category (case incentive matching roughly)
    const categoryArticles = allArticles.filter(
        a => a.category.toLowerCase() === cat.toLowerCase()
    );

    const categoryTitle = cat.charAt(0).toUpperCase() + cat.slice(1);

    return (
        <main className="container">
            <div className={styles.sectionHeader}>
                <h1>{categoryTitle} News</h1>
            </div>

            {categoryArticles.length > 0 ? (
                <div className={styles.grid}>
                    {categoryArticles.map(article => (
                        <NewsCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <h2>No news in {categoryTitle} yet.</h2>
                </div>
            )}
        </main>
    );
}

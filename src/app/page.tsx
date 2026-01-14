
import { getArticles } from '@/lib/article-actions';
import NewsCard from '@/components/NewsCard';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const articles: any[] = await getArticles();

  // Logic: First article is "Featured", others are grid
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="container">
      <div className={styles.sectionHeader}>
        <h1>Top Stories</h1>
      </div>

      {articles.length > 0 ? (
        <div className={styles.grid}>
          {featured && <NewsCard article={featured} featured={true} />}
          {rest.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <h2>No News Yet</h2>
          <p>Admin needs to publish some articles.</p>
        </div>
      )}
    </main>
  );
}

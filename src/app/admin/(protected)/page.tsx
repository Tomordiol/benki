
import { getArticles, deleteArticle } from '@/lib/article-actions';
import Link from 'next/link';

export default async function AdminDashboard() {
    const articles = await getArticles() as any[];

    return (
        <div>
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <Link href="/admin/create" className="create-btn">
                    + New Article
                </Link>
            </div>

            <table className="articles-table">
                <thead>
                    <tr>
                        <th>Title (EN)</th>
                        <th>Title (KN)</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article) => (
                        <tr key={article.id}>
                            <td>{article.title_en} {article.is_breaking ? '🔥' : ''}</td>
                            <td>{article.title_kn}</td>
                            <td>{article.category}</td>
                            <td>{new Date(article.published_at).toLocaleDateString()}</td>
                            <td>
                                <form action={deleteArticle.bind(null, article.id)} style={{ display: 'inline' }}>
                                    <button type="submit" className="action-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ textAlign: 'center' }}>No articles found. Create one!</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


import { getArticle, getRecommendedArticles } from '@/lib/article-actions';
import { notFound } from 'next/navigation';
import ArticleContent from './ArticleContent';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id) as any;

    if (!article) {
        notFound();
    }

    const recommended = await getRecommendedArticles(id, article.category);

    return (
        <article className="container">
            {/* Client component to handle language toggle for title/content */}
            <ArticleContent article={article} recommended={recommended} />
        </article>
    );
}

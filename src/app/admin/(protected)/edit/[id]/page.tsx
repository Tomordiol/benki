
import { getArticle, updateArticle } from '@/lib/article-actions';
import { Upload, Type, Globe, FileText, Zap, ArrowLeft } from 'lucide-react';
import styles from '../../create/create.module.css'; // Reuse create styles
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const article: any = await getArticle(id);

    if (!article) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin" className={styles.backBtn}>
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className={styles.title}>Edit Article</h1>
                        <p className={styles.subtitle}>Update your story</p>
                    </div>
                </div>
            </header>

            <form action={updateArticle} className={styles.form}>
                <input type="hidden" name="id" value={article.id} />
                <input type="hidden" name="existing_media_url" value={article.media_url || ''} />

                {/* Main Content Area */}
                <div className={styles.mainContent}>

                    {/* Title Section */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Globe size={20} className={styles.icon} />
                            <h3>Headlines</h3>
                        </div>
                        <div className={styles.grid2}>
                            <div className={styles.field}>
                                <label>English Title</label>
                                <input
                                    type="text"
                                    name="title_en"
                                    defaultValue={article.title_en}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Kannada Title (ಕನ್ನಡ)</label>
                                <input
                                    type="text"
                                    name="title_kn"
                                    defaultValue={article.title_kn}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <FileText size={20} className={styles.icon} />
                            <h3>Story Content</h3>
                        </div>
                        <div className={styles.grid2}>
                            <div className={styles.field}>
                                <label>English Content</label>
                                <textarea
                                    name="content_en"
                                    defaultValue={article.content_en}
                                    required
                                    rows={10}
                                ></textarea>
                            </div>
                            <div className={styles.field}>
                                <label>Kannada Content (ಕನ್ನಡ)</label>
                                <textarea
                                    name="content_kn"
                                    defaultValue={article.content_kn}
                                    required
                                    rows={10}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar/Meta Area */}
                <div className={styles.sidebar}>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>Publishing Details</h3>
                        </div>

                        <div className={styles.field}>
                            <label>Category</label>
                            <div className={styles.selectWrapper}>
                                <select name="category" defaultValue={article.category} required>
                                    <option value="">Select Category</option>
                                    <option value="Politics">Politics / ರಾಜಕೀಯ</option>
                                    <option value="Cinema">Cinema / ಸಿನೆಮಾ</option>
                                    <option value="Sports">Sports / ಕ್ರೀಡೆ</option>
                                    <option value="Crime">Crime / ಅಪರಾಧ</option>
                                    <option value="Technology">Technology / ತಂತ್ರಜ್ಞಾನ</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.checkboxField}>
                            <input
                                type="checkbox"
                                id="break"
                                name="is_breaking"
                                defaultChecked={article.is_breaking === 1}
                            />
                            <label htmlFor="break">
                                <Zap size={16} fill="#cc0000" color="#cc0000" />
                                Breaking News
                            </label>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Upload size={20} className={styles.icon} />
                            <h3>Media</h3>
                        </div>
                        {article.media_url && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>Current Media:</label>
                                <img
                                    src={article.media_url}
                                    alt="Current"
                                    style={{ width: '100%', borderRadius: '4px', height: '100px', objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <div className={styles.uploadBox}>
                            <input type="file" name="media" id="media-upload" accept="image/*,video/*" className={styles.fileInput} />
                            <label htmlFor="media-upload" className={styles.fileLabel}>
                                <span>Change Image/Video (Optional)</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.publishBtn}>
                        Update Article
                    </button>
                </div>

            </form>
        </div>
    );
}

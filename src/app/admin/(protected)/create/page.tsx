
import { createArticle } from '@/lib/article-actions';
import { Upload, Type, Globe, FileText, Zap } from 'lucide-react';
import styles from './create.module.css';

// We'll create a local CSS module for specific form styles to keep it clean

export default function CreateArticlePage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Publish Article</h1>
                    <p className={styles.subtitle}>Create a new story for BenkiTv</p>
                </div>
            </header>

            <form action={createArticle} className={styles.form}>

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
                                <input type="text" name="title_en" placeholder="Enter headline in English" required />
                            </div>
                            <div className={styles.field}>
                                <label>Kannada Title (ಕನ್ನಡ)</label>
                                <input type="text" name="title_kn" placeholder="ಶೀರ್ಷಿಕೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ" required />
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
                                <textarea name="content_en" placeholder="Write the full story..." required rows={10}></textarea>
                            </div>
                            <div className={styles.field}>
                                <label>Kannada Content (ಕನ್ನಡ)</label>
                                <textarea name="content_kn" placeholder="ಸಂಪೂರ್ಣ ಸುದ್ದಿಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..." required rows={10}></textarea>
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
                                <select name="category" required>
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
                            <input type="checkbox" id="break" name="is_breaking" />
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
                        <div className={styles.uploadBox}>
                            <input type="file" name="media" id="media-upload" accept="image/*,video/*" className={styles.fileInput} />
                            <label htmlFor="media-upload" className={styles.fileLabel}>
                                <span>Click to Upload Image/Video</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className={styles.publishBtn}>
                        Publish Article
                    </button>
                </div>

            </form>
        </div>
    );
}

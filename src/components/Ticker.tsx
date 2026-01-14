
import styles from './Ticker.module.css';

export default function Ticker({ news }: { news: string[] }) {
    if (news.length === 0) return null;

    return (
        <div className={styles.tickerContainer}>
            <div className={styles.label}>BREAKING NEWS</div>
            <div className={styles.scroller}>
                <div className={styles.track}>
                    {news.map((item, i) => (
                        <span key={i} className={styles.item}>{item} • </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {news.map((item, i) => (
                        <span key={`dup-${i}`} className={styles.item}>{item} • </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

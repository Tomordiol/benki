
import { login } from '@/lib/auth';
import styles from './login.module.css';
import Link from 'next/link';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
    const { error, message } = await searchParams;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Benki TV Admin</h1>

                {error && (
                    <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{ background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        {message}
                    </div>
                )}

                <form action={login} className={styles.form}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Login</button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/admin/forgot-password" style={{ color: '#cc0000', fontSize: '0.9rem' }}>
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
}

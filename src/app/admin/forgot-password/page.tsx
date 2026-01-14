
import { requestPasswordReset } from '@/lib/auth';
import styles from '../login/login.module.css';
import Link from 'next/link';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
    const { error, message } = await searchParams;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Forgot Password</h1>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Enter your email address and we'll send you a reset link.
                </p>

                {error && (
                    <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{ background: '#efe', color: '#060', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        {message}
                    </div>
                )}

                <form action={requestPasswordReset} className={styles.form}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Send Reset Link</button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link href="/admin/login" style={{ color: '#cc0000' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

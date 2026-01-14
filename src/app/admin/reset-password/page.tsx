
import { resetPassword } from '@/lib/auth';
import styles from '../login/login.module.css';
import Link from 'next/link';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
    const { token, error } = await searchParams;

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1>Invalid Link</h1>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                        This password reset link is invalid or has expired.
                    </p>
                    <Link href="/admin/login" style={{ color: '#cc0000' }}>
                        ← Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Reset Password</h1>
                <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Enter your new password below.
                </p>

                {error && (
                    <div style={{ background: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <form action={resetPassword} className={styles.form}>
                    <input type="hidden" name="token" value={token} />
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password (min 8 characters)"
                        required
                        minLength={8}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm New Password"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Reset Password</button>
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

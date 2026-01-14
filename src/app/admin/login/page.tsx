
import { login } from '@/lib/auth';
import styles from './login.module.css';

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>BenkiTv Admin</h1>
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
            </div>
        </div>
    );
}

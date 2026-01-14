
import { createClient } from '@libsql/client';
import path from 'path';

const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), 'benki.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
  url: url,
  authToken: authToken,
});

// Initialize Database Schema
async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_kn TEXT NOT NULL,
      content_en TEXT NOT NULL,
      content_kn TEXT NOT NULL,
      category TEXT NOT NULL,
      media_url TEXT,
      views INTEGER DEFAULT 0,
      is_breaking BOOLEAN DEFAULT 0,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT,
      username TEXT,
      success INTEGER DEFAULT 0,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial settings if empty
  const result = await db.execute('SELECT count(*) as count FROM settings');
  const count = Number(result.rows[0]?.count || 0);

  if (count === 0) {
    await db.execute({
      sql: 'INSERT INTO settings (key, value) VALUES (?, ?)',
      args: ['facebook_followers', '0']
    });
    await db.execute({
      sql: 'INSERT INTO settings (key, value) VALUES (?, ?)',
      args: ['instagram_followers', '0']
    });
  }

  // Create default admin if not exists
  const adminCheck = await db.execute('SELECT count(*) as count FROM admin_users');
  const adminCount = Number(adminCheck.rows[0]?.count || 0);

  if (adminCount === 0) {
    const bcrypt = require('bcryptjs');
    const defaultPasswordHash = bcrypt.hashSync('Benki@9977', 10);
    await db.execute({
      sql: 'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)',
      args: ['benkimanju', defaultPasswordHash, 'benkitvtnarsipura@gmail.com']
    });
  }
}

// Export a promise that resolves when the DB is ready
export const dbReady = initDb();

export default db;

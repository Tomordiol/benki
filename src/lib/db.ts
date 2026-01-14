
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'benki.db');
const db = new Database(dbPath);

// Initialize Database Schema
export function initDb() {
  db.exec(`
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

  // Add followers table for admin settings if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Admin users table with hashed password
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
  `);

  // Password reset tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Login attempts for rate limiting
  db.exec(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT,
      username TEXT,
      success INTEGER DEFAULT 0,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial settings if empty
  const stmt = db.prepare('SELECT count(*) as count FROM settings');
  const result = stmt.get() as { count: number };

  if (result.count === 0) {
    const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insert.run('facebook_followers', '0');
    insert.run('instagram_followers', '0');
  }

  // Create default admin if not exists
  const adminCheck = db.prepare('SELECT count(*) as count FROM admin_users').get() as { count: number };
  if (adminCheck.count === 0) {
    // Using bcryptjs to hash the default password
    const bcrypt = require('bcryptjs');
    const defaultPasswordHash = bcrypt.hashSync('Benki@9977', 10);
    const insertAdmin = db.prepare('INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)');
    insertAdmin.run('benkimanju', defaultPasswordHash, 'benkitvtnarsipura@gmail.com');
  }
}

// Auto-initialize on import
initDb();

export default db;

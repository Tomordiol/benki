
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

    // Seed initial settings if empty
    const stmt = db.prepare('SELECT count(*) as count FROM settings');
    const result = stmt.get() as { count: number };

    if (result.count === 0) {
        const insert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
        insert.run('facebook_followers', '0');
        insert.run('instagram_followers', '0');
    }
}

// Auto-initialize on import
initDb();

export default db;

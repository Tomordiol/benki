'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function getArticles() {
    const stmt = db.prepare('SELECT * FROM articles ORDER BY published_at DESC');
    return stmt.all();
}

export async function getArticle(id: string) {
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    return stmt.get(id);
}

export async function deleteArticle(id: string) {
    const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
    stmt.run(id);
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function getRecommendedArticles(currentId: string, category: string) {
    // Try to find articles in same category
    let stmt = db.prepare('SELECT * FROM articles WHERE category = ? AND id != ? ORDER BY published_at DESC LIMIT 3');
    let articles = stmt.all(category, currentId);

    // If not enough, fill with other recent articles
    if (articles.length < 3) {
        const limit = 3 - articles.length;
        // Need to exclude currentId and already found articles
        // For simplicity, just get recent articles excluding currentId that are NOT in the 'articles' list
        const excludedIds = [currentId, ...articles.map((a: any) => a.id)].map(id => `'${id}'`).join(',');

        // safe interpolation for IDs? uuid is safe.
        // better-sqlite3 doesn't support array binding easily for IN clause usually unless standard hack.
        // Let's just run a simple query: SELECT * FROM articles WHERE id != ? ORDER BY published_at DESC LIMIT ?
        // And filter in JS if overlap (though unlikely if we query correctly).
        // Actually, simpler: Just query recent articles, filter out current one, take top 3.
        // That's easier than complex SQL for a small app.

        stmt = db.prepare('SELECT * FROM articles WHERE id != ? ORDER BY published_at DESC LIMIT 10'); // Fetch a few more to filter
        const recent = stmt.all(currentId) as any[];

        // Add ones that are not already in 'articles'
        for (const r of recent) {
            if (articles.length >= 3) break;
            if (!articles.find((a: any) => a.id === r.id)) {
                articles.push(r);
            }
        }
    }

    return articles.slice(0, 3);
}

export async function createArticle(formData: FormData) {
    const id = uuidv4();
    const title_en = formData.get('title_en') as string;
    const title_kn = formData.get('title_kn') as string;
    const content_en = formData.get('content_en') as string;
    const content_kn = formData.get('content_kn') as string;
    const category = formData.get('category') as string;
    const is_breaking = formData.get('is_breaking') === 'on' ? 1 : 0;

    let media_url = '';

    const file = formData.get('media') as File;
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (process.env.VERCEL === '1') {
            console.warn('File upload skipped: local filesystem is read-only on Vercel.');
            // On Vercel, we can't save to the local filesystem permanently.
            // For now, we'll just skip the upload to prevent crashing.
        } else {
            // Ensure dir exists
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            media_url = `/uploads/${filename}`;
        }
    }

    const stmt = db.prepare(`
    INSERT INTO articles (id, title_en, title_kn, content_en, content_kn, category, media_url, is_breaking)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

    stmt.run(id, title_en, title_kn, content_en, content_kn, category, media_url, is_breaking);

    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}

export async function updateSettings(formData: FormData) {
    const fb = formData.get('facebook_followers');
    const insta = formData.get('instagram_followers');

    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run('facebook_followers', fb);
    stmt.run('instagram_followers', insta);

    // Handle Ad Banner
    const file = formData.get('ad_banner') as File;
    if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `ad-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (process.env.VERCEL === '1') {
            console.warn('Ad banner upload skipped: local filesystem is read-only on Vercel.');
        } else {
            // Ensure dir exists
            const fs = require('fs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await writeFile(path.join(uploadDir, filename), buffer);
            const adUrl = `/uploads/${filename}`;
            stmt.run('ad_banner_url', adUrl);
        }
    }
    // Note: We don't overwrite ad_banner_url if no file is selected, to preserve existing one.

    revalidatePath('/');
}

export async function getSettings() {
    const stmt = db.prepare('SELECT key, value FROM settings');
    const rows = stmt.all() as { key: string, value: string }[];

    const settings: Record<string, string> = {};
    rows.forEach(row => settings[row.key] = row.value);
    return settings;
}

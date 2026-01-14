'use server'

import db, { dbReady } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export async function getArticles() {
    await dbReady;
    const result = await db.execute('SELECT * FROM articles ORDER BY published_at DESC');
    return result.rows;
}

export async function searchArticles(query: string) {
    await dbReady;
    const searchTerm = `%${query}%`;
    const result = await db.execute({
        sql: `
            SELECT * FROM articles 
            WHERE title_en LIKE ? 
            OR title_kn LIKE ? 
            OR content_en LIKE ? 
            OR content_kn LIKE ? 
            ORDER BY published_at DESC
        `,
        args: [searchTerm, searchTerm, searchTerm, searchTerm]
    });
    return result.rows;
}

export async function getArticle(id: string) {
    await dbReady;
    const result = await db.execute({
        sql: 'SELECT * FROM articles WHERE id = ?',
        args: [id]
    });
    return result.rows[0];
}

export async function deleteArticle(id: string) {
    await dbReady;
    await db.execute({
        sql: 'DELETE FROM articles WHERE id = ?',
        args: [id]
    });
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function getRecommendedArticles(currentId: string, category: string) {
    await dbReady;
    // Try to find articles in same category
    const categoryResult = await db.execute({
        sql: 'SELECT * FROM articles WHERE category = ? AND id != ? ORDER BY published_at DESC LIMIT 3',
        args: [category, currentId]
    });
    let articles = [...categoryResult.rows];

    // If not enough, fill with other recent articles
    if (articles.length < 3) {
        const recentResult = await db.execute({
            sql: 'SELECT * FROM articles WHERE id != ? ORDER BY published_at DESC LIMIT 10',
            args: [currentId]
        });
        const recent = recentResult.rows;

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
    await dbReady;
    const id = uuidv4();
    const title_en = String(formData.get('title_en') || '');
    const title_kn = String(formData.get('title_kn') || '');
    const content_en = String(formData.get('content_en') || '');
    const content_kn = String(formData.get('content_kn') || '');
    const category = String(formData.get('category') || '');
    const is_breaking = formData.get('is_breaking') === 'on' ? 1 : 0;

    let media_url = '';

    const file = formData.get('media') as File;
    if (file && file.size > 0) {
        const blob = await put(file.name, file, { access: 'public' });
        media_url = blob.url;
    }

    await db.execute({
        sql: `
            INSERT INTO articles (id, title_en, title_kn, content_en, content_kn, category, media_url, is_breaking)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [id, title_en, title_kn, content_en, content_kn, category, media_url, is_breaking]
    });

    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}

export async function updateArticle(formData: FormData) {
    await dbReady;
    const id = String(formData.get('id') || '');
    const title_en = String(formData.get('title_en') || '');
    const title_kn = String(formData.get('title_kn') || '');
    const content_en = String(formData.get('content_en') || '');
    const content_kn = String(formData.get('content_kn') || '');
    const category = String(formData.get('category') || '');
    const is_breaking = formData.get('is_breaking') === 'on' ? 1 : 0;

    let media_url = String(formData.get('existing_media_url') || '');

    const file = formData.get('media') as File;
    if (file && file.size > 0) {
        const blob = await put(file.name, file, { access: 'public' });
        media_url = blob.url;
    }

    await db.execute({
        sql: `
            UPDATE articles 
            SET title_en = ?, title_kn = ?, content_en = ?, content_kn = ?, category = ?, media_url = ?, is_breaking = ?
            WHERE id = ?
        `,
        args: [title_en, title_kn, content_en, content_kn, category, media_url, is_breaking, id]
    });

    revalidatePath('/admin');
    revalidatePath('/');
    redirect('/admin');
}

export async function updateSettings(formData: FormData) {
    await dbReady;
    const fb = String(formData.get('facebook_followers') || '0');
    const insta = String(formData.get('instagram_followers') || '0');

    await db.execute({
        sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        args: ['facebook_followers', fb]
    });
    await db.execute({
        sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        args: ['instagram_followers', insta]
    });

    // Handle Ad Banner
    const file = formData.get('ad_banner') as File;
    if (file && file.size > 0) {
        const blob = await put(file.name, file, { access: 'public' });
        await db.execute({
            sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            args: ['ad_banner_url', blob.url]
        });
    }

    revalidatePath('/');
}

export async function getSettings() {
    await dbReady;
    const result = await db.execute('SELECT key, value FROM settings');
    const rows = result.rows as unknown as { key: string, value: string }[];

    const settings: Record<string, string> = {};
    rows.forEach(row => settings[row.key] = row.value);
    return settings;
}

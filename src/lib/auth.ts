
'use server'

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Rate limiting: max 5 attempts per 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

async function getClientIP() {
    const headersList = await headers();
    return headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
}

async function checkRateLimit(username: string): Promise<{ allowed: boolean; remainingAttempts: number }> {
    const ip = await getClientIP();
    const cutoff = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000).toISOString();

    const stmt = db.prepare(`
        SELECT COUNT(*) as attempts FROM login_attempts 
        WHERE (username = ? OR ip_address = ?) 
        AND success = 0 
        AND attempted_at > ?
    `);
    const result = stmt.get(username, ip, cutoff) as { attempts: number };

    return {
        allowed: result.attempts < MAX_ATTEMPTS,
        remainingAttempts: Math.max(0, MAX_ATTEMPTS - result.attempts)
    };
}

async function recordLoginAttempt(username: string, success: boolean) {
    const ip = await getClientIP();
    const stmt = db.prepare('INSERT INTO login_attempts (ip_address, username, success) VALUES (?, ?, ?)');
    stmt.run(ip, username, success ? 1 : 0);
}

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Check rate limit
    const rateLimit = await checkRateLimit(username);
    if (!rateLimit.allowed) {
        redirect(`/admin/login?error=Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);
    }

    // Get user from database
    const stmt = db.prepare('SELECT * FROM admin_users WHERE username = ?');
    const user = stmt.get(username) as { id: number; username: string; password_hash: string } | undefined;

    if (!user) {
        await recordLoginAttempt(username, false);
        redirect('/admin/login?error=Invalid credentials');
    }

    // Compare password
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
        await recordLoginAttempt(username, false);
        redirect(`/admin/login?error=Invalid credentials. ${rateLimit.remainingAttempts - 1} attempts remaining.`);
    }

    // Successful login
    await recordLoginAttempt(username, true);

    // Update last login
    db.prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Set session cookie with expiration (24 hours)
    const cookieStore = await cookies();
    cookieStore.set('admin_session', user.id.toString(), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'strict'
    });

    redirect('/admin');
}

export async function logout() {
    (await cookies()).delete('admin_session');
    redirect('/admin/login');
}

export async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) return false;

    // Verify user still exists
    const stmt = db.prepare('SELECT id FROM admin_users WHERE id = ?');
    const user = stmt.get(session.value);

    return !!user;
}

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    // Find user by email
    const stmt = db.prepare('SELECT * FROM admin_users WHERE email = ?');
    const user = stmt.get(email) as { id: number; username: string; email: string } | undefined;

    if (!user) {
        // Don't reveal if email exists or not
        redirect('/admin/login?message=If the email exists, a reset link has been sent.');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Save token to database
    const insertStmt = db.prepare('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)');
    insertStmt.run(user.id, token, expiresAt);

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

    if (!resend) {
        redirect('/admin/login?error=Email service not configured. Please set RESEND_API_KEY in .env.local');
    }

    try {
        await resend.emails.send({
            from: 'BenkiTv <onboarding@resend.dev>',
            to: user.email,
            subject: 'Password Reset - BenkiTv Admin',
            html: `
                <h1>Password Reset Request</h1>
                <p>Hello ${user.username},</p>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #cc0000; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
                <p>This link expires in 1 hour.</p>
                <p>If you didn't request this, ignore this email.</p>
                <br/>
                <p>- BenkiTv Team</p>
            `
        });
    } catch (error) {
        console.error('Email send error:', error);
        redirect('/admin/login?error=Failed to send email. Check Resend API key.');
    }

    redirect('/admin/login?message=Password reset link sent to your email!');
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string;
    const newPassword = formData.get('password') as string;

    if (!token || !newPassword) {
        redirect('/admin/login?error=Invalid request');
    }

    if (newPassword.length < 8) {
        redirect(`/admin/reset-password?token=${token}&error=Password must be at least 8 characters`);
    }

    // Find valid token
    const stmt = db.prepare(`
        SELECT * FROM password_reset_tokens 
        WHERE token = ? AND used = 0 AND expires_at > datetime('now')
    `);
    const tokenRecord = stmt.get(token) as { id: number; user_id: number } | undefined;

    if (!tokenRecord) {
        redirect('/admin/login?error=Invalid or expired reset link');
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // Update user password
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(passwordHash, tokenRecord.user_id);

    // Mark token as used
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(tokenRecord.id);

    redirect('/admin/login?message=Password reset successful! Please login.');
}

export async function changePassword(formData: FormData) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
        redirect('/admin/login');
    }

    const currentPassword = formData.get('current_password') as string;
    const newPassword = formData.get('new_password') as string;

    if (newPassword.length < 8) {
        return { error: 'New password must be at least 8 characters' };
    }

    // Get current user
    const stmt = db.prepare('SELECT * FROM admin_users WHERE id = ?');
    const user = stmt.get(session.value) as { id: number; password_hash: string } | undefined;

    if (!user) {
        redirect('/admin/login');
    }

    // Verify current password
    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
        return { error: 'Current password is incorrect' };
    }

    // Update password
    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, user.id);

    return { success: true };
}

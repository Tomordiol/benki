'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');

    // Simple hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
        (await cookies()).set('admin_session', 'true', { httpOnly: true, path: '/' });
        redirect('/admin');
    } else {
        // In a real app we might return the error to display it
        // redirecting back is basic
        redirect('/admin/login?error=Invalid Credentials');
    }
}

export async function logout() {
    (await cookies()).delete('admin_session');
    redirect('/admin/login');
}

export async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return !!session;
}

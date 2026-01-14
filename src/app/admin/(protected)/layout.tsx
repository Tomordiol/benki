
import { checkAuth, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import '../admin.css'; 

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">BenkiTv Admin</div>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/create">New Article</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
        <form action={logout}>
           <button className="logout-btn">Logout</button>
        </form>
      </aside>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}


// This layout applies to /admin and all sub-routes, INCLUDING /admin/login.
// We DO NOT check auth here to avoid infinite loops on the login page.
// Auth checks are now in (protected)/layout.tsx

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}

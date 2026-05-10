export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-soft-cream flex flex-col">
      {/* Branding header */}
      <header className="py-6 px-4 text-center">
        <h1 className="text-2xl font-bold text-primary font-beVietnamPro">
          Sổ Tay Tiểu Đường
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Người bạn đồng hành sức khỏe
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 text-center">
        <p className="text-xs text-on-surface-variant">
          © 2026 Sổ Tay Tiểu Đường
        </p>
      </footer>
    </div>
  );
}
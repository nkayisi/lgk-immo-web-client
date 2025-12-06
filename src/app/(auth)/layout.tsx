export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6">
        <div className="max-w-md mx-auto text-center text-xs text-slate-400">
          &copy; 2024 LGK Immo. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

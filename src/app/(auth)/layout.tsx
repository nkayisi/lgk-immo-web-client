import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Header */}
        <header className="p-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              LGK Immo
            </span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        {/* Footer */}
        <footer className="p-4">
          <div className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} LGK Immo. Tous droits réservés.
          </div>
        </footer>
      </div>

      {/* Right Side - Image/Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-gradient-to-br from-emerald-50 via-white to-cyan-50 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Testimonial or Feature */}
          <div className="max-w-lg">
            <div className="flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-2xl xl:text-3xl font-medium text-slate-800 leading-relaxed mb-8">
              &ldquo;LGK Immo m'a permis de trouver l'appartement parfait à
              Kinshasa en seulement 2 semaines. Une plateforme vraiment
              révolutionnaire !&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                JM
              </div>
              <div>
                <p className="text-slate-900 font-semibold">
                  Jean-Marie Kabongo
                </p>
                <p className="text-slate-500 text-sm">
                  Propriétaire à Gombe, Kinshasa
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-slate-900">
                2,500+
              </p>
              <p className="text-slate-500 text-sm mt-1">Propriétés</p>
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-slate-900">
                15,000+
              </p>
              <p className="text-slate-500 text-sm mt-1">Utilisateurs</p>
            </div>
            <div>
              <p className="text-3xl xl:text-4xl font-bold text-slate-900">
                98%
              </p>
              <p className="text-slate-500 text-sm mt-1">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

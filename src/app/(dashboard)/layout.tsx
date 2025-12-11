"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ProfileProvider, useProfile } from "@/contexts/profile-context";
import { Navbar } from "@/components/ui/navbar";
import { Loader2 } from "lucide-react";
import { Footer } from "@/components/ui/footer";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionLoading } = useSession();
  const { isLoading: profileLoading, needsOnboarding } = useProfile();
  const router = useRouter();

  // Rediriger si non connecté
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/login");
    }
  }, [sessionLoading, session, router]);

  // Rediriger vers onboarding si pas de profil
  useEffect(() => {
    if (!profileLoading && needsOnboarding) {
      router.push("/onboarding");
    }
  }, [profileLoading, needsOnboarding, router]);

  const isLoading = sessionLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto" />
          <p className="mt-4 text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar principal - identique à la page d'accueil */}
      <Navbar />

      {/* Spacer pour le navbar fixe */}
      <div className="h-20" />

      {/* Contenu principal */}
      <main className="pb-12">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ProfileProvider>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ProfileProvider, useProfile } from "@/contexts/profile-context";
import { AccountSidebar } from "@/components/account";
import { Navbar } from "@/components/ui/navbar";
import { Loader2 } from "lucide-react";
import { ensureProfileAction } from "@/lib/profile/ensure-profile";
import { ProfileType } from "@prisma/client";

function AccountLayoutContent({ children }: { children: React.ReactNode }) {
    const { data: session, isPending: sessionLoading } = useSession();
    const { isLoading: profileLoading, profile, refreshProfile } = useProfile();
    const router = useRouter();

    // Rediriger si non connecté
    useEffect(() => {
        if (!sessionLoading && !session) {
            router.push("/login");
        }
    }, [sessionLoading, session, router]);

    // S'assurer que l'utilisateur a un profil (important pour OAuth)
    useEffect(() => {
        if (!sessionLoading && !profileLoading && session?.user && !profile) {
            // Récupérer le type de profil depuis sessionStorage (pour OAuth)
            const pendingType = sessionStorage.getItem("pendingProfileType");
            let profileType: ProfileType | undefined = undefined;

            if (pendingType === "INDIVIDUAL") {
                profileType = ProfileType.INDIVIDUAL;
                sessionStorage.removeItem("pendingProfileType");
            } else if (pendingType === "BUSINESS") {
                profileType = ProfileType.BUSINESS;
                sessionStorage.removeItem("pendingProfileType");
            }

            // Créer automatiquement un profil si manquant
            ensureProfileAction({
                userId: session.user.id,
                email: session.user.email,
                profileType,
            }).then(() => {
                refreshProfile();
            });
        }
    }, [sessionLoading, profileLoading, session, profile, refreshProfile]);

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
        <div className="min-h-screen max-w-[1600px] mx-auto bg-[#faf8f5]">
            {/* Navbar principal */}
            <Navbar />

            {/* Spacer pour le navbar fixe */}
            <div className="h-20" />

            {/* Layout avec Sidebar */}
            <div className="flex h-[calc(100vh-5rem)]">
                {/* Sidebar */}
                <AccountSidebar />

                {/* Contenu principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-6xl mx-auto px-6 py-4">{children}</div>
                </main>
            </div>
        </div>
    );
}

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProfileProvider>
            <AccountLayoutContent>{children}</AccountLayoutContent>
        </ProfileProvider>
    );
}

"use client";

import { useSession } from "@/lib/auth-client";
import { LogoutButton } from "@/components/auth/logout-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold">LGK Immo</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.name || user.email}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium">{user.name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Email vérifié</p>
              <p className="font-medium">
                {user.emailVerified ? (
                  <span className="text-green-600">✓ Vérifié</span>
                ) : (
                  <span className="text-orange-600">En attente</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Membre depuis</p>
              <p className="font-medium">
                {new Date(user.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

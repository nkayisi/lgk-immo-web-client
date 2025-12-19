"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import { getProfileRoleLabel, ProfileRole } from "@/lib/profile/types";
import { motion } from "framer-motion";
import { Briefcase, Home, Key, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";

const roleIcons: Record<string, React.ElementType> = {
    tenant: Home,
    landlord: Key,
    agent: Briefcase,
};

const roleDescriptions: Record<string, string> = {
    tenant: "Gérez vos locations, contrats et paiements en tant que locataire.",
    landlord: "Gérez vos biens, locataires et revenus en tant que bailleur.",
    agent: "Gérez vos mandats, clients et commissions en tant que commissionnaire.",
};

const roleColors: Record<string, string> = {
    tenant: "from-blue-500 to-cyan-500",
    landlord: "from-emerald-500 to-teal-500",
    agent: "from-purple-500 to-violet-500",
};

export default function SpacePage() {
    const params = useParams();
    const { profile } = useProfile();
    const role = params.role as string;

    const roleKey = role?.toUpperCase() as keyof typeof ProfileRole;
    const hasRole = profile?.profileRoles?.some((r) => r.role === roleKey);

    const Icon = roleIcons[role] || AlertCircle;
    const description = roleDescriptions[role] || "Espace non disponible";
    const gradient = roleColors[role] || "from-slate-500 to-slate-600";

    if (!hasRole) {
        return (
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-slate-900">Espace non disponible</h1>
                    <p className="text-slate-500 mt-1">
                        Vous n&apos;avez pas accès à cet espace.
                    </p>
                </motion.div>

                <Card className="bg-white">
                    <CardContent className="py-16">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                Accès non autorisé
                            </h3>
                            <p className="text-slate-500 max-w-sm mx-auto">
                                Vous devez activer ce rôle dans votre profil pour accéder à cet espace.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const roleLabel = getProfileRoleLabel(roleKey as ProfileRole);

    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">
                    Espace {roleLabel}
                </h1>
                <p className="text-slate-500 mt-1">{description}</p>
            </motion.div>

            {/* Role Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className={`bg-gradient-to-br ${gradient} text-white mb-6`}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{roleLabel}</h2>
                                <p className="text-white/80 text-sm">{description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Coming Soon */}
            <Card className="bg-white">
                <CardContent className="py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Icon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Bientôt disponible
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Les fonctionnalités de cet espace sont en cours de développement.
                            Revenez bientôt pour découvrir de nouvelles options.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

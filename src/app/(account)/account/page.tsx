"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import { useSession } from "@/lib/auth-client";
import {
    getProfileDisplayName,
    isIndividualProfile,
    calculateProfileCompletion,
} from "@/lib/profile/types";
import { ProfileCompletionBanner } from "@/components/profile";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Building2,
    CheckCircle2,
    Clock,
    Eye,
    Heart,
    MessageSquare,
    Plus,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

const stats = [
    {
        label: "Annonces actives",
        value: "0",
        change: "+0%",
        trend: "up",
        icon: Building2,
        color: "emerald",
        href: "/account/properties",
    },
    {
        label: "Vues totales",
        value: "0",
        change: "+0%",
        trend: "up",
        icon: Eye,
        color: "blue",
        href: "/account/properties",
    },
    {
        label: "Messages",
        value: "0",
        change: "0 nouveaux",
        trend: "neutral",
        icon: MessageSquare,
        color: "purple",
        href: "/account/messages",
    },
    {
        label: "Favoris reçus",
        value: "0",
        change: "+0%",
        trend: "up",
        icon: Heart,
        color: "rose",
        href: "/account/favorites",
    },
];

const recentActivities = [
    {
        type: "view",
        message: "Votre annonce a été consultée 5 fois",
        time: "Il y a 2h",
        icon: Eye,
        color: "blue",
    },
    {
        type: "favorite",
        message: "Quelqu'un a ajouté votre bien en favori",
        time: "Il y a 5h",
        icon: Heart,
        color: "rose",
    },
    {
        type: "message",
        message: "Nouveau message de Jean Kabongo",
        time: "Hier",
        icon: MessageSquare,
        color: "purple",
    },
    {
        type: "listing",
        message: "Votre annonce a été approuvée",
        time: "Il y a 2 jours",
        icon: CheckCircle2,
        color: "emerald",
    },
];

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
    const Icon = stat.icon;
    const colorClasses: Record<string, string> = {
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        rose: "bg-rose-100 text-rose-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Link href={stat.href}>
                <Card className="hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group bg-white">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                            <div
                                className={`w-10 h-10 rounded-xl ${colorClasses[stat.color]} flex items-center justify-center`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>
                        <div className="mt-3">
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-1">
                            {stat.trend === "up" && (
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                            )}
                            <span
                                className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-slate-500"
                                    }`}
                            >
                                {stat.change}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}

function ActivityItem({
    activity,
    index,
}: {
    activity: (typeof recentActivities)[0];
    index: number;
}) {
    const Icon = activity.icon;
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        rose: "bg-rose-100 text-rose-600",
        purple: "bg-purple-100 text-purple-600",
        emerald: "bg-emerald-100 text-emerald-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
        >
            <div
                className={`w-9 h-9 rounded-lg ${colorClasses[activity.color]} flex items-center justify-center flex-shrink-0`}
            >
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium">{activity.message}</p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                </p>
            </div>
        </motion.div>
    );
}

export default function AccountDashboardPage() {
    const { data: session } = useSession();
    const { profile } = useProfile();

    if (!session?.user || !profile) {
        return null;
    }

    const displayName = getProfileDisplayName(profile);
    const isIndividual = isIndividualProfile(profile);
    const firstName = isIndividual
        ? profile.individualProfile.firstName || displayName.split(" ")[0]
        : displayName;

    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">
                    Bienvenue, {firstName}. Voici un aperçu de votre activité.
                </p>
            </motion.div>

            {/* Profile Completion Banner */}
            <div className="mb-6">
                <ProfileCompletionBanner profile={profile} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={stat.label} stat={stat} index={index} />
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
                <Link href="/account/properties/new">
                    <Button variant="primary" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nouvelle annonce
                    </Button>
                </Link>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Activité récente
                    </h2>
                    <Link
                        href="/account/activity"
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Tout voir
                    </Link>
                </div>
                <Card className="bg-white">
                    <CardContent className="p-2">
                        {recentActivities.length > 0 ? (
                            <div className="space-y-1">
                                {recentActivities.map((activity, index) => (
                                    <ActivityItem key={index} activity={activity} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500">Aucune activité récente</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

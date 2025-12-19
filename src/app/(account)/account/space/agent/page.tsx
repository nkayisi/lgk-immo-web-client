"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import { ProfileRole } from "@/lib/profile/types";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Briefcase,
    Building2,
    Calendar,
    FileText,
    Handshake,
    MessageSquare,
    Plus,
    TrendingUp,
    Users,
    Wallet,
} from "lucide-react";
import Link from "next/link";

export default function AgentSpacePage() {
    const { profile } = useProfile();
    const hasRole = profile?.profileRoles?.some((r) => r.role === ProfileRole.AGENT);

    if (!hasRole) {
        return (
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-slate-900">Espace Commissionnaire</h1>
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
                            <p className="text-slate-500 max-w-sm mx-auto mb-6">
                                Activez le rôle Commissionnaire dans votre profil pour accéder à cet espace.
                            </p>
                            <Link href="/account/profile">
                                <Button variant="primary">Gérer mon profil</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Données fictives pour la démo
    const stats = {
        activeMandate: 5,
        pendingDeals: 2,
        closedDeals: 12,
        totalCommissions: 4500,
    };

    const mandates = [
        {
            id: "1",
            property: "Villa moderne - Gombe",
            owner: "Jean Kabongo",
            type: "Vente",
            price: 450000,
            commission: 4,
            status: "active",
        },
        {
            id: "2",
            property: "Appartement T4 - Ngaliema",
            owner: "Marie Lukusa",
            type: "Location",
            price: 1800,
            commission: 100,
            status: "active",
        },
        {
            id: "3",
            property: "Terrain 500m² - Mont-Ngafula",
            owner: "Pierre Mbuyi",
            type: "Vente",
            price: 80000,
            commission: 5,
            status: "pending",
        },
    ];

    const recentDeals = [
        { id: "1", property: "Studio meublé", type: "Location", commission: 600, date: "2024-02-10", status: "completed" },
        { id: "2", property: "Appartement T2", type: "Vente", commission: 3500, date: "2024-01-25", status: "completed" },
        { id: "3", property: "Local commercial", type: "Location", commission: 400, date: "2024-01-15", status: "completed" },
    ];

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Espace Commissionnaire</h1>
                        <p className="text-slate-500">Gérez vos mandats et commissions</p>
                    </div>
                </div>
                <Button variant="primary" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau mandat
                </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.activeMandate}</p>
                                <p className="text-sm text-slate-500">Mandats actifs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Handshake className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{stats.pendingDeals}</p>
                                <p className="text-sm text-slate-500">En négociation</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-600">{stats.closedDeals}</p>
                                <p className="text-sm text-slate-500">Transactions conclues</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <Wallet className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.totalCommissions} USD</p>
                                <p className="text-sm text-slate-500">Commissions ce mois</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Mes clients</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">Biens en mandat</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Wallet className="w-5 h-5" />
                    <span className="text-sm">Mes commissions</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Messages</span>
                </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Active Mandates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                Mandats en cours
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {mandates.map((mandate) => (
                                    <div
                                        key={mandate.id}
                                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mandate.status === "active" ? "bg-purple-100" : "bg-amber-100"
                                                }`}>
                                                <Building2 className={`w-5 h-5 ${mandate.status === "active" ? "text-purple-600" : "text-amber-600"
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{mandate.property}</p>
                                                <p className="text-sm text-slate-500">
                                                    {mandate.owner} • {mandate.type}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">
                                                {mandate.type === "Vente"
                                                    ? `${mandate.commission}%`
                                                    : `${mandate.commission} USD`}
                                            </p>
                                            <Badge variant={mandate.status === "active" ? "success" : "warning"}>
                                                {mandate.status === "active" ? "Actif" : "En attente"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                Voir tous les mandats
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Deals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                Dernières commissions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentDeals.map((deal) => (
                                    <div
                                        key={deal.id}
                                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{deal.property}</p>
                                                <p className="text-sm text-slate-500">{deal.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-emerald-600">+{deal.commission} USD</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(deal.date).toLocaleDateString("fr-FR")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full mt-4">
                                Voir tout l&apos;historique
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import { ProfileRole } from "@/lib/profile/types";
import { motion } from "framer-motion";
import {
    AlertCircle,
    Building2,
    Calendar,
    CreditCard,
    FileText,
    Key,
    MessageSquare,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";

export default function LandlordSpacePage() {
    const { profile } = useProfile();
    const hasRole = profile?.profileRoles?.some((r) => r.role === ProfileRole.LANDLORD);

    if (!hasRole) {
        return (
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-slate-900">Espace Bailleur</h1>
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
                                Activez le rôle Bailleur dans votre profil pour accéder à cet espace.
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
        totalProperties: 3,
        occupiedProperties: 2,
        pendingPayments: 1,
        totalRevenue: 3600,
    };

    const properties = [
        {
            id: "1",
            title: "Appartement T3 - Gombe",
            tenant: "Marie Lukusa",
            rentAmount: 1200,
            status: "occupied",
            nextPayment: "2024-03-01",
        },
        {
            id: "2",
            title: "Villa 5 chambres - Ngaliema",
            tenant: "Pierre Mbuyi",
            rentAmount: 2400,
            status: "occupied",
            nextPayment: "2024-03-05",
        },
        {
            id: "3",
            title: "Studio meublé - Limete",
            tenant: null,
            rentAmount: 600,
            status: "vacant",
            nextPayment: null,
        },
    ];

    const recentTransactions = [
        { id: "1", property: "Appartement T3", tenant: "Marie Lukusa", amount: 1200, date: "2024-02-01", status: "received" },
        { id: "2", property: "Villa 5 chambres", tenant: "Pierre Mbuyi", amount: 2400, date: "2024-02-05", status: "received" },
        { id: "3", property: "Appartement T3", tenant: "Marie Lukusa", amount: 1200, date: "2024-01-01", status: "received" },
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Key className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Espace Bailleur</h1>
                        <p className="text-slate-500">Gérez vos biens et locataires</p>
                    </div>
                </div>
                <Link href="/account/properties/new">
                    <Button variant="primary" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Ajouter un bien
                    </Button>
                </Link>
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
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalProperties}</p>
                                <p className="text-sm text-slate-500">Biens</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{stats.occupiedProperties}</p>
                                <p className="text-sm text-slate-500">Occupés</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{stats.pendingPayments}</p>
                                <p className="text-sm text-slate-500">En attente</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.totalRevenue} USD</p>
                                <p className="text-sm text-slate-500">Revenus ce mois</p>
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
                    <span className="text-sm">Mes locataires</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">Suivre les paiements</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Contrats de bail</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Messages</span>
                </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Properties */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                                Mes biens
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {properties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.status === "occupied" ? "bg-emerald-100" : "bg-slate-100"
                                                }`}>
                                                <Building2 className={`w-5 h-5 ${property.status === "occupied" ? "text-emerald-600" : "text-slate-400"
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{property.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {property.tenant || "Vacant"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">{property.rentAmount} USD</p>
                                            <Badge variant={property.status === "occupied" ? "success" : "secondary"}>
                                                {property.status === "occupied" ? "Occupé" : "Vacant"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Link href="/account/properties">
                                <Button variant="outline" className="w-full mt-4">
                                    Voir tous mes biens
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                Derniers paiements reçus
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">{transaction.property}</p>
                                                <p className="text-sm text-slate-500">{transaction.tenant}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-green-600">+{transaction.amount} USD</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(transaction.date).toLocaleDateString("fr-FR")}
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

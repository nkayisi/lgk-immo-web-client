"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import { ProfileRole } from "@/lib/profile/types";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    Calendar,
    CreditCard,
    FileText,
    Home,
    Key,
    MessageSquare,
    Plus,
    Search,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function TenantSpacePage() {
    const { profile } = useProfile();
    const hasRole = profile?.profileRoles?.some((r) => r.role === ProfileRole.TENANT);

    if (!hasRole) {
        return (
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-slate-900">Espace Locataire</h1>
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
                                Activez le rôle Locataire dans votre profil pour accéder à cet espace.
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
        activeRentals: 1,
        pendingPayments: 0,
        documentsToSign: 2,
        unreadMessages: 3,
    };

    const currentRental = {
        id: "1",
        property: "Appartement T3 - Gombe",
        address: "123 Avenue de la Paix, Kinshasa",
        landlord: "Jean Kabongo",
        rentAmount: 1200,
        currency: "USD",
        nextPaymentDate: "2024-03-01",
        leaseEndDate: "2024-12-31",
    };

    const recentPayments = [
        { id: "1", date: "2024-02-01", amount: 1200, status: "paid" },
        { id: "2", date: "2024-01-01", amount: 1200, status: "paid" },
        { id: "3", date: "2023-12-01", amount: 1200, status: "paid" },
    ];

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Espace Locataire</h1>
                        <p className="text-slate-500">Gérez vos locations et paiements</p>
                    </div>
                </div>
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
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Home className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.activeRentals}</p>
                                <p className="text-sm text-slate-500">Location active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-600">{stats.pendingPayments}</p>
                                <p className="text-sm text-slate-500">Paiements en attente</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-amber-600">{stats.documentsToSign}</p>
                                <p className="text-sm text-slate-500">Documents à signer</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-600">{stats.unreadMessages}</p>
                                <p className="text-sm text-slate-500">Messages non lus</p>
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
                    <Search className="w-5 h-5" />
                    <span className="text-sm">Chercher un logement</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span className="text-sm">Payer mon loyer</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Mes documents</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Contacter le bailleur</span>
                </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Current Rental */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-blue-600" />
                                Ma location actuelle
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900">{currentRental.property}</h3>
                                    <p className="text-sm text-slate-500">{currentRental.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Bailleur</p>
                                        <p className="font-medium text-slate-900">{currentRental.landlord}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Loyer mensuel</p>
                                        <p className="font-medium text-emerald-600">
                                            {currentRental.rentAmount} {currentRental.currency}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Prochain paiement</p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(currentRental.nextPaymentDate).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Fin du bail</p>
                                        <p className="font-medium text-slate-900">
                                            {new Date(currentRental.leaseEndDate).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="primary" className="w-full gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payer le loyer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Payments */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                Historique des paiements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentPayments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {new Date(payment.date).toLocaleDateString("fr-FR", {
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                                <p className="text-sm text-slate-500">Loyer mensuel</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">{payment.amount} USD</p>
                                            <Badge variant="success">Payé</Badge>
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

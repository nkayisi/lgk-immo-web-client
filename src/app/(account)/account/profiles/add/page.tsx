"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, Building2, ArrowLeft, Check } from "lucide-react";
import { ProfileType } from "@/lib/profile/types";
import { useProfile } from "@/contexts/profile-context";
import { IndividualProfileForm } from "@/components/profile/individual-profile-form";
import { BusinessProfileForm } from "@/components/profile/business-profile-form";
import { createIndividualProfile, createBusinessProfile } from "@/lib/profile/actions";
import type { CreateIndividualProfileInput, CreateBusinessProfileInput } from "@/lib/profile/types";

export default function AddProfilePage() {
    const router = useRouter();
    const { profile, refreshProfile } = useProfile();
    const [selectedType, setSelectedType] = useState<ProfileType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!profile) {
        return null;
    }

    // Déterminer quel type de profil peut être ajouté
    const canAddIndividual = profile.profileType !== ProfileType.INDIVIDUAL;
    const canAddBusiness = profile.profileType !== ProfileType.BUSINESS;

    const handleIndividualSubmit = async (data: CreateIndividualProfileInput) => {
        setIsSubmitting(true);
        try {
            const result = await createIndividualProfile(data);
            if (result.success) {
                await refreshProfile();
                router.push("/account/profile");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error creating individual profile:", error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBusinessSubmit = async (data: CreateBusinessProfileInput) => {
        setIsSubmitting(true);
        try {
            const result = await createBusinessProfile(data);
            if (result.success) {
                await refreshProfile();
                router.push("/account/profile");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error creating business profile:", error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    if (selectedType === ProfileType.INDIVIDUAL) {
        return (
            <div className="mx-auto">
                <IndividualProfileForm
                    onSubmit={handleIndividualSubmit}
                    onBack={() => setSelectedType(null)}
                />
            </div>
        );
    }

    if (selectedType === ProfileType.BUSINESS) {
        return (
            <div className="mx-auto">
                <BusinessProfileForm
                    onSubmit={handleBusinessSubmit}
                    onBack={() => setSelectedType(null)}
                />
            </div>
        );
    }

    return (
        <div className="mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                </button>
                <h1 className="text-2xl font-bold text-slate-900">Ajouter un profil</h1>
                <p className="text-slate-500 mt-1">
                    Créez un profil supplémentaire pour gérer différents types d'activités.
                </p>
            </motion.div>

            {/* Profile Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Individual Profile Card */}
                {canAddIndividual && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">Profil Particulier</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600 text-sm">
                                    Pour vos activités personnelles : recherche de logement, location, etc.
                                </p>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Rechercher un logement
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Louer votre bien
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Gérer vos favoris
                                    </li>
                                </ul>
                                <Button
                                    onClick={() => setSelectedType(ProfileType.INDIVIDUAL)}
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    Créer un profil particulier
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Business Profile Card */}
                {canAddBusiness && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                            <CardHeader className="pb-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Building2 className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-xl">Profil Professionnel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-slate-600 text-sm">
                                    Pour votre entreprise : agence immobilière, gestion de biens, etc.
                                </p>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Publier des annonces
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Gérer un portefeuille
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        Outils professionnels
                                    </li>
                                </ul>
                                <Button
                                    onClick={() => setSelectedType(ProfileType.BUSINESS)}
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    Créer un profil professionnel
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* No profiles available */}
                {!canAddIndividual && !canAddBusiness && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-2"
                    >
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-slate-600">
                                    Vous avez déjà créé tous les types de profils disponibles.
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

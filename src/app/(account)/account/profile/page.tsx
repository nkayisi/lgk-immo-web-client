"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import {
    getProfileDisplayName,
    getProfileTypeLabel,
    isIndividualProfile,
    isBusinessProfile,
    calculateProfileCompletion,
} from "@/lib/profile/types";
import { motion } from "framer-motion";
import { Edit, Mail, MapPin, Phone, User, Building2 } from "lucide-react";

export default function ProfilePage() {
    const { profile } = useProfile();

    if (!profile) {
        return null;
    }

    const completion = calculateProfileCompletion(profile);
    const isIndividual = isIndividualProfile(profile);
    const isBusiness = isBusinessProfile(profile);

    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
                <p className="text-slate-500 mt-1">
                    Gérez vos informations personnelles.
                </p>
            </motion.div>

            {/* Profile Card */}
            <Card className="bg-white mb-6">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                                {getProfileDisplayName(profile).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {getProfileDisplayName(profile)}
                                </h2>
                                <p className="text-slate-500">
                                    {getProfileTypeLabel(profile.profileType)}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="w-4 h-4" />
                            Modifier
                        </Button>
                    </div>

                    {/* Completion Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">Profil complété</span>
                            <span className="text-sm font-medium text-slate-900">
                                {completion}%
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                                style={{ width: `${completion}%` }}
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-4">
                        {isIndividual && profile.individualProfile && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <User className="w-5 h-5 text-slate-400" />
                                <span>
                                    {profile.individualProfile.fullName || "Nom non renseigné"}
                                </span>
                            </div>
                        )}

                        {isBusiness && profile.businessProfile && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <Building2 className="w-5 h-5 text-slate-400" />
                                <span>
                                    {profile.businessProfile.businessName || "Entreprise non renseignée"}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 text-slate-600">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <span>{profile.phoneNumber || "Téléphone non renseigné"}</span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-600">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <span>
                                {profile.city && profile.country
                                    ? `${profile.city}, ${profile.country}`
                                    : "Adresse non renseignée"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

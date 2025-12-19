"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/contexts/profile-context";
import {
    getProfileDisplayName,
    getProfileTypeLabel,
    isIndividualProfile,
    isBusinessProfile,
    calculateProfileCompletion,
    ProfileRole,
    getProfileRoleLabel,
} from "@/lib/profile/types";
import { motion } from "framer-motion";
import { Edit, MapPin, Phone, User, Building2, Home, Key, Briefcase, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { addProfileRole } from "@/lib/profile/actions";

export default function ProfilePage() {
    const { profile, refreshProfile } = useProfile();
    const [isAddingRole, setIsAddingRole] = useState(false);

    if (!profile) {
        return null;
    }

    const completion = calculateProfileCompletion(profile);
    const isIndividual = isIndividualProfile(profile);
    const isBusiness = isBusinessProfile(profile);

    const activeRoles = profile.profileRoles?.map(r => r.role) || [];
    const availableRoles = Object.values(ProfileRole).filter(role => !activeRoles.includes(role));

    const roleIcons: Record<ProfileRole, typeof Home> = {
        [ProfileRole.TENANT]: Home,
        [ProfileRole.LANDLORD]: Key,
        [ProfileRole.AGENT]: Briefcase,
    };

    const handleAddRole = async (role: ProfileRole) => {
        setIsAddingRole(true);
        try {
            await addProfileRole(profile.id, role);
            await refreshProfile();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du rôle:', error);
        } finally {
            setIsAddingRole(false);
        }
    };

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
                        {isIndividual && (
                            <div className="flex items-center gap-3 text-slate-600">
                                <User className="w-5 h-5 text-slate-400" />
                                <span>
                                    {profile.user.firstName && profile.user.lastName
                                        ? `${profile.user.firstName} ${profile.user.lastName}`
                                        : profile.user.name || "Nom non renseigné"}
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

            {/* Mes Espaces / Rôles */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Mes espaces</span>
                        {availableRoles.length > 0 && (
                            <Badge variant="secondary">
                                {availableRoles.length} disponible{availableRoles.length > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Rôles actifs */}
                    {activeRoles.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium text-slate-700 mb-3">Espaces activés</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {activeRoles.map((role) => {
                                    const Icon = roleIcons[role];
                                    return (
                                        <div
                                            key={role}
                                            className="flex items-center gap-3 p-3 border border-emerald-200 bg-emerald-50 rounded-lg"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">
                                                    {getProfileRoleLabel(role)}
                                                </p>
                                                <p className="text-xs text-slate-500">Actif</p>
                                            </div>
                                            <Badge variant="success">✓</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rôles disponibles */}
                    {availableRoles.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-3">
                                Espaces disponibles
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {availableRoles.map((role) => {
                                    const Icon = roleIcons[role];
                                    return (
                                        <button
                                            key={role}
                                            onClick={() => handleAddRole(role)}
                                            disabled={isAddingRole}
                                            className="flex items-center gap-3 p-3 border border-slate-200 bg-white rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-slate-600" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="font-medium text-slate-900">
                                                    {getProfileRoleLabel(role)}
                                                </p>
                                                <p className="text-xs text-slate-500">Cliquer pour activer</p>
                                            </div>
                                            <Plus className="w-5 h-5 text-slate-400" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeRoles.length === 0 && availableRoles.length === 0 && (
                        <p className="text-center text-slate-500 py-8">
                            Aucun espace disponible
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

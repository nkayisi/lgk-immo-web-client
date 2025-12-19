"use client";

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
import { Home, Key, Briefcase, Plus, Mail, Calendar, CreditCard, FileText, Users, Phone, MapPin, User, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { addProfileRole, updateContactInfo, updatePersonalInfo, updateBusinessInfo } from "@/lib/profile/actions";
import { ProfileSection, InfoRow } from "@/components/profile/profile-section";

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

    const handleUpdateContact = async () => {
        const form = document.getElementById('contact-form') as HTMLFormElement;
        const formData = new FormData(form);

        await updateContactInfo(profile.id, {
            phoneNumber: formData.get('phoneNumber') as string,
            country: formData.get('country') as string,
            city: formData.get('city') as string,
            address: formData.get('address') as string,
        });

        await refreshProfile();
    };

    const handleUpdatePersonal = async () => {
        const form = document.getElementById('personal-form') as HTMLFormElement;
        const formData = new FormData(form);

        await updatePersonalInfo(profile.id, {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            dateOfBirth: formData.get('dateOfBirth') as string,
            gender: formData.get('gender') as string,
            nationalIdNumber: formData.get('nationalIdNumber') as string,
        });

        await refreshProfile();
    };

    const handleUpdateBusiness = async () => {
        const form = document.getElementById('business-form') as HTMLFormElement;
        const formData = new FormData(form);

        await updateBusinessInfo(profile.id, {
            businessName: formData.get('businessName') as string,
            registrationNumber: formData.get('registrationNumber') as string,
            taxId: formData.get('taxId') as string,
            legalRepresentativeName: formData.get('legalRepresentativeName') as string,
        });

        await refreshProfile();
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

            {/* Profile Header */}
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
                    </div>

                    {/* Completion Progress */}
                    <div>
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
                </CardContent>
            </Card>

            <div className="flex flex-wrap gap-6">
                {/* Section: Informations personnelles (Profil Individuel) */}
                {isIndividual && (
                    <div className="flex-1 h-grow mb-6">
                        <ProfileSection
                            title="Informations personnelles"
                            onSave={handleUpdatePersonal}
                            editForm={
                                <form id="personal-form" className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                defaultValue={profile.individualProfile?.firstName || ""}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Jean"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                defaultValue={profile.individualProfile?.lastName || ""}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="Dupont"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Date de naissance
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                defaultValue={
                                                    profile.individualProfile?.dateOfBirth
                                                        ? new Date(profile.individualProfile.dateOfBirth)
                                                            .toISOString()
                                                            .split("T")[0]
                                                        : ""
                                                }
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Genre
                                            </label>
                                            <select
                                                name="gender"
                                                defaultValue={profile.individualProfile?.gender || ""}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="MALE">Homme</option>
                                                <option value="FEMALE">Femme</option>
                                                <option value="OTHER">Autre</option>
                                                <option value="PREFER_NOT_TO_SAY">Préfère ne pas dire</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Numéro de carte d'identité
                                        </label>
                                        <input
                                            type="text"
                                            name="nationalIdNumber"
                                            defaultValue={profile.individualProfile?.nationalIdNumber || ""}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="1-XXXX-XXXXXXX-XX"
                                        />
                                    </div>
                                </form>
                            }
                        >
                            <div className="space-y-3">
                                <InfoRow
                                    icon={<User className="w-5 h-5" />}
                                    label="Prénom"
                                    value={profile.individualProfile?.firstName}
                                />
                                <InfoRow
                                    icon={<User className="w-5 h-5" />}
                                    label="Nom"
                                    value={profile.individualProfile?.lastName}
                                />
                                <InfoRow
                                    icon={<Calendar className="w-5 h-5" />}
                                    label="Date de naissance"
                                    value={
                                        profile.individualProfile?.dateOfBirth
                                            ? new Date(profile.individualProfile.dateOfBirth).toLocaleDateString('fr-FR')
                                            : null
                                    }
                                />
                                <InfoRow
                                    icon={<Users className="w-5 h-5" />}
                                    label="Genre"
                                    value={
                                        profile.individualProfile?.gender === 'MALE' ? 'Homme' :
                                            profile.individualProfile?.gender === 'FEMALE' ? 'Femme' :
                                                profile.individualProfile?.gender === 'OTHER' ? 'Autre' :
                                                    profile.individualProfile?.gender === 'PREFER_NOT_TO_SAY' ? 'Préfère ne pas dire' :
                                                        null
                                    }
                                />
                                <InfoRow
                                    icon={<CreditCard className="w-5 h-5" />}
                                    label="Numéro de carte d'identité"
                                    value={profile.individualProfile?.nationalIdNumber}
                                />
                            </div>
                        </ProfileSection>
                    </div>
                )}

                {/* Section: Informations de l'entreprise (Profil Business) */}
                {isBusiness && (
                    <div className="flex-1 h-full mb-6">
                        <ProfileSection
                            title="Informations de l'entreprise"
                            onSave={handleUpdateBusiness}
                            editForm={
                                <form id="business-form" className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nom de l'entreprise
                                        </label>
                                        <input
                                            type="text"
                                            name="businessName"
                                            defaultValue={profile.businessProfile?.businessName || ""}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Ma Société SARL"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Numéro d'enregistrement
                                            </label>
                                            <input
                                                type="text"
                                                name="registrationNumber"
                                                defaultValue={profile.businessProfile?.registrationNumber || ""}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="RCCM/XXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Numéro fiscal (NIF)
                                            </label>
                                            <input
                                                type="text"
                                                name="taxId"
                                                defaultValue={profile.businessProfile?.taxId || ""}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                placeholder="A1234567X"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Nom du représentant légal
                                        </label>
                                        <input
                                            type="text"
                                            name="legalRepresentativeName"
                                            defaultValue={profile.businessProfile?.legalRepresentativeName || ""}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Jean Dupont"
                                        />
                                    </div>
                                </form>
                            }
                        >
                            <div className="space-y-3">
                                <InfoRow
                                    icon={<Building2 className="w-5 h-5" />}
                                    label="Nom de l'entreprise"
                                    value={profile.businessProfile?.businessName}
                                />
                                <InfoRow
                                    icon={<FileText className="w-5 h-5" />}
                                    label="Numéro d'enregistrement"
                                    value={profile.businessProfile?.registrationNumber}
                                />
                                <InfoRow
                                    icon={<CreditCard className="w-5 h-5" />}
                                    label="Numéro fiscal (NIF)"
                                    value={profile.businessProfile?.taxId}
                                />
                                <InfoRow
                                    icon={<User className="w-5 h-5" />}
                                    label="Représentant légal"
                                    value={profile.businessProfile?.legalRepresentativeName}
                                />
                            </div>
                        </ProfileSection>
                    </div>
                )}

                {/* Section: Informations de contact */}
                <div className="flex-1 mb-6">
                    <ProfileSection
                        title="Informations de contact"
                        onSave={handleUpdateContact}
                        editForm={
                            <form id="contact-form" className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        defaultValue={profile.phoneNumber || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="+243 XXX XXX XXX"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Pays
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            defaultValue={profile.country || ""}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="RD Congo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            defaultValue={profile.city || ""}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Kinshasa"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Adresse complète
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        defaultValue={profile.address || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="123 Avenue de la Paix, Gombe"
                                    />
                                </div>
                            </form>
                        }
                    >
                        <div className="space-y-3">
                            <InfoRow
                                icon={<Mail className="w-5 h-5" />}
                                label="Email"
                                value={profile.user.email}
                            />
                            <InfoRow
                                icon={<Phone className="w-5 h-5" />}
                                label="Téléphone"
                                value={profile.phoneNumber}
                            />
                            <InfoRow
                                icon={<MapPin className="w-5 h-5" />}
                                label="Pays"
                                value={profile.country}
                            />
                            <InfoRow
                                icon={<MapPin className="w-5 h-5" />}
                                label="Ville"
                                value={profile.city}
                            />
                            <InfoRow
                                icon={<MapPin className="w-5 h-5" />}
                                label="Adresse"
                                value={profile.address}
                            />
                        </div>
                    </ProfileSection>
                </div>
            </div>

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

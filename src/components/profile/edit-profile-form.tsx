"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ProfileWithDetails,
    isIndividualProfile,
    isBusinessProfile,
    Gender,
    UpdateIndividualProfileInput,
    UpdateBusinessProfileInput,
} from "@/lib/profile/types";
import {
    updateIndividualProfile,
    updateBusinessProfile,
} from "@/lib/profile/actions";
import { Loader2, Save, X } from "lucide-react";

interface EditProfileFormProps {
    profile: ProfileWithDetails;
    onCancel: () => void;
    onSuccess: () => void;
}

export function EditProfileForm({
    profile,
    onCancel,
    onSuccess,
}: EditProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isIndividual = isIndividualProfile(profile);
    const isBusiness = isBusinessProfile(profile);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            let result;

            if (isIndividual) {
                const input: UpdateIndividualProfileInput = {
                    phoneNumber: formData.get("phoneNumber") as string,
                    country: formData.get("country") as string,
                    city: formData.get("city") as string,
                    address: formData.get("address") as string,
                    firstName: formData.get("firstName") as string,
                    lastName: formData.get("lastName") as string,
                    dateOfBirth: formData.get("dateOfBirth") as string,
                    gender: formData.get("gender") as Gender,
                    nationalIdNumber: formData.get("nationalIdNumber") as string,
                };
                result = await updateIndividualProfile(profile.id, input);
            } else if (isBusiness) {
                const input: UpdateBusinessProfileInput = {
                    phoneNumber: formData.get("phoneNumber") as string,
                    country: formData.get("country") as string,
                    city: formData.get("city") as string,
                    address: formData.get("address") as string,
                    businessName: formData.get("businessName") as string,
                    registrationNumber: formData.get("registrationNumber") as string,
                    taxId: formData.get("taxId") as string,
                    legalRepresentativeName: formData.get(
                        "legalRepresentativeName"
                    ) as string,
                };
                result = await updateBusinessProfile(profile.id, input);
            }

            if (result?.success) {
                onSuccess();
            } else {
                setError(result?.message || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            setError("Une erreur est survenue");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle>Modifier mon profil</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Informations communes */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">
                            Informations de contact
                        </h3>

                        <div>
                            <label
                                htmlFor="phoneNumber"
                                className="block text-sm font-medium text-slate-700 mb-1"
                            >
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                defaultValue={profile.phoneNumber || ""}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="+243 XXX XXX XXX"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="country"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Pays
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    defaultValue={profile.country || ""}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="RD Congo"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="city"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Ville
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    defaultValue={profile.city || ""}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Kinshasa"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-slate-700 mb-1"
                            >
                                Adresse complète
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                defaultValue={profile.address || ""}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="123 Avenue de la Paix, Gombe"
                            />
                        </div>
                    </div>

                    {/* Informations spécifiques - Profil Individuel */}
                    {isIndividual && profile.individualProfile && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h3 className="font-semibold text-slate-900">
                                Informations personnelles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        defaultValue={profile.individualProfile.firstName || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Jean"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        defaultValue={profile.individualProfile.lastName || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Dupont"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="dateOfBirth"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        defaultValue={
                                            profile.individualProfile.dateOfBirth
                                                ? new Date(profile.individualProfile.dateOfBirth)
                                                    .toISOString()
                                                    .split("T")[0]
                                                : ""
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Genre
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        defaultValue={profile.individualProfile.gender || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Sélectionner</option>
                                        <option value="MALE">Homme</option>
                                        <option value="FEMALE">Femme</option>
                                        <option value="OTHER">Autre</option>
                                        <option value="PREFER_NOT_TO_SAY">
                                            Préfère ne pas dire
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="nationalIdNumber"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Numéro de carte d'identité
                                </label>
                                <input
                                    type="text"
                                    id="nationalIdNumber"
                                    name="nationalIdNumber"
                                    defaultValue={
                                        profile.individualProfile.nationalIdNumber || ""
                                    }
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="1-XXXX-XXXXXXX-XX"
                                />
                            </div>
                        </div>
                    )}

                    {/* Informations spécifiques - Profil Entreprise */}
                    {isBusiness && profile.businessProfile && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h3 className="font-semibold text-slate-900">
                                Informations de l'entreprise
                            </h3>

                            <div>
                                <label
                                    htmlFor="businessName"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Nom de l'entreprise
                                </label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    defaultValue={profile.businessProfile.businessName || ""}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Ma Société SARL"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="registrationNumber"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Numéro d'enregistrement
                                    </label>
                                    <input
                                        type="text"
                                        id="registrationNumber"
                                        name="registrationNumber"
                                        defaultValue={
                                            profile.businessProfile.registrationNumber || ""
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="RCCM/XXX"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="taxId"
                                        className="block text-sm font-medium text-slate-700 mb-1"
                                    >
                                        Numéro fiscal (NIF)
                                    </label>
                                    <input
                                        type="text"
                                        id="taxId"
                                        name="taxId"
                                        defaultValue={profile.businessProfile.taxId || ""}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="A1234567X"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="legalRepresentativeName"
                                    className="block text-sm font-medium text-slate-700 mb-1"
                                >
                                    Nom du représentant légal
                                </label>
                                <input
                                    type="text"
                                    id="legalRepresentativeName"
                                    name="legalRepresentativeName"
                                    defaultValue={
                                        profile.businessProfile.legalRepresentativeName || ""
                                    }
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Jean Dupont"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Enregistrer
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

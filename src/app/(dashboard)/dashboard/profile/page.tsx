"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/contexts/profile-context";
import { useSession } from "@/lib/auth-client";
import {
  Gender,
  getProfileDisplayName,
  getVerificationStatusLabel,
  isBusinessProfile,
  isIndividualProfile,
  type Profile,
  VerificationStatus,
  calculateProfileCompletion,
} from "@/lib/profile/types";
import { ProfileSwitcher } from "@/components/profile/profile-switcher";
import { ProfileRolesManager } from "@/components/profile/profile-roles-manager";
import { AddProfileModal } from "@/components/profile/add-profile-modal";
import { ProfileType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Building2,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit3,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Upload,
  User,
  X,
  XCircle,
  Users,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// =============================================================================
// TYPES
// =============================================================================

type TabId =
  | "identity"
  | "contact"
  | "location"
  | "documents"
  | "business"
  | "legal";

interface FieldConfig {
  field: string;
  label: string;
  type?: "text" | "tel" | "date" | "email" | "select";
  options?: { value: string; label: string }[];
  icon?: React.ElementType;
  placeholder?: string;
}

interface EditableSectionProps {
  tabId: TabId;
  title: string;
  fields: FieldConfig[];
  profile: Profile;
  updateProfile: (data: Record<string, string>) => Promise<boolean>;
}

// =============================================================================
// OPTIONS
// =============================================================================

const genderOptions = [
  { value: Gender.MALE, label: "Homme" },
  { value: Gender.FEMALE, label: "Femme" },
  { value: Gender.OTHER, label: "Autre" },
  { value: Gender.PREFER_NOT_TO_SAY, label: "Ne pas préciser" },
];

const countryOptions = [
  { value: "RDC", label: "République Démocratique du Congo" },
  { value: "Congo", label: "République du Congo" },
  { value: "Angola", label: "Angola" },
  { value: "Zambie", label: "Zambie" },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function EditableSection({
  tabId,
  title,
  fields,
  profile,
  updateProfile,
}: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleEdit = (field: string, value: string) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(editedValues).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const success = await updateProfile(editedValues);

      if (success) {
        setIsEditing(false);
        setEditedValues({});
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError("Une erreur est survenue lors de la sauvegarde.");
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedValues({});
    setSaveError(null);
  };

  const getFieldValue = (field: string): string | null | undefined => {
    // Check base profile fields first
    const profileRecord = profile as unknown as Record<string, unknown>;
    if (field in profileRecord) {
      const value = profileRecord[field];
      if (value instanceof Date) {
        return value.toISOString().split("T")[0];
      }
      return value as string | null | undefined;
    }
    // Check individual profile fields
    if (profile.individualProfile) {
      const indRecord = profile.individualProfile as unknown as Record<
        string,
        unknown
      >;
      if (field in indRecord) {
        const value = indRecord[field];
        if (value instanceof Date) {
          return value.toISOString().split("T")[0];
        }
        return value as string | null | undefined;
      }
    }
    // Check business profile fields
    if (profile.businessProfile) {
      const busRecord = profile.businessProfile as unknown as Record<
        string,
        unknown
      >;
      if (field in busRecord) {
        return busRecord[field] as string | null | undefined;
      }
    }
    return undefined;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-emerald-600 text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enregistré</span>
              </motion.div>
            )}
          </AnimatePresence>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1" />
                )}
                Enregistrer
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {saveError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {saveError}
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-x-8">
          {fields.map((fieldConfig) => {
            const Icon = fieldConfig.icon;
            const value = getFieldValue(fieldConfig.field);
            const currentValue = editedValues[fieldConfig.field] ?? value ?? "";

            if (!isEditing) {
              return (
                <div
                  key={fieldConfig.field}
                  className="py-4 border-b border-slate-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500">
                        {fieldConfig.label}
                      </p>
                      <p className="font-medium text-slate-900">
                        {fieldConfig.type === "date" && value
                          ? new Date(value).toLocaleDateString("fr-FR")
                          : fieldConfig.type === "select" &&
                            fieldConfig.options &&
                            value
                          ? fieldConfig.options.find((o) => o.value === value)
                              ?.label || value
                          : value || (
                              <span className="text-slate-400 font-normal">
                                Non renseigné
                              </span>
                            )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={fieldConfig.field}
                className="py-4 border-b border-slate-100 last:border-0"
              >
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {fieldConfig.label}
                </label>
                {fieldConfig.type === "select" && fieldConfig.options ? (
                  <Select
                    value={currentValue}
                    onValueChange={(val) => handleEdit(fieldConfig.field, val)}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          fieldConfig.placeholder ||
                          `Sélectionner ${fieldConfig.label.toLowerCase()}`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldConfig.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={fieldConfig.type || "text"}
                    value={currentValue}
                    onChange={(e) =>
                      handleEdit(fieldConfig.field, e.target.value)
                    }
                    placeholder={
                      fieldConfig.placeholder ||
                      `Entrer ${fieldConfig.label.toLowerCase()}`
                    }
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsSection({ profile }: { profile: Profile }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Documents de vérification</CardTitle>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {profile.documents && profile.documents.length > 0 ? (
          <div className="space-y-3">
            {profile.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {doc.fileName || doc.fileType}
                    </p>
                    <p className="text-sm text-slate-500">{doc.fileType}</p>
                  </div>
                </div>
                {doc.verified ? (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="warning" className="gap-1">
                    <Clock className="w-3 h-3" />
                    En attente
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 mb-4">Aucun document uploadé</p>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Ajoutez vos documents d&apos;identité pour vérifier votre compte
              et gagner la confiance des utilisateurs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileHeader({ profile }: { profile: Profile }) {
  const { data: session } = useSession();
  const isIndividual = isIndividualProfile(profile);
  const displayName = getProfileDisplayName(profile);
  const verificationStatus =
    profile.profileVerifications?.[0]?.status || VerificationStatus.PENDING;

  // Debug logging
  console.log("ProfileHeader Debug:", {
    profileType: profile.profileType,
    hasIndividualProfile: !!profile.individualProfile,
    hasBusinessProfile: !!profile.businessProfile,
    isIndividual,
    displayName,
  });

  const getStatusConfig = () => {
    switch (verificationStatus) {
      case VerificationStatus.APPROVED:
        return {
          icon: CheckCircle2,
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
      case VerificationStatus.REJECTED:
        return {
          icon: XCircle,
          color: "bg-red-100 text-red-700 border-red-200",
        };
      default:
        return {
          icon: Clock,
          color: "bg-amber-100 text-amber-700 border-amber-200",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="overflow-hidden">
      <div className="h-32 mb-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>

      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
          <div className="relative group w-max">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarFallback
                className={`text-2xl ${
                  isIndividual
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
                } text-white`}
              >
                {isIndividual ? (
                  <User className="w-10 h-10" />
                ) : (
                  <Building2 className="w-10 h-10" />
                )}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold sm:text-slate-50">
                {displayName}
              </h1>
              <Badge className={`${statusConfig.color} gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {getVerificationStatusLabel(verificationStatus)}
              </Badge>
            </div>
            <p className="text-slate-500">
              {isIndividual ? "Compte particulier" : "Compte professionnel"}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {session?.user?.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Membre depuis{" "}
                {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IndividualProfileTabs({
  profile,
  updateProfile,
}: {
  profile: Profile;
  updateProfile: (data: Record<string, string>) => Promise<boolean>;
}) {
  const identityFields: FieldConfig[] = [
    { field: "fullName", label: "Nom complet", icon: User },
    {
      field: "dateOfBirth",
      label: "Date de naissance",
      type: "date",
      icon: Calendar,
    },
    { field: "gender", label: "Genre", type: "select", options: genderOptions },
    {
      field: "nationalIdNumber",
      label: "N° Identité nationale",
      icon: CreditCard,
    },
  ];

  const contactFields: FieldConfig[] = [
    {
      field: "phoneNumber",
      label: "Téléphone",
      type: "tel",
      icon: Phone,
      placeholder: "+243 XXX XXX XXX",
    },
  ];

  const locationFields: FieldConfig[] = [
    {
      field: "country",
      label: "Pays",
      type: "select",
      options: countryOptions,
      icon: Globe,
    },
    { field: "city", label: "Ville", icon: MapPin },
    { field: "address", label: "Adresse complète", icon: MapPin },
  ];

  return (
    <Tabs defaultValue="identity" className="w-full">
      <TabsList className="w-full justify-start mb-6 overflow-x-auto">
        <TabsTrigger value="identity" className="gap-2">
          <User className="w-4 h-4" />
          Identité
        </TabsTrigger>
        <TabsTrigger value="contact" className="gap-2">
          <Phone className="w-4 h-4" />
          Contact
        </TabsTrigger>
        <TabsTrigger value="location" className="gap-2">
          <MapPin className="w-4 h-4" />
          Localisation
        </TabsTrigger>
        <TabsTrigger value="documents" className="gap-2">
          <FileText className="w-4 h-4" />
          Documents
        </TabsTrigger>
      </TabsList>

      <TabsContent value="identity">
        <EditableSection
          tabId="identity"
          title="Informations personnelles"
          fields={identityFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="contact">
        <EditableSection
          tabId="contact"
          title="Coordonnées"
          fields={contactFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="location">
        <EditableSection
          tabId="location"
          title="Adresse"
          fields={locationFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="documents">
        <DocumentsSection profile={profile} />
      </TabsContent>
    </Tabs>
  );
}

function BusinessProfileTabs({
  profile,
  updateProfile,
}: {
  profile: Profile;
  updateProfile: (data: Record<string, string>) => Promise<boolean>;
}) {
  const businessFields: FieldConfig[] = [
    { field: "businessName", label: "Nom de l'entreprise", icon: Building2 },
    {
      field: "legalRepresentativeName",
      label: "Représentant légal",
      icon: User,
    },
  ];

  const legalFields: FieldConfig[] = [
    { field: "registrationNumber", label: "N° RCCM", icon: CreditCard },
    { field: "taxId", label: "N° Identification Fiscale", icon: CreditCard },
  ];

  const contactFields: FieldConfig[] = [
    {
      field: "phoneNumber",
      label: "Téléphone",
      type: "tel",
      icon: Phone,
      placeholder: "+243 XXX XXX XXX",
    },
  ];

  const locationFields: FieldConfig[] = [
    {
      field: "country",
      label: "Pays",
      type: "select",
      options: countryOptions,
      icon: Globe,
    },
    { field: "city", label: "Ville", icon: MapPin },
    { field: "address", label: "Adresse du siège", icon: MapPin },
  ];

  return (
    <Tabs defaultValue="business" className="w-full">
      <TabsList className="w-full justify-start mb-6 overflow-x-auto">
        <TabsTrigger value="business" className="gap-2">
          <Building2 className="w-4 h-4" />
          Entreprise
        </TabsTrigger>
        <TabsTrigger value="legal" className="gap-2">
          <FileText className="w-4 h-4" />
          Documents légaux
        </TabsTrigger>
        <TabsTrigger value="contact" className="gap-2">
          <Phone className="w-4 h-4" />
          Contact
        </TabsTrigger>
        <TabsTrigger value="location" className="gap-2">
          <MapPin className="w-4 h-4" />
          Localisation
        </TabsTrigger>
      </TabsList>

      <TabsContent value="business">
        <EditableSection
          tabId="business"
          title="Informations de l'entreprise"
          fields={businessFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="legal">
        <EditableSection
          tabId="legal"
          title="Documents légaux"
          fields={legalFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="contact">
        <EditableSection
          tabId="contact"
          title="Coordonnées"
          fields={contactFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>

      <TabsContent value="location">
        <EditableSection
          tabId="location"
          title="Adresse du siège"
          fields={locationFields}
          profile={profile}
          updateProfile={updateProfile}
        />
      </TabsContent>
    </Tabs>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function ProfilePage() {
  const { profile, profiles, isLoading, error, updateProfile } = useProfile();
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [selectedProfileType, setSelectedProfileType] =
    useState<ProfileType | null>(null);

  const existingTypes = profiles.map((p) => p.profileType);
  const canAddProfile = profiles.length < 2;

  const handleAddProfile = (type: ProfileType) => {
    setSelectedProfileType(type);
    setShowAddProfileModal(false);
    // Redirect to onboarding with the selected type
    window.location.href = `/onboarding?type=${type.toLowerCase()}&add=true`;
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
            <p className="text-slate-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Erreur</h2>
            <p className="text-slate-600 mb-4">
              {error || "Profil non trouvé"}
            </p>
            <Button onClick={() => window.location.reload()}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <ProfileHeader profile={profile} />

        {/* Profile Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mes profils ({profiles.length})
              </CardTitle>
              {canAddProfile && (
                <Button
                  onClick={() => setShowAddProfileModal(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <User className="w-4 h-4" />
                  Ajouter un profil
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ProfileSwitcher variant="list" />
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        {isIndividualProfile(profile) ? (
          <IndividualProfileTabs
            profile={profile}
            updateProfile={updateProfile}
          />
        ) : isBusinessProfile(profile) ? (
          <BusinessProfileTabs
            profile={profile}
            updateProfile={updateProfile}
          />
        ) : null}

        {/* Profile Roles Manager */}
        <Card>
          <CardContent className="p-6">
            <ProfileRolesManager profile={profile} />
          </CardContent>
        </Card>

        {/* Certification Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  profile.isCertified ? "bg-emerald-100" : "bg-amber-100"
                }`}
              >
                <BadgeCheck
                  className={`w-6 h-6 ${
                    profile.isCertified ? "text-emerald-600" : "text-amber-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {profile.isCertified
                    ? "Profil certifié"
                    : "Profil non certifié"}
                </h3>
                <p className="text-sm text-slate-500">
                  {profile.isCertified
                    ? "Votre profil est complet et vérifié. Vous bénéficiez d'une meilleure visibilité."
                    : `Complétez votre profil à 100% pour obtenir la certification. Progression: ${calculateProfileCompletion(
                        profile
                      )}%`}
                </p>
              </div>
              {!profile.isCertified && (
                <div className="w-24">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all"
                      style={{
                        width: `${calculateProfileCompletion(profile)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  Sécurité du compte
                </h3>
                <p className="text-sm text-slate-500">
                  Gérez votre mot de passe et les paramètres de sécurité
                </p>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline">Paramètres</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Profile Modal */}
      <AddProfileModal
        isOpen={showAddProfileModal}
        onClose={() => setShowAddProfileModal(false)}
        onSelectType={handleAddProfile}
        existingTypes={existingTypes}
      />
    </div>
  );
}

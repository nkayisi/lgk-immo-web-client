/**
 * Types TypeScript pour la gestion des profils.
 * Correspond au schéma Prisma.
 */
import type {
  Profile as PrismaProfile,
  IndividualProfile as PrismaIndividualProfile,
  BusinessProfile as PrismaBusinessProfile,
  ProfileDocument as PrismaProfileDocument,
  ProfileVerification as PrismaProfileVerification,
  ProfileRoleAssignment as PrismaProfileRoleAssignment,
} from "@prisma/client";

import {
  ProfileType,
  Gender,
  DocumentType,
  VerificationStatus,
  ProfileRole,
} from "@prisma/client";

// Re-export enums from Prisma
export { ProfileType, Gender, DocumentType, VerificationStatus, ProfileRole };

// =============================================================================
// USER TYPE
// =============================================================================

export interface UserData {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

// =============================================================================
// PROFILE TYPES
// =============================================================================

export interface IndividualProfileData {
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: Date | null;
  gender: Gender | null;
  nationalIdNumber: string | null;
}

export interface BusinessProfileData {
  businessName: string;
  registrationNumber: string | null;
  taxId: string | null;
  legalRepresentativeName: string | null;
}

export interface ProfileWithDetails extends PrismaProfile {
  user: UserData;
  individualProfile: PrismaIndividualProfile | null;
  businessProfile: PrismaBusinessProfile | null;
  documents: PrismaProfileDocument[];
  profileVerifications: PrismaProfileVerification[];
  profileRoles: PrismaProfileRoleAssignment[];
}

export type Profile = ProfileWithDetails;

// =============================================================================
// INPUT TYPES
// =============================================================================

export interface CreateIndividualProfileInput {
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationalIdNumber?: string;
  roles?: ProfileRole[];
}

export interface CreateBusinessProfileInput {
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  legalRepresentativeName?: string;
  roles?: ProfileRole[];
}

export interface UpdateProfileInput {
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
}

export interface UpdateIndividualProfileInput extends UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationalIdNumber?: string;
}

export interface UpdateBusinessProfileInput extends UpdateProfileInput {
  businessName?: string;
  registrationNumber?: string;
  taxId?: string;
  legalRepresentativeName?: string;
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile: Profile | null;
}

export interface ProfilesResponse {
  success: boolean;
  message: string;
  profiles: Profile[];
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isIndividualProfile(
  profile: Profile
): profile is Profile & { individualProfile: PrismaIndividualProfile } {
  return profile.profileType === ProfileType.INDIVIDUAL && profile.individualProfile !== null;
}

export function isBusinessProfile(
  profile: Profile
): profile is Profile & { businessProfile: PrismaBusinessProfile } {
  return profile.profileType === ProfileType.BUSINESS && profile.businessProfile !== null;
}

// =============================================================================
// HELPERS
// =============================================================================

export function getProfileDisplayName(profile: Profile): string {
  if (isIndividualProfile(profile)) {
    const firstName = profile.individualProfile.firstName || "";
    const lastName = profile.individualProfile.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || profile.user.name || "Utilisateur";
  }
  if (isBusinessProfile(profile)) {
    return profile.businessProfile.businessName || "Entreprise";
  }
  return profile.user.name || "Utilisateur";
}

export function getVerificationStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    [VerificationStatus.PENDING]: "En attente",
    [VerificationStatus.APPROVED]: "Approuvé",
    [VerificationStatus.REJECTED]: "Rejeté",
  };
  return labels[status];
}

export function getGenderLabel(gender: Gender): string {
  const labels: Record<Gender, string> = {
    [Gender.MALE]: "Homme",
    [Gender.FEMALE]: "Femme",
    [Gender.OTHER]: "Autre",
    [Gender.PREFER_NOT_TO_SAY]: "Non précisé",
  };
  return labels[gender];
}

export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    [DocumentType.ID_CARD]: "Carte d'identité",
    [DocumentType.PASSPORT]: "Passeport",
    [DocumentType.COMPANY_REGISTRATION]: "Registre de commerce",
    [DocumentType.TAX_CERTIFICATE]: "Attestation fiscale",
    [DocumentType.PROFILE_PHOTO]: "Photo de profil",
    [DocumentType.PROOF_OF_ADDRESS]: "Justificatif de domicile",
    [DocumentType.OTHER]: "Autre",
  };
  return labels[type];
}

export function getProfileRoleLabel(role: ProfileRole): string {
  const labels: Record<ProfileRole, string> = {
    [ProfileRole.TENANT]: "Locataire",
    [ProfileRole.LANDLORD]: "Bailleur",
    [ProfileRole.AGENT]: "Commissionnaire",
  };
  return labels[role];
}

export function getProfileTypeLabel(type: ProfileType): string {
  const labels: Record<ProfileType, string> = {
    [ProfileType.INDIVIDUAL]: "Particulier",
    [ProfileType.BUSINESS]: "Professionnel",
  };
  return labels[type];
}

/**
 * Calcule le pourcentage de complétion du profil.
 * Un profil est certifié si complété à 100%.
 */
export function calculateProfileCompletion(profile: Profile): number {
  const baseFields = [
    profile.phoneNumber,
    profile.country,
    profile.city,
    profile.address,
  ];

  let specificFields: (string | Date | Gender | null | undefined)[] = [];

  if (isIndividualProfile(profile)) {
    const { firstName, lastName, dateOfBirth, gender } = profile.individualProfile;
    specificFields = [firstName, lastName, dateOfBirth, gender];
  } else if (isBusinessProfile(profile)) {
    const { businessName, registrationNumber, taxId, legalRepresentativeName } =
      profile.businessProfile;
    specificFields = [businessName, registrationNumber, taxId, legalRepresentativeName];
  }

  const allFields = [...baseFields, ...specificFields];
  const filledFields = allFields.filter((field) => field !== null && field !== undefined && field !== "");
  
  return Math.round((filledFields.length / allFields.length) * 100);
}

/**
 * Vérifie si un profil est complet (certifiable).
 */
export function isProfileComplete(profile: Profile): boolean {
  return calculateProfileCompletion(profile) === 100;
}

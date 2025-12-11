/**
 * Types TypeScript pour le service Profile.
 * Correspond au schéma GraphQL du backend.
 */

// =============================================================================
// ENUMS
// =============================================================================

export enum ProfileType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum DocumentType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  COMPANY_REGISTRATION = 'COMPANY_REGISTRATION',
  TAX_CERTIFICATE = 'TAX_CERTIFICATE',
  PROFILE_PHOTO = 'PROFILE_PHOTO',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  OTHER = 'OTHER',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

// =============================================================================
// TYPES DE BASE
// =============================================================================

export interface ProfileDocument {
  id: string;
  profileId: string;
  fileType: DocumentType;
  fileName: string | null;
  url: string;
  verified: boolean;
  uploadedAt: string;
}

export interface ProfileVerification {
  id: string;
  profileId: string;
  status: VerificationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
}

// =============================================================================
// TYPES DE PROFIL
// =============================================================================

export interface BaseProfile {
  id: string;
  externalUserId: string;
  profileType: ProfileType;
  phoneNumber: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  documents: ProfileDocument[];
  verifications: ProfileVerification[];
}

export interface IndividualProfile extends BaseProfile {
  profileType: ProfileType.INDIVIDUAL;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: Gender | null;
  nationalIdNumber: string | null;
  fullName: string | null;
}

export interface BusinessProfile extends BaseProfile {
  profileType: ProfileType.BUSINESS;
  businessName: string;
  registrationNumber: string | null;
  taxId: string | null;
  legalRepresentativeName: string | null;
}

export type Profile = IndividualProfile | BusinessProfile;

// =============================================================================
// INPUTS
// =============================================================================

export interface CreateIndividualProfileInput {
  externalUserId: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationalIdNumber?: string;
}

export interface CreateBusinessProfileInput {
  externalUserId: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  businessName: string;
  registrationNumber?: string;
  taxId?: string;
  legalRepresentativeName?: string;
}

export interface UpdateIndividualProfileInput {
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  nationalIdNumber?: string;
}

export interface UpdateBusinessProfileInput {
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  businessName?: string;
  registrationNumber?: string;
  taxId?: string;
  legalRepresentativeName?: string;
}

export interface UploadDocumentInput {
  profileId: string;
  fileType: DocumentType;
  fileName?: string;
  url: string;
}

export interface ProfileFilterInput {
  profileType?: ProfileType;
  country?: string;
  city?: string;
  verificationStatus?: VerificationStatus;
  search?: string;
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

// =============================================================================
// RÉPONSES
// =============================================================================

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile: Profile | null;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  document: ProfileDocument | null;
}

export interface ProfileListResponse {
  profiles: Profile[];
  totalCount: number;
  hasNextPage: boolean;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isIndividualProfile(profile: Profile): profile is IndividualProfile {
  return profile.profileType === ProfileType.INDIVIDUAL;
}

export function isBusinessProfile(profile: Profile): profile is BusinessProfile {
  return profile.profileType === ProfileType.BUSINESS;
}

// =============================================================================
// HELPERS
// =============================================================================

export function getProfileDisplayName(profile: Profile): string {
  if (isIndividualProfile(profile)) {
    return profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Utilisateur';
  }
  return profile.businessName;
}

export function getVerificationStatusLabel(status: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    [VerificationStatus.PENDING]: 'En attente',
    [VerificationStatus.APPROVED]: 'Approuvé',
    [VerificationStatus.REJECTED]: 'Rejeté',
  };
  return labels[status];
}

export function getGenderLabel(gender: Gender): string {
  const labels: Record<Gender, string> = {
    [Gender.MALE]: 'Homme',
    [Gender.FEMALE]: 'Femme',
    [Gender.OTHER]: 'Autre',
    [Gender.PREFER_NOT_TO_SAY]: 'Non précisé',
  };
  return labels[gender];
}

export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    [DocumentType.ID_CARD]: "Carte d'identité",
    [DocumentType.PASSPORT]: 'Passeport',
    [DocumentType.COMPANY_REGISTRATION]: "Registre de commerce",
    [DocumentType.TAX_CERTIFICATE]: 'Attestation fiscale',
    [DocumentType.PROFILE_PHOTO]: 'Photo de profil',
    [DocumentType.PROOF_OF_ADDRESS]: 'Justificatif de domicile',
    [DocumentType.OTHER]: 'Autre',
  };
  return labels[type];
}

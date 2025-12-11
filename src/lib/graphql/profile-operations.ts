/**
 * Opérations GraphQL pour le service Profile.
 * Queries et Mutations typées.
 */
import { gql } from 'urql';

// =============================================================================
// FRAGMENTS
// =============================================================================

export const PROFILE_DOCUMENT_FRAGMENT = gql`
  fragment ProfileDocumentFields on ProfileDocumentType {
    id
    profileId
    fileType
    fileName
    url
    verified
    uploadedAt
  }
`;

export const PROFILE_VERIFICATION_FRAGMENT = gql`
  fragment ProfileVerificationFields on ProfileVerificationType {
    id
    profileId
    status
    reviewedBy
    reviewedAt
    notes
    createdAt
  }
`;

export const INDIVIDUAL_PROFILE_FRAGMENT = gql`
  fragment IndividualProfileFields on IndividualProfileType {
    id
    externalUserId
    profileType
    phoneNumber
    country
    city
    address
    createdAt
    updatedAt
    firstName
    lastName
    dateOfBirth
    gender
    nationalIdNumber
    fullName
    documents {
      ...ProfileDocumentFields
    }
    verifications {
      ...ProfileVerificationFields
    }
  }
  ${PROFILE_DOCUMENT_FRAGMENT}
  ${PROFILE_VERIFICATION_FRAGMENT}
`;

export const BUSINESS_PROFILE_FRAGMENT = gql`
  fragment BusinessProfileFields on BusinessProfileType {
    id
    externalUserId
    profileType
    phoneNumber
    country
    city
    address
    createdAt
    updatedAt
    businessName
    registrationNumber
    taxId
    legalRepresentativeName
    documents {
      ...ProfileDocumentFields
    }
    verifications {
      ...ProfileVerificationFields
    }
  }
  ${PROFILE_DOCUMENT_FRAGMENT}
  ${PROFILE_VERIFICATION_FRAGMENT}
`;

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère un profil par son ID
 */
export const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    profile(id: $id) {
      ... on IndividualProfileType {
        ...IndividualProfileFields
      }
      ... on BusinessProfileType {
        ...BusinessProfileFields
      }
    }
  }
  ${INDIVIDUAL_PROFILE_FRAGMENT}
  ${BUSINESS_PROFILE_FRAGMENT}
`;

/**
 * Récupère un profil par l'ID utilisateur externe
 */
export const GET_PROFILE_BY_USER = gql`
  query GetProfileByUser($externalUserId: ID!) {
    profileByUser(externalUserId: $externalUserId) {
      ... on IndividualProfileType {
        ...IndividualProfileFields
      }
      ... on BusinessProfileType {
        ...BusinessProfileFields
      }
    }
  }
  ${INDIVIDUAL_PROFILE_FRAGMENT}
  ${BUSINESS_PROFILE_FRAGMENT}
`;

/**
 * Liste des profils avec filtres
 */
export const GET_PROFILES = gql`
  query GetProfiles($filter: ProfileFilterInput, $pagination: PaginationInput) {
    profiles(filter: $filter, pagination: $pagination) {
      profiles {
        ... on IndividualProfileType {
          ...IndividualProfileFields
        }
        ... on BusinessProfileType {
          ...BusinessProfileFields
        }
      }
      totalCount
      hasNextPage
    }
  }
  ${INDIVIDUAL_PROFILE_FRAGMENT}
  ${BUSINESS_PROFILE_FRAGMENT}
`;

/**
 * Récupère les documents d'un profil
 */
export const GET_PROFILE_DOCUMENTS = gql`
  query GetProfileDocuments($profileId: ID!) {
    profileDocuments(profileId: $profileId) {
      ...ProfileDocumentFields
    }
  }
  ${PROFILE_DOCUMENT_FRAGMENT}
`;

/**
 * Récupère la dernière vérification d'un profil
 */
export const GET_LATEST_VERIFICATION = gql`
  query GetLatestVerification($profileId: ID!) {
    latestVerification(profileId: $profileId) {
      ...ProfileVerificationFields
    }
  }
  ${PROFILE_VERIFICATION_FRAGMENT}
`;

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Crée un profil individuel
 */
export const CREATE_INDIVIDUAL_PROFILE = gql`
  mutation CreateIndividualProfile($input: CreateIndividualProfileInput!) {
    createIndividualProfile(input: $input) {
      success
      message
      profile {
        ... on IndividualProfileType {
          ...IndividualProfileFields
        }
      }
    }
  }
  ${INDIVIDUAL_PROFILE_FRAGMENT}
`;

/**
 * Crée un profil entreprise
 */
export const CREATE_BUSINESS_PROFILE = gql`
  mutation CreateBusinessProfile($input: CreateBusinessProfileInput!) {
    createBusinessProfile(input: $input) {
      success
      message
      profile {
        ... on BusinessProfileType {
          ...BusinessProfileFields
        }
      }
    }
  }
  ${BUSINESS_PROFILE_FRAGMENT}
`;

/**
 * Met à jour un profil individuel
 */
export const UPDATE_INDIVIDUAL_PROFILE = gql`
  mutation UpdateIndividualProfile($id: ID!, $input: UpdateIndividualProfileInput!) {
    updateIndividualProfile(id: $id, input: $input) {
      success
      message
      profile {
        ... on IndividualProfileType {
          ...IndividualProfileFields
        }
      }
    }
  }
  ${INDIVIDUAL_PROFILE_FRAGMENT}
`;

/**
 * Met à jour un profil entreprise
 */
export const UPDATE_BUSINESS_PROFILE = gql`
  mutation UpdateBusinessProfile($id: ID!, $input: UpdateBusinessProfileInput!) {
    updateBusinessProfile(id: $id, input: $input) {
      success
      message
      profile {
        ... on BusinessProfileType {
          ...BusinessProfileFields
        }
      }
    }
  }
  ${BUSINESS_PROFILE_FRAGMENT}
`;

/**
 * Supprime un profil
 */
export const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      success
      message
    }
  }
`;

/**
 * Upload un document
 */
export const UPLOAD_DOCUMENT = gql`
  mutation UploadProfileDocument($input: UploadDocumentInput!) {
    uploadProfileDocument(input: $input) {
      success
      message
      document {
        ...ProfileDocumentFields
      }
    }
  }
  ${PROFILE_DOCUMENT_FRAGMENT}
`;

/**
 * Supprime un document
 */
export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($documentId: ID!) {
    deleteDocument(documentId: $documentId) {
      success
      message
    }
  }
`;

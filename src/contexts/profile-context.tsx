"use client";

/**
 * Contexte React pour la gestion du profil utilisateur.
 * Fournit l'état du profil et les méthodes de manipulation.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Provider as UrqlProvider, useQuery, useMutation } from "urql";
import { useSession } from "@/lib/auth-client";
import { profileClient } from "@/lib/graphql/client";
import {
  Profile,
  CreateIndividualProfileInput,
  CreateBusinessProfileInput,
  UpdateIndividualProfileInput,
  UpdateBusinessProfileInput,
  isIndividualProfile,
  isBusinessProfile,
} from "@/lib/graphql/types";
import {
  GET_PROFILE_BY_USER,
  CREATE_INDIVIDUAL_PROFILE,
  CREATE_BUSINESS_PROFILE,
  UPDATE_INDIVIDUAL_PROFILE,
  UPDATE_BUSINESS_PROFILE,
} from "@/lib/graphql/profile-operations";

// =============================================================================
// TYPES
// =============================================================================

interface ProfileContextValue {
  // État
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  hasProfile: boolean;
  needsOnboarding: boolean;

  // Actions
  refetchProfile: () => void;
  createIndividualProfile: (
    input: Omit<CreateIndividualProfileInput, "externalUserId">
  ) => Promise<boolean>;
  createBusinessProfile: (
    input: Omit<CreateBusinessProfileInput, "externalUserId">
  ) => Promise<boolean>;
  updateProfile: (
    input: UpdateIndividualProfileInput | UpdateBusinessProfileInput
  ) => Promise<boolean>;

  // Helpers
  isIndividual: boolean;
  isBusiness: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// =============================================================================
// PROVIDER INTERNE (avec urql hooks)
// =============================================================================

function ProfileProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionLoading } = useSession();
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user?.id;

  // Query pour récupérer le profil
  const [{ data, fetching, error: queryError }, refetch] = useQuery({
    query: GET_PROFILE_BY_USER,
    variables: { externalUserId: userId },
    pause: !userId,
  });

  // Mutations
  const [, createIndividualMutation] = useMutation(CREATE_INDIVIDUAL_PROFILE);
  const [, createBusinessMutation] = useMutation(CREATE_BUSINESS_PROFILE);
  const [, updateIndividualMutation] = useMutation(UPDATE_INDIVIDUAL_PROFILE);
  const [, updateBusinessMutation] = useMutation(UPDATE_BUSINESS_PROFILE);

  // État dérivé
  const profile = data?.profileByUser as Profile | null;
  const isLoading = sessionLoading || fetching;
  const hasProfile = !!profile;
  const needsOnboarding =
    !sessionLoading && !!session?.user && !fetching && !profile;

  // Gestion des erreurs - utiliser useMemo pour dériver l'erreur
  const derivedError = queryError ? queryError.message : null;

  // Log l'erreur si elle existe
  if (queryError) {
    console.error("[Profile] Query error:", queryError);
  }

  // Créer un profil individuel
  const createIndividualProfile = useCallback(
    async (
      input: Omit<CreateIndividualProfileInput, "externalUserId">
    ): Promise<boolean> => {
      if (!userId) {
        setError("Utilisateur non connecté");
        return false;
      }

      setError(null);
      const result = await createIndividualMutation({
        input: { ...input, externalUserId: userId },
      });

      if (result.error) {
        setError(result.error.message);
        return false;
      }

      if (!result.data?.createIndividualProfile?.success) {
        setError(
          result.data?.createIndividualProfile?.message ||
            "Erreur lors de la création"
        );
        return false;
      }

      refetch({ requestPolicy: "network-only" });
      return true;
    },
    [userId, createIndividualMutation, refetch]
  );

  // Créer un profil business
  const createBusinessProfile = useCallback(
    async (
      input: Omit<CreateBusinessProfileInput, "externalUserId">
    ): Promise<boolean> => {
      if (!userId) {
        setError("Utilisateur non connecté");
        return false;
      }

      setError(null);
      const result = await createBusinessMutation({
        input: { ...input, externalUserId: userId },
      });

      if (result.error) {
        setError(result.error.message);
        return false;
      }

      if (!result.data?.createBusinessProfile?.success) {
        setError(
          result.data?.createBusinessProfile?.message ||
            "Erreur lors de la création"
        );
        return false;
      }

      refetch({ requestPolicy: "network-only" });
      return true;
    },
    [userId, createBusinessMutation, refetch]
  );

  // Mettre à jour le profil
  const updateProfile = useCallback(
    async (
      input: UpdateIndividualProfileInput | UpdateBusinessProfileInput
    ): Promise<boolean> => {
      if (!profile) {
        setError("Aucun profil à mettre à jour");
        return false;
      }

      setError(null);

      if (isIndividualProfile(profile)) {
        const result = await updateIndividualMutation({
          id: profile.id,
          input: input as UpdateIndividualProfileInput,
        });

        if (result.error) {
          setError(result.error.message);
          return false;
        }

        if (!result.data?.updateIndividualProfile?.success) {
          setError(
            result.data?.updateIndividualProfile?.message ||
              "Erreur lors de la mise à jour"
          );
          return false;
        }
      } else if (isBusinessProfile(profile)) {
        const result = await updateBusinessMutation({
          id: profile.id,
          input: input as UpdateBusinessProfileInput,
        });

        if (result.error) {
          setError(result.error.message);
          return false;
        }

        if (!result.data?.updateBusinessProfile?.success) {
          setError(
            result.data?.updateBusinessProfile?.message ||
              "Erreur lors de la mise à jour"
          );
          return false;
        }
      }

      refetch({ requestPolicy: "network-only" });
      return true;
    },
    [profile, updateIndividualMutation, updateBusinessMutation, refetch]
  );

  const value: ProfileContextValue = {
    profile,
    isLoading,
    error: error || derivedError,
    hasProfile,
    needsOnboarding,
    refetchProfile: () => refetch({ requestPolicy: "network-only" }),
    createIndividualProfile,
    createBusinessProfile,
    updateProfile,
    isIndividual: profile ? isIndividualProfile(profile) : false,
    isBusiness: profile ? isBusinessProfile(profile) : false,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// =============================================================================
// PROVIDER PRINCIPAL (avec urql Provider)
// =============================================================================

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  return (
    <UrqlProvider value={profileClient}>
      <ProfileProviderInner>{children}</ProfileProviderInner>
    </UrqlProvider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

// =============================================================================
// HOOK POUR VÉRIFIER SI L'UTILISATEUR A UN PROFIL
// =============================================================================

export function useRequireProfile() {
  const { hasProfile, needsOnboarding, isLoading } = useProfile();

  return {
    hasProfile,
    needsOnboarding,
    isLoading,
    shouldRedirectToOnboarding: !isLoading && needsOnboarding,
  };
}

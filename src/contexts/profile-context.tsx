"use client";

/**
 * Contexte React pour la gestion du profil utilisateur.
 * Utilise les Server Actions pour la communication avec la base de données.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useTransition,
} from "react";
import { useSession } from "@/lib/auth-client";
import {
  type Profile,
  type CreateIndividualProfileInput,
  type CreateBusinessProfileInput,
  type UpdateIndividualProfileInput,
  type UpdateBusinessProfileInput,
  ProfileType,
  isIndividualProfile,
  isBusinessProfile,
} from "@/lib/profile/types";
import {
  getActiveProfile,
  getUserProfiles,
  createIndividualProfile as createIndividualAction,
  createBusinessProfile as createBusinessAction,
  updateIndividualProfile as updateIndividualAction,
  updateBusinessProfile as updateBusinessAction,
  switchActiveProfile as switchProfileAction,
} from "@/lib/profile/actions";

// =============================================================================
// TYPES
// =============================================================================

interface ProfileContextValue {
  // État
  profile: Profile | null;
  profiles: Profile[];
  isLoading: boolean;
  error: string | null;
  hasProfile: boolean;
  needsOnboarding: boolean;

  // Actions
  refetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  createIndividualProfile: (
    input: CreateIndividualProfileInput
  ) => Promise<boolean>;
  createBusinessProfile: (
    input: CreateBusinessProfileInput
  ) => Promise<boolean>;
  updateProfile: (
    input: UpdateIndividualProfileInput | UpdateBusinessProfileInput
  ) => Promise<boolean>;
  switchProfile: (profileId: string) => Promise<boolean>;

  // Helpers
  isIndividual: boolean;
  isBusiness: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [isPending, startTransition] = useTransition();

  const userId = session?.user?.id;

  // Charger les profils au montage et quand l'utilisateur change
  const loadProfiles = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setProfiles([]);
      setIsLoadingProfiles(false);
      return;
    }

    setIsLoadingProfiles(true);
    setError(null);

    try {
      const [activeResult, allResult] = await Promise.all([
        getActiveProfile(),
        getUserProfiles(),
      ]);

      if (activeResult.success && activeResult.profile) {
        setProfile(activeResult.profile);
      } else {
        setProfile(null);
      }

      if (allResult.success) {
        setProfiles(allResult.profiles);
      }
    } catch (err) {
      console.error("[Profile] Error loading profiles:", err);
      setError("Erreur lors du chargement des profils");
    } finally {
      setIsLoadingProfiles(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!sessionLoading) {
      loadProfiles();
    }
  }, [sessionLoading, loadProfiles]);

  // État dérivé
  const isLoading = sessionLoading || isLoadingProfiles || isPending;
  const hasProfile = profiles.length > 0;
  const needsOnboarding =
    !sessionLoading && !!session?.user && !isLoadingProfiles && !hasProfile;

  // Créer un profil individuel
  const createIndividualProfile = useCallback(
    async (input: CreateIndividualProfileInput): Promise<boolean> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await createIndividualAction(input);

          if (!result.success) {
            setError(result.message);
            resolve(false);
            return;
          }

          await loadProfiles();
          resolve(true);
        });
      });
    },
    [loadProfiles]
  );

  // Créer un profil business
  const createBusinessProfile = useCallback(
    async (input: CreateBusinessProfileInput): Promise<boolean> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await createBusinessAction(input);

          if (!result.success) {
            setError(result.message);
            resolve(false);
            return;
          }

          await loadProfiles();
          resolve(true);
        });
      });
    },
    [loadProfiles]
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

      return new Promise((resolve) => {
        startTransition(async () => {
          let result;

          if (profile.profileType === ProfileType.INDIVIDUAL) {
            result = await updateIndividualAction(
              profile.id,
              input as UpdateIndividualProfileInput
            );
          } else {
            result = await updateBusinessAction(
              profile.id,
              input as UpdateBusinessProfileInput
            );
          }

          if (!result.success) {
            setError(result.message);
            resolve(false);
            return;
          }

          if (result.profile) {
            setProfile(result.profile);
            setProfiles((prev) =>
              prev.map((p) =>
                p.id === result.profile!.id ? result.profile! : p
              )
            );
          }

          resolve(true);
        });
      });
    },
    [profile]
  );

  // Changer de profil actif
  const switchProfile = useCallback(
    async (profileId: string): Promise<boolean> => {
      setError(null);

      return new Promise((resolve) => {
        startTransition(async () => {
          const result = await switchProfileAction(profileId);

          if (!result.success) {
            setError(result.message);
            resolve(false);
            return;
          }

          if (result.profile) {
            setProfile(result.profile);
          }

          resolve(true);
        });
      });
    },
    []
  );

  const value: ProfileContextValue = {
    profile,
    profiles,
    isLoading,
    error,
    hasProfile,
    needsOnboarding,
    refetchProfile: loadProfiles,
    refreshProfile: loadProfiles, // Alias pour refetchProfile
    createIndividualProfile,
    createBusinessProfile,
    updateProfile,
    switchProfile,
    isIndividual: profile ? isIndividualProfile(profile) : false,
    isBusiness: profile ? isBusinessProfile(profile) : false,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

/**
 * Version safe de useProfile qui retourne null si le contexte n'est pas disponible.
 * Utile pour les composants qui peuvent être rendus en dehors du ProfileProvider.
 */
export function useProfileSafe(): ProfileContextValue | null {
  const context = useContext(ProfileContext);
  return context;
}

export function useRequireProfile() {
  const { hasProfile, needsOnboarding, isLoading } = useProfile();

  return {
    hasProfile,
    needsOnboarding,
    isLoading,
    shouldRedirectToOnboarding: !isLoading && needsOnboarding,
  };
}

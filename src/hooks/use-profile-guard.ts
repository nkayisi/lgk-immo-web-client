"use client";

/**
 * Hook pour protéger les routes nécessitant un profil.
 * Redirige vers l'onboarding si l'utilisateur n'a pas de profil.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/contexts/profile-context';

interface UseProfileGuardOptions {
  redirectTo?: string;
  enabled?: boolean;
}

export function useProfileGuard(options: UseProfileGuardOptions = {}) {
  const { redirectTo = '/onboarding', enabled = true } = options;
  const router = useRouter();
  const { hasProfile, needsOnboarding, isLoading } = useProfile();

  useEffect(() => {
    if (!enabled) return;
    
    if (!isLoading && needsOnboarding) {
      router.push(redirectTo);
    }
  }, [enabled, isLoading, needsOnboarding, redirectTo, router]);

  return {
    isLoading,
    hasProfile,
    needsOnboarding,
    isReady: !isLoading && hasProfile,
  };
}

/**
 * Hook pour rediriger les utilisateurs avec profil hors de l'onboarding.
 */
export function useOnboardingGuard(redirectTo: string = '/dashboard') {
  const router = useRouter();
  const { hasProfile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && hasProfile) {
      router.push(redirectTo);
    }
  }, [isLoading, hasProfile, redirectTo, router]);

  return {
    isLoading,
    hasProfile,
    shouldShowOnboarding: !isLoading && !hasProfile,
  };
}

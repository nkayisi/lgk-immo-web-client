"use server";

/**
 * Server action pour s'assurer qu'un utilisateur a un profil.
 * Appelé après la connexion/inscription pour créer automatiquement
 * un profil minimal si nécessaire.
 */

import { autoCreateProfile, ensureUserHasProfile } from "./auto-create";
import { ProfileType } from "@prisma/client";

interface EnsureProfileParams {
  userId: string;
  email: string;
  name?: string;
  profileType?: ProfileType;
}

/**
 * S'assure qu'un utilisateur a un profil et le crée si nécessaire.
 * Retourne true si le profil existe ou a été créé avec succès.
 */
export async function ensureProfileAction(
  params: EnsureProfileParams
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("[EnsureProfile] Params received:", {
      userId: params.userId,
      email: params.email,
      name: params.name,
      profileType: params.profileType,
    });

    const hasProfile = await ensureUserHasProfile(params.userId);
    
    if (!hasProfile) {
      const typeToUse = params.profileType || ProfileType.INDIVIDUAL;
      console.log("[EnsureProfile] Creating profile with type:", typeToUse);
      
      await autoCreateProfile({
        userId: params.userId,
        email: params.email,
        name: params.name,
        profileType: typeToUse,
      });
    } else {
      console.log("[EnsureProfile] User already has a profile, skipping creation");
    }

    return { success: true };
  } catch (error) {
    console.error("[EnsureProfile] Erreur:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Auto-création de profil lors de la création de compte.
 * Ce module est appelé par les hooks better-auth pour créer
 * automatiquement un profil minimal lors de l'inscription.
 */

import { prisma } from "@/lib/prisma";
import { ProfileType } from "@prisma/client";

interface CreateProfileParams {
  userId: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  profileType?: ProfileType;
}

/**
 * Crée un profil minimal automatiquement lors de la création d'un compte.
 * Le profil peut être complété plus tard par l'utilisateur.
 */
export async function autoCreateProfile({
  userId,
  email,
  name,
  firstName,
  lastName,
  businessName,
  profileType = ProfileType.INDIVIDUAL,
}: CreateProfileParams): Promise<void> {
  try {
    console.log("[AutoProfile] Starting profile creation with:", {
      userId,
      email,
      name,
      firstName,
      lastName,
      businessName,
      profileType,
    });

    // Vérifier si l'utilisateur existe dans la base de données
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      console.error(
        `[AutoProfile] User ${userId} n'existe pas dans la base de données, impossible de créer le profil`
      );
      return;
    }

    // Vérifier si l'utilisateur a déjà un profil
    const existingProfile = await prisma.profile.findFirst({
      where: { userId },
    });

    if (existingProfile) {
      console.log(
        `[AutoProfile] User ${userId} a déjà un profil (type: ${existingProfile.profileType}), skip auto-create`
      );
      return;
    }

    console.log(`[AutoProfile] Creating profile with type: ${profileType}`);

    // Créer le profil de base
    const profile = await prisma.profile.create({
      data: {
        userId,
        profileType,
        isCertified: false,
      },
    });

    console.log(`[AutoProfile] Profile created with ID: ${profile.id}, type: ${profile.profileType}`);

    // Créer les données spécifiques selon le type
    if (profileType === ProfileType.INDIVIDUAL) {
      await prisma.individualProfile.create({
        data: {
          profile: {
            connect: { id: profile.id },
          },
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });
    } else if (profileType === ProfileType.BUSINESS) {
      await prisma.businessProfile.create({
        data: {
          profile: {
            connect: { id: profile.id },
          },
          businessName: businessName || name || null,
        },
      });
    }

    // Mettre à jour l'utilisateur avec le profil actif
    await prisma.user.update({
      where: { id: userId },
      data: { activeProfileId: profile.id },
    });

    console.log(
      `[AutoProfile] Profil ${profileType} créé automatiquement pour user ${userId}`
    );
  } catch (error) {
    console.error(
      `[AutoProfile] Erreur lors de la création du profil pour user ${userId}:`,
      error
    );
    // Ne pas propager l'erreur pour ne pas bloquer la création du compte
  }
}

/**
 * Vérifie si un utilisateur a un profil et le crée si nécessaire.
 * Utile pour les comptes OAuth créés avant l'implémentation de l'auto-création.
 */
export async function ensureUserHasProfile(
  userId: string
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: true,
      },
    });

    if (!user) {
      return false;
    }

    if (user.profiles.length === 0) {
      // Aucun profil n'existe encore
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      `[AutoProfile] Erreur lors de la vérification du profil pour user ${userId}:`,
      error
    );
    return false;
  }
}

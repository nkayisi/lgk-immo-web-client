"use server";

/**
 * Server Actions pour la gestion des profils utilisateurs.
 */
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ProfileType,
  ProfileRole,
  type CreateIndividualProfileInput,
  type CreateBusinessProfileInput,
  type UpdateIndividualProfileInput,
  type UpdateBusinessProfileInput,
  type ProfileResponse,
  type ProfilesResponse,
  type Profile,
  calculateProfileCompletion,
} from "./types";

// =============================================================================
// HELPERS
// =============================================================================

async function getCurrentUserId(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user?.id || null;
}

const profileInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
    },
  },
  individualProfile: true,
  businessProfile: true,
  documents: true,
  profileVerifications: {
    orderBy: { createdAt: "desc" as const },
    take: 1,
  },
  profileRoles: true,
};

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Récupère tous les profils de l'utilisateur connecté.
 */
export async function getUserProfiles(): Promise<ProfilesResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profiles: [] };
    }

    const profiles = await prisma.profile.findMany({
      where: { userId },
      include: profileInclude,
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      message: "Profils récupérés",
      profiles: profiles as Profile[],
    };
  } catch (error) {
    console.error("[Profile] Error fetching profiles:", error);
    return { success: false, message: "Erreur lors de la récupération", profiles: [] };
  }
}

/**
 * Récupère un profil par son ID.
 */
export async function getProfileById(profileId: string): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId },
      include: profileInclude,
    });

    if (!profile) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    return {
      success: true,
      message: "Profil récupéré",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error fetching profile:", error);
    return { success: false, message: "Erreur lors de la récupération", profile: null };
  }
}

/**
 * Récupère le profil actif de l'utilisateur.
 */
export async function getActiveProfile(): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (user?.activeProfileId) {
      const profile = await prisma.profile.findFirst({
        where: { id: user.activeProfileId, userId },
        include: profileInclude,
      });

      if (profile) {
        return {
          success: true,
          message: "Profil actif récupéré",
          profile: profile as Profile,
        };
      }
    }

    // Si pas de profil actif, retourner le premier profil
    const firstProfile = await prisma.profile.findFirst({
      where: { userId },
      include: profileInclude,
      orderBy: { createdAt: "asc" },
    });

    if (firstProfile) {
      // Mettre à jour le profil actif
      await prisma.user.update({
        where: { id: userId },
        data: { activeProfileId: firstProfile.id },
      });

      return {
        success: true,
        message: "Profil actif récupéré",
        profile: firstProfile as Profile,
      };
    }

    return { success: false, message: "Aucun profil trouvé", profile: null };
  } catch (error) {
    console.error("[Profile] Error fetching active profile:", error);
    return { success: false, message: "Erreur lors de la récupération", profile: null };
  }
}

/**
 * Vérifie si l'utilisateur a au moins un profil.
 */
export async function hasProfile(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return false;

    const count = await prisma.profile.count({
      where: { userId },
    });

    return count > 0;
  } catch (error) {
    console.error("[Profile] Error checking profile:", error);
    return false;
  }
}

// =============================================================================
// MUTATIONS - CREATE
// =============================================================================

/**
 * Crée un profil individuel (particulier).
 */
export async function createIndividualProfile(
  input: CreateIndividualProfileInput
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier si l'utilisateur a déjà un profil individuel
    const existingIndividual = await prisma.profile.findFirst({
      where: { userId, profileType: ProfileType.INDIVIDUAL },
    });

    if (existingIndividual) {
      return {
        success: false,
        message: "Vous avez déjà un profil particulier",
        profile: null,
      };
    }

    const profile = await prisma.$transaction(async (tx) => {
      // Créer le profil de base
      const newProfile = await tx.profile.create({
        data: {
          userId,
          profileType: ProfileType.INDIVIDUAL,
          phoneNumber: input.phoneNumber,
          country: input.country,
          city: input.city,
          address: input.address,
          individualProfile: {
            create: {
              firstName: input.firstName,
              lastName: input.lastName,
              dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
              gender: input.gender,
              nationalIdNumber: input.nationalIdNumber,
            },
          },
        },
        include: profileInclude,
      });

      // Ajouter les rôles si spécifiés
      if (input.roles && input.roles.length > 0) {
        await tx.profileRoleAssignment.createMany({
          data: input.roles.map((role) => ({
            profileId: newProfile.id,
            role,
          })),
        });
      }

      // Mettre à jour le profil actif si c'est le premier profil
      const profileCount = await tx.profile.count({ where: { userId } });
      if (profileCount === 1) {
        await tx.user.update({
          where: { id: userId },
          data: { activeProfileId: newProfile.id },
        });
      }

      // Récupérer le profil complet avec les rôles
      return await tx.profile.findUnique({
        where: { id: newProfile.id },
        include: profileInclude,
      });
    });

    // Mettre à jour la certification
    if (profile) {
      await updateProfileCertification(profile.id);
    }

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Profil particulier créé avec succès",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error creating individual profile:", error);
    return {
      success: false,
      message: "Erreur lors de la création du profil",
      profile: null,
    };
  }
}

/**
 * Crée un profil business (professionnel).
 */
export async function createBusinessProfile(
  input: CreateBusinessProfileInput
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier si l'utilisateur a déjà un profil business
    const existingBusiness = await prisma.profile.findFirst({
      where: { userId, profileType: ProfileType.BUSINESS },
    });

    if (existingBusiness) {
      return {
        success: false,
        message: "Vous avez déjà un profil professionnel",
        profile: null,
      };
    }

    const profile = await prisma.$transaction(async (tx) => {
      // Créer le profil de base
      const newProfile = await tx.profile.create({
        data: {
          userId,
          profileType: ProfileType.BUSINESS,
          phoneNumber: input.phoneNumber,
          country: input.country,
          city: input.city,
          address: input.address,
          businessProfile: {
            create: {
              businessName: input.businessName,
              registrationNumber: input.registrationNumber,
              taxId: input.taxId,
              legalRepresentativeName: input.legalRepresentativeName,
            },
          },
        },
        include: profileInclude,
      });

      // Ajouter les rôles si spécifiés
      if (input.roles && input.roles.length > 0) {
        await tx.profileRoleAssignment.createMany({
          data: input.roles.map((role) => ({
            profileId: newProfile.id,
            role,
          })),
        });
      }

      // Mettre à jour le profil actif si c'est le premier profil
      const profileCount = await tx.profile.count({ where: { userId } });
      if (profileCount === 1) {
        await tx.user.update({
          where: { id: userId },
          data: { activeProfileId: newProfile.id },
        });
      }

      // Récupérer le profil complet avec les rôles
      return await tx.profile.findUnique({
        where: { id: newProfile.id },
        include: profileInclude,
      });
    });

    // Mettre à jour la certification
    if (profile) {
      await updateProfileCertification(profile.id);
    }

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Profil professionnel créé avec succès",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error creating business profile:", error);
    return {
      success: false,
      message: "Erreur lors de la création du profil",
      profile: null,
    };
  }
}

// =============================================================================
// MUTATIONS - UPDATE
// =============================================================================

/**
 * Met à jour un profil individuel.
 */
export async function updateIndividualProfile(
  profileId: string,
  input: UpdateIndividualProfileInput
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId, profileType: ProfileType.INDIVIDUAL },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        phoneNumber: input.phoneNumber,
        country: input.country,
        city: input.city,
        address: input.address,
        individualProfile: {
          update: {
            firstName: input.firstName,
            lastName: input.lastName,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
            gender: input.gender,
            nationalIdNumber: input.nationalIdNumber,
          },
        },
      },
      include: profileInclude,
    });

    // Mettre à jour la certification
    await updateProfileCertification(profileId);

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Profil mis à jour avec succès",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error updating individual profile:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour",
      profile: null,
    };
  }
}

/**
 * Met à jour un profil business.
 */
export async function updateBusinessProfile(
  profileId: string,
  input: UpdateBusinessProfileInput
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId, profileType: ProfileType.BUSINESS },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        phoneNumber: input.phoneNumber,
        country: input.country,
        city: input.city,
        address: input.address,
        businessProfile: {
          update: {
            businessName: input.businessName,
            registrationNumber: input.registrationNumber,
            taxId: input.taxId,
            legalRepresentativeName: input.legalRepresentativeName,
          },
        },
      },
      include: profileInclude,
    });

    // Mettre à jour la certification
    await updateProfileCertification(profileId);

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Profil mis à jour avec succès",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error updating business profile:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour",
      profile: null,
    };
  }
}

// =============================================================================
// MUTATIONS - PROFILE SWITCHING
// =============================================================================

/**
 * Change le profil actif de l'utilisateur.
 */
export async function switchActiveProfile(profileId: string): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId },
      include: profileInclude,
    });

    if (!profile) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    // Mettre à jour le profil actif
    await prisma.user.update({
      where: { id: userId },
      data: { activeProfileId: profileId },
    });

    revalidatePath("/account");

    return {
      success: true,
      message: "Profil actif changé",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error switching profile:", error);
    return {
      success: false,
      message: "Erreur lors du changement de profil",
      profile: null,
    };
  }
}

// =============================================================================
// MUTATIONS - ROLES
// =============================================================================

/**
 * Ajoute un rôle à un profil.
 */
export async function addProfileRole(
  profileId: string,
  role: ProfileRole
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    // Ajouter le rôle (upsert pour éviter les doublons)
    await prisma.profileRoleAssignment.upsert({
      where: {
        profileId_role: { profileId, role },
      },
      create: { profileId, role },
      update: { isActive: true },
    });

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: profileInclude,
    });

    revalidatePath("/account/profile");

    return {
      success: true,
      message: `Rôle ajouté avec succès`,
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error adding role:", error);
    return {
      success: false,
      message: "Erreur lors de l'ajout du rôle",
      profile: null,
    };
  }
}

/**
 * Retire un rôle d'un profil.
 */
export async function removeProfileRole(
  profileId: string,
  role: ProfileRole
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    // Désactiver le rôle
    await prisma.profileRoleAssignment.updateMany({
      where: { profileId, role },
      data: { isActive: false },
    });

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: profileInclude,
    });

    revalidatePath("/account/profile");

    return {
      success: true,
      message: `Rôle retiré avec succès`,
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error removing role:", error);
    return {
      success: false,
      message: "Erreur lors du retrait du rôle",
      profile: null,
    };
  }
}

// =============================================================================
// CERTIFICATION
// =============================================================================

/**
 * Met à jour le statut de certification d'un profil.
 * Un profil est certifié si tous les champs obligatoires sont remplis.
 */
async function updateProfileCertification(profileId: string): Promise<void> {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: profileInclude,
    });

    if (!profile) return;

    const completion = calculateProfileCompletion(profile as Profile);
    const isCertified = completion === 100;

    await prisma.profile.update({
      where: { id: profileId },
      data: { isCertified },
    });
  } catch (error) {
    console.error("[Profile] Error updating certification:", error);
  }
}

// =============================================================================
// DELETE
// =============================================================================

/**
 * Supprime un profil.
 */
export async function deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié" };
    }

    // Vérifier que le profil appartient à l'utilisateur
    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé" };
    }

    // Vérifier qu'il reste au moins un profil
    const profileCount = await prisma.profile.count({ where: { userId } });
    if (profileCount <= 1) {
      return { success: false, message: "Vous devez conserver au moins un profil" };
    }

    // Supprimer le profil
    await prisma.profile.delete({ where: { id: profileId } });

    // Si c'était le profil actif, changer pour un autre
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (user?.activeProfileId === profileId) {
      const nextProfile = await prisma.profile.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
      });

      if (nextProfile) {
        await prisma.user.update({
          where: { id: userId },
          data: { activeProfileId: nextProfile.id },
        });
      }
    }

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return { success: true, message: "Profil supprimé avec succès" };
  } catch (error) {
    console.error("[Profile] Error deleting profile:", error);
    return { success: false, message: "Erreur lors de la suppression" };
  }
}

// =============================================================================
// MUTATIONS - UPDATE BY SECTION
// =============================================================================

/**
 * Met à jour les informations de contact d'un profil.
 */
export async function updateContactInfo(
  profileId: string,
  data: {
    phoneNumber?: string;
    country?: string;
    city?: string;
    address?: string;
  }
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        phoneNumber: data.phoneNumber,
        country: data.country,
        city: data.city,
        address: data.address,
      },
      include: profileInclude,
    });

    await updateProfileCertification(profileId);
    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Informations de contact mises à jour",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error updating contact info:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour",
      profile: null,
    };
  }
}

/**
 * Met à jour les informations personnelles d'un profil individuel.
 */
export async function updatePersonalInfo(
  profileId: string,
  data: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationalIdNumber?: string;
  }
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId, profileType: ProfileType.INDIVIDUAL },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        individualProfile: {
          update: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            gender: data.gender as any,
            nationalIdNumber: data.nationalIdNumber,
          },
        },
      },
      include: profileInclude,
    });

    await updateProfileCertification(profileId);
    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Informations personnelles mises à jour",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error updating personal info:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour",
      profile: null,
    };
  }
}

/**
 * Met à jour les informations de l'entreprise d'un profil business.
 */
export async function updateBusinessInfo(
  profileId: string,
  data: {
    businessName?: string;
    registrationNumber?: string;
    taxId?: string;
    legalRepresentativeName?: string;
  }
): Promise<ProfileResponse> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, message: "Non authentifié", profile: null };
    }

    const existing = await prisma.profile.findFirst({
      where: { id: profileId, userId, profileType: ProfileType.BUSINESS },
    });

    if (!existing) {
      return { success: false, message: "Profil non trouvé", profile: null };
    }

    const profile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        businessProfile: {
          update: {
            businessName: data.businessName,
            registrationNumber: data.registrationNumber,
            taxId: data.taxId,
            legalRepresentativeName: data.legalRepresentativeName,
          },
        },
      },
      include: profileInclude,
    });

    await updateProfileCertification(profileId);
    revalidatePath("/account");
    revalidatePath("/account/profile");

    return {
      success: true,
      message: "Informations de l'entreprise mises à jour",
      profile: profile as Profile,
    };
  } catch (error) {
    console.error("[Profile] Error updating business info:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour",
      profile: null,
    };
  }
}

"use client";

/**
 * Composant pour gérer les rôles d'un profil (locataire, bailleur, commissionnaire).
 * Inspiré de leboncoin.fr avec des espaces dédiés pour chaque rôle.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Key,
  Briefcase,
  Check,
  Plus,
  X,
  Loader2,
  Info,
} from "lucide-react";
import { useProfile } from "@/contexts/profile-context";
import {
  type Profile,
  ProfileRole,
  getProfileRoleLabel,
} from "@/lib/profile/types";
import { addProfileRole, removeProfileRole } from "@/lib/profile/actions";

interface ProfileRolesManagerProps {
  profile: Profile;
  onUpdate?: () => void;
}

const roleConfig = {
  [ProfileRole.TENANT]: {
    icon: Home,
    title: "Locataire",
    description: "Recherchez et louez des biens immobiliers",
    features: [
      "Rechercher des locations",
      "Sauvegarder vos favoris",
      "Contacter les bailleurs",
      "Gérer vos candidatures",
    ],
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    selectedBorder: "border-blue-500",
  },
  [ProfileRole.LANDLORD]: {
    icon: Key,
    title: "Bailleur",
    description: "Mettez vos biens en location ou en vente",
    features: [
      "Publier des annonces",
      "Gérer vos biens",
      "Recevoir des candidatures",
      "Suivre vos revenus locatifs",
    ],
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    selectedBorder: "border-emerald-500",
  },
  [ProfileRole.AGENT]: {
    icon: Briefcase,
    title: "Commissionnaire",
    description: "Gérez des transactions pour le compte de tiers",
    features: [
      "Représenter des propriétaires",
      "Gérer un portefeuille de biens",
      "Percevoir des commissions",
      "Accéder aux outils pro",
    ],
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50",
    borderColor: "border-purple-200 hover:border-purple-400",
    selectedBorder: "border-purple-500",
  },
};

export function ProfileRolesManager({
  profile,
  onUpdate,
}: ProfileRolesManagerProps) {
  const { refetchProfile } = useProfile();
  const [loadingRole, setLoadingRole] = useState<ProfileRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeRoles = profile.profileRoles
    .filter((r) => r.isActive)
    .map((r) => r.role);

  const handleToggleRole = async (role: ProfileRole) => {
    setError(null);
    setLoadingRole(role);

    try {
      const isActive = activeRoles.includes(role);
      let result;

      if (isActive) {
        result = await removeProfileRole(profile.id, role);
      } else {
        result = await addProfileRole(profile.id, role);
      }

      if (!result.success) {
        setError(result.message);
      } else {
        await refetchProfile();
        onUpdate?.();
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Mes espaces</h3>
        <p className="text-sm text-slate-500 mt-1">
          Activez les espaces correspondant à vos activités immobilières. Vous
          pouvez être à la fois locataire, bailleur et commissionnaire.
        </p>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-600">
          <p className="font-medium mb-1">
            Tout le monde peut acheter ou vendre
          </p>
          <p>
            Ces espaces concernent uniquement la location. Pour la vente et
            l&apos;achat de biens, vous n&apos;avez pas besoin d&apos;activer un
            espace spécifique.
          </p>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
          >
            <X className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Cards */}
      <div className="grid gap-4">
        {Object.entries(roleConfig).map(([roleKey, config]) => {
          const role = roleKey as ProfileRole;
          const Icon = config.icon;
          const isActive = activeRoles.includes(role);
          const isLoading = loadingRole === role;

          return (
            <motion.div
              key={role}
              layout
              className={`
                relative p-5 rounded-2xl border-2 transition-all
                ${isActive ? config.selectedBorder : config.borderColor}
                ${
                  isActive
                    ? `bg-gradient-to-br ${config.bgGradient}`
                    : "bg-white"
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient}
                    flex items-center justify-center flex-shrink-0 shadow-lg
                  `}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {config.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {config.description}
                      </p>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggleRole(role)}
                      disabled={isLoading}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                        transition-all disabled:opacity-50
                        ${
                          isActive
                            ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                            : `bg-gradient-to-r ${config.gradient} text-white shadow-md hover:shadow-lg`
                        }
                      `}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isActive ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>Activé</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Activer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Features (shown when active) */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-200/50"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {config.features.map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${config.gradient}`}
                              />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

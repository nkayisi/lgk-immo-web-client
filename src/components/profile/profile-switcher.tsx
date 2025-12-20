"use client";

/**
 * Composant pour basculer entre les différents profils d'un utilisateur.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  ChevronDown,
  Check,
  Plus,
  BadgeCheck,
} from "lucide-react";
import { useProfile } from "@/contexts/profile-context";
import {
  type Profile,
  ProfileType,
  getProfileDisplayName,
  isIndividualProfile,
} from "@/lib/profile/types";
import Link from "next/link";

interface ProfileSwitcherProps {
  variant?: "dropdown" | "list";
  onProfileChange?: (profile: Profile) => void;
}

export function ProfileSwitcher({
  variant = "dropdown",
  onProfileChange,
}: ProfileSwitcherProps) {
  const { profile, profiles, switchProfile, isLoading } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = async (profileId: string) => {
    if (profileId === profile?.id) {
      setIsOpen(false);
      return;
    }

    const success = await switchProfile(profileId);
    if (success) {
      const newProfile = profiles.find((p) => p.id === profileId);
      if (newProfile && onProfileChange) {
        onProfileChange(newProfile);
      }
    }
    setIsOpen(false);
  };

  const canAddIndividual = !profiles.some(
    (p) => p.profileType === ProfileType.INDIVIDUAL
  );
  const canAddBusiness = !profiles.some(
    (p) => p.profileType === ProfileType.BUSINESS
  );

  if (!profile) return null;

  if (variant === "list") {
    return (
      <div className="w-full space-y-2">
        {profiles.map((p) => {
          const isActive = p.id === profile.id;
          const isIndividual = isIndividualProfile(p);
          const displayName = getProfileDisplayName(p);

          return (
            <button
              key={p.id}
              onClick={() => handleSwitch(p.id)}
              disabled={isLoading}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl transition-all
                ${isActive
                  ? "bg-emerald-50 border-2 border-emerald-500"
                  : "bg-white border-2 border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <div
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isIndividual
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
                  }
                `}
              >
                {isIndividual ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Building2 className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 truncate block">
                    {displayName}
                  </span>
                  {p.isCertified && (
                    <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                </div>
                <span className="text-sm text-slate-500">
                  {isIndividual ? "Particulier" : "Professionnel"}
                </span>
              </div>
              {isActive && <Check className="w-5 h-5 text-emerald-500" />}
            </button>
          );
        })}

        {/* Add profile buttons */}
        {(canAddIndividual || canAddBusiness) && (
          <div className="pt-2 border-t border-slate-200 mt-4">
            <p className="text-sm text-slate-500 mb-2">Ajouter un profil</p>
            <div className="flex gap-2">
              {canAddIndividual && (
                <Link
                  href="/account/profiles/add"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Particulier</span>
                </Link>
              )}
              {canAddBusiness && (
                <Link
                  href="/account/profiles/add"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Professionnel</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dropdown variant
  const isIndividual = isIndividualProfile(profile);
  const displayName = getProfileDisplayName(profile);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all"
      >
        <div className="flex items-center gap-3">
          <div
            className={`
            w-9 h-9 rounded-lg flex items-center justify-center
            ${isIndividual
                ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                : "bg-gradient-to-br from-blue-500 to-indigo-500"
              }
          `}
          >
            {isIndividual ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Building2 className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="text-left leading-3 min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-slate-900 truncate block">
                {displayName}
              </span>
              {profile.isCertified && (
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-slate-500">
              {isIndividual ? "Particulier" : "Professionnel"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2">
                {profiles.map((p) => {
                  const isActive = p.id === profile.id;
                  const pIsIndividual = isIndividualProfile(p);
                  const pDisplayName = getProfileDisplayName(p);

                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitch(p.id)}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-all
                        ${isActive ? "bg-emerald-50" : "hover:bg-slate-50"}
                      `}
                    >
                      <div
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${pIsIndividual
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                            : "bg-gradient-to-br from-blue-500 to-indigo-500"
                          }
                        `}
                      >
                        {pIsIndividual ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Building2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 leading-3 text-left min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-slate-900 truncate block">
                            {pDisplayName}
                          </span>
                          {p.isCertified && (
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-slate-500">
                          {pIsIndividual ? "Particulier" : "Professionnel"}
                        </span>
                      </div>
                      {isActive && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {(canAddIndividual || canAddBusiness) && (
                <div className="border-t border-slate-100 p-2">
                  {canAddIndividual && (
                    <Link
                      href="/account/profiles/add"
                      className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">
                        Ajouter un profil particulier
                      </span>
                    </Link>
                  )}
                  {canAddBusiness && (
                    <Link
                      href="/account/profiles/add"
                      className="flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">
                        Ajouter un profil professionnel
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Building2, Loader2 } from "lucide-react";
import { ProfileType } from "@/lib/profile/types";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: ProfileType) => void;
  existingTypes: ProfileType[];
}

export function AddProfileModal({
  isOpen,
  onClose,
  onSelectType,
  existingTypes,
}: AddProfileModalProps) {
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

  const profileTypes = [
    {
      type: ProfileType.INDIVIDUAL,
      title: "Profil Particulier",
      description: "Pour vos besoins personnels",
      icon: User,
      disabled: existingTypes.includes(ProfileType.INDIVIDUAL),
    },
    {
      type: ProfileType.BUSINESS,
      title: "Profil Professionnel",
      description: "Pour votre entreprise",
      icon: Building2,
      disabled: existingTypes.includes(ProfileType.BUSINESS),
    },
  ];

  const handleContinue = () => {
    if (selectedType) {
      onSelectType(selectedType);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Ajouter un profil
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Profile Type Selection */}
              <div className="space-y-3 mb-6">
                {profileTypes.map((profile) => {
                  const Icon = profile.icon;
                  const isSelected = selectedType === profile.type;
                  const isDisabled = profile.disabled;

                  return (
                    <button
                      key={profile.type}
                      onClick={() =>
                        !isDisabled && setSelectedType(profile.type)
                      }
                      disabled={isDisabled}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isDisabled
                          ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                          : isSelected
                            ? "border-slate-900 bg-slate-50 shadow-md"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                        }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? "bg-emerald-600" : "bg-slate-100"
                          }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${isSelected ? "text-white" : "text-slate-600"
                            }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-slate-900">
                          {profile.title}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {isDisabled ? "Déjà créé" : profile.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selectedType}
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                  Continuer
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

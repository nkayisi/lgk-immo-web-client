"use client";

/**
 * Composant de sélection du type de profil.
 * Affiche deux cartes pour choisir entre Individual et Business.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Building2, ArrowRight, Check } from "lucide-react";
import { ProfileType } from "@/lib/profile/types";

interface ProfileTypeSelectorProps {
  onSelect: (type: ProfileType) => void;
  isLoading?: boolean;
}

const profileTypes = [
  {
    type: ProfileType.INDIVIDUAL,
    title: "Particulier",
    description:
      "Je suis un particulier à la recherche d'un bien ou souhaitant mettre mon bien en location/vente.",
    icon: User,
    features: [
      "Rechercher des biens immobiliers",
      "Publier des annonces personnelles",
      "Contacter directement les propriétaires",
      "Sauvegarder vos favoris",
    ],
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    selectedBorder: "border-emerald-500",
  },
  {
    type: ProfileType.BUSINESS,
    title: "Professionnel",
    description:
      "Je représente une agence immobilière, un promoteur ou une entreprise du secteur.",
    icon: Building2,
    features: [
      "Gérer un portefeuille de biens",
      "Accéder aux outils professionnels",
      "Statistiques et analytics avancés",
      "Support prioritaire",
    ],
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
    borderColor: "border-blue-200 hover:border-blue-400",
    selectedBorder: "border-blue-500",
  },
];

export function ProfileTypeSelector({
  onSelect,
  isLoading,
}: ProfileTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);
  const [hoveredType, setHoveredType] = useState<ProfileType | null>(null);

  const handleSelect = (type: ProfileType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Quel type de profil vous correspond ?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choisissez le type de compte qui correspond le mieux à votre
            utilisation de LGK Immo.
          </p>
        </motion.div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {profileTypes.map((profile, index) => {
          const Icon = profile.icon;
          const isSelected = selectedType === profile.type;
          const isHovered = hoveredType === profile.type;

          return (
            <motion.button
              key={profile.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleSelect(profile.type)}
              onMouseEnter={() => setHoveredType(profile.type)}
              onMouseLeave={() => setHoveredType(null)}
              disabled={isLoading}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all duration-300
                ${isSelected ? profile.selectedBorder : profile.borderColor}
                ${
                  isSelected
                    ? `bg-gradient-to-br ${profile.bgGradient}`
                    : "bg-white hover:bg-slate-50"
                }
                ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }
                focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500/20
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${profile.gradient} flex items-center justify-center`}
                >
                  <Check className="w-5 h-5 text-white" />
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`
                w-14 h-14 rounded-xl bg-gradient-to-br ${profile.gradient} 
                flex items-center justify-center mb-4 shadow-lg
                ${isSelected || isHovered ? "shadow-lg" : "shadow-md"}
                transition-shadow duration-300
              `}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {profile.title}
              </h3>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                {profile.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {profile.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${profile.gradient}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedType ? 1 : 0.5 }}
        className="flex justify-center"
      >
        <button
          onClick={handleContinue}
          disabled={!selectedType || isLoading}
          className={`
            flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white
            bg-gradient-to-r from-emerald-500 to-cyan-500
            hover:from-emerald-600 hover:to-cyan-600
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-300 shadow-lg hover:shadow-xl
            focus:outline-none focus:ring-4 focus:ring-emerald-500/30
          `}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Chargement...</span>
            </>
          ) : (
            <>
              <span>Continuer</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>

      {/* Help text */}
      <p className="text-center text-sm text-slate-500 mt-6">
        Vous pourrez modifier certaines informations plus tard dans les
        paramètres.
      </p>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Building2, User, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProfileType } from "@/lib/profile/types";

export default function GetStartedPage() {
  const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

  const accountTypes = [
    {
      type: ProfileType.INDIVIDUAL,
      icon: User,
      title: "Compte Particulier",
      description:
        "Pour les particuliers qui cherchent à louer, acheter ou vendre un bien immobilier.",
      features: [
        "Rechercher des propriétés",
        "Publier vos annonces",
        "Contacter directement les propriétaires",
        "Sauvegarder vos favoris",
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
    },
    {
      type: ProfileType.BUSINESS,
      icon: Building2,
      title: "Compte Professionnel",
      description:
        "Pour les agents immobiliers, promoteurs et entreprises du secteur immobilier.",
      features: [
        "Gestion avancée des annonces",
        "Outils de marketing",
        "Statistiques et analyses",
        "Badge professionnel vérifié",
      ],
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      textColor: "text-emerald-600",
    },
  ];

  return (
    <div className="w-full flex flex-1 items-center justify-center">
      <div className="w-full max-w-3xl">


        {/* Account Type Cards */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {accountTypes.map((account, index) => {
            const Icon = account.icon;
            const isSelected = selectedType === account.type;

            return (
              <motion.button
                key={account.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedType(account.type)}
                className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 ${isSelected
                    ? "border-slate-900 bg-slate-50 shadow-lg"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-slate-900" : "bg-slate-100"
                    }`}
                >
                  <Icon
                    className={`w-6 h-6 ${isSelected ? "text-white" : "text-slate-600"
                      }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-slate-900 mb-0.5">
                    {account.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {account.description}
                  </p>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                      ? "border-slate-900 bg-slate-900"
                      : "border-slate-300"
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href={
              selectedType === ProfileType.BUSINESS
                ? "/get-started/business"
                : selectedType === ProfileType.INDIVIDUAL
                  ? "/register?type=individual"
                  : "#"
            }
            className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${selectedType
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            onClick={(e) => {
              if (!selectedType) e.preventDefault();
            }}
          >
            Continuer
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm text-center text-slate-600 mt-6">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="text-slate-900 font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

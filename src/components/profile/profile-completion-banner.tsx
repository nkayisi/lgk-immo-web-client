"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { calculateProfileCompletion, type Profile } from "@/lib/profile/types";

interface ProfileCompletionBannerProps {
  profile: Profile;
}

export function ProfileCompletionBanner({
  profile,
}: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const completion = calculateProfileCompletion(profile);

  // Ne pas afficher si le profil est complet ou si l'utilisateur a fermé le banner
  if (completion === 100 || isDismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 shadow-lg"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {completion >= 50 ? (
              <CheckCircle className="w-6 h-6 text-white" />
            ) : (
              <AlertCircle className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">
            {completion >= 50
              ? "Vous y êtes presque !"
              : "Complétez votre profil"}
          </h3>
          <p className="text-white/90 text-sm mb-4">
            {completion >= 50
              ? `Votre profil est complété à ${completion}%. Ajoutez quelques informations supplémentaires pour obtenir la certification.`
              : `Votre profil est complété à ${completion}%. Un profil complet vous donne accès à plus de fonctionnalités et améliore votre visibilité.`}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-white/80 mb-2">
              <span>Progression</span>
              <span className="font-semibold">{completion}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
          >
            Compléter mon profil
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

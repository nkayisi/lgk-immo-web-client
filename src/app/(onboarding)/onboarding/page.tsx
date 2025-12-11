"use client";

/**
 * Page d'onboarding pour la création du profil.
 * Flux: Sélection du type → Formulaire adapté → Redirection dashboard
 */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { ProfileProvider, useProfile } from "@/contexts/profile-context";
import {
  ProfileTypeSelector,
  IndividualProfileForm,
  BusinessProfileForm,
} from "@/components/profile";
import { ProfileType } from "@/lib/graphql/types";

type OnboardingStep =
  | "loading"
  | "select-type"
  | "individual-form"
  | "business-form"
  | "complete";

function OnboardingContent() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const {
    hasProfile,
    isLoading: profileLoading,
    createIndividualProfile,
    createBusinessProfile,
    error,
  } = useProfile();

  const [step, setStep] = useState<OnboardingStep>("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rediriger si non connecté
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/login");
    }
  }, [sessionLoading, session, router]);

  // Rediriger si déjà un profil
  useEffect(() => {
    if (!profileLoading && hasProfile) {
      router.push("/dashboard");
    }
  }, [profileLoading, hasProfile, router]);

  // Passer à l'étape de sélection une fois chargé
  useEffect(() => {
    if (!sessionLoading && !profileLoading && session && !hasProfile) {
      setStep("select-type");
    }
  }, [sessionLoading, profileLoading, session, hasProfile]);

  const handleTypeSelect = (type: ProfileType) => {
    if (type === ProfileType.INDIVIDUAL) {
      setStep("individual-form");
    } else {
      setStep("business-form");
    }
  };

  const handleIndividualSubmit = async (
    data: Parameters<typeof createIndividualProfile>[0]
  ) => {
    setIsSubmitting(true);
    const success = await createIndividualProfile(data);
    setIsSubmitting(false);

    if (success) {
      setStep("complete");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
    return success;
  };

  const handleBusinessSubmit = async (
    data: Parameters<typeof createBusinessProfile>[0]
  ) => {
    setIsSubmitting(true);
    const success = await createBusinessProfile(data);
    setIsSubmitting(false);

    if (success) {
      setStep("complete");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
    return success;
  };

  const handleBack = () => {
    setStep("select-type");
  };

  // Loading state
  if (step === "loading" || sessionLoading || profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-4" />
        <p className="text-slate-600">Chargement...</p>
      </div>
    );
  }

  // Complete state
  if (step === "complete") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Profil créé avec succès !
        </h2>
        <p className="text-slate-600 mb-4">
          Redirection vers votre tableau de bord...
        </p>
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {step === "select-type" && (
        <motion.div
          key="select-type"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <ProfileTypeSelector
            onSelect={handleTypeSelect}
            isLoading={isSubmitting}
          />
        </motion.div>
      )}

      {step === "individual-form" && (
        <motion.div
          key="individual-form"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <IndividualProfileForm
            onSubmit={handleIndividualSubmit}
            onBack={handleBack}
          />
        </motion.div>
      )}

      {step === "business-form" && (
        <motion.div
          key="business-form"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <BusinessProfileForm
            onSubmit={handleBusinessSubmit}
            onBack={handleBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function OnboardingPage() {
  return (
    <ProfileProvider>
      <OnboardingContent />
    </ProfileProvider>
  );
}

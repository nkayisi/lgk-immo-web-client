"use client";

/**
 * Formulaire de création/édition de profil entreprise.
 */
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Phone,
  MapPin,
  FileText,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { CreateBusinessProfileInput, type Profile } from "@/lib/profile/types";

interface BusinessProfileFormProps {
  initialData?: Profile;
  onSubmit: (data: CreateBusinessProfileInput) => Promise<boolean>;
  onBack?: () => void;
  isEditing?: boolean;
  onSkipAll?: () => void;
}

export function BusinessProfileForm({
  initialData,
  onSubmit,
  onBack,
  isEditing = false,
  onSkipAll,
}: BusinessProfileFormProps) {
  const [formData, setFormData] = useState({
    businessName: initialData?.businessProfile?.businessName || "",
    registrationNumber: initialData?.businessProfile?.registrationNumber || "",
    taxId: initialData?.businessProfile?.taxId || "",
    legalRepresentativeName:
      initialData?.businessProfile?.legalRepresentativeName || "",
    phoneNumber: initialData?.phoneNumber || "",
    country: initialData?.country || "RDC",
    city: initialData?.city || "",
    address: initialData?.address || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Entreprise", icon: Building2, required: true },
    { title: "Documents", icon: FileText, required: false },
    { title: "Contact", icon: Phone, required: false },
    { title: "Localisation", icon: MapPin, required: false },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const submitData: Omit<CreateBusinessProfileInput, "externalUserId"> = {
        businessName: formData.businessName,
        registrationNumber: formData.registrationNumber || undefined,
        taxId: formData.taxId || undefined,
        legalRepresentativeName: formData.legalRepresentativeName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
      };

      const success = await onSubmit(submitData);
      if (!success) {
        setError("Une erreur est survenue lors de la sauvegarde.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName.trim().length > 0;
      default:
        return true;
    }
  };

  const skipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleContinueLater = async () => {
    if (!formData.businessName.trim()) {
      setError("Veuillez renseigner au moins le nom de l'entreprise.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const submitData: Omit<CreateBusinessProfileInput, "externalUserId"> = {
        businessName: formData.businessName,
        registrationNumber: formData.registrationNumber || undefined,
        taxId: formData.taxId || undefined,
        legalRepresentativeName: formData.legalRepresentativeName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
      };
      const success = await onSubmit(submitData);
      if (!success) {
        setError("Une erreur est survenue lors de la sauvegarde.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
        )}
        <h2 className="text-2xl font-bold text-slate-900">
          {isEditing
            ? "Modifier mon profil entreprise"
            : "Créer mon profil professionnel"}
        </h2>
        <p className="text-slate-600 mt-1">
          {isEditing
            ? "Mettez à jour les informations de votre entreprise."
            : "Renseignez les informations de votre entreprise ou agence."}
        </p>
      </div>

      {/* Progress Steps - Modern Design */}
      <div className="mb-8">
        {/* Progress bar */}
        <div className="relative mb-6">
          <div className="h-1 bg-slate-200 rounded-full">
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="absolute -top-2 left-0 right-0 flex justify-between">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <button
                  key={step.title}
                  onClick={() => setCurrentStep(index)}
                  className={`
                    w-5 h-5 rounded-full border-2 transition-all
                    ${isActive ? "bg-blue-500 border-blue-500 scale-125" : ""}
                    ${
                      isCompleted
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-slate-300"
                    }
                  `}
                />
              );
            })}
          </div>
        </div>

        {/* Step labels */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <button
                key={step.title}
                onClick={() => setCurrentStep(index)}
                className={`
                  flex flex-col items-center gap-1.5 transition-all
                  ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-blue-500"
                      : "text-slate-400"
                  }
                `}
              >
                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${
                      isActive
                        ? "bg-blue-100 shadow-sm"
                        : isCompleted
                        ? "bg-blue-50"
                        : "bg-slate-100"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">
                  {step.title}
                </span>
                {!step.required && (
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    Optionnel
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
        >
          {/* Step 0: Business Info */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nom de l&apos;entreprise{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Immo Congo SARL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Représentant légal
                </label>
                <input
                  type="text"
                  name="legalRepresentativeName"
                  value={formData.legalRepresentativeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Nom du gérant ou directeur"
                />
              </div>
            </div>
          )}

          {/* Step 1: Documents */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Numéro RCCM (Registre de Commerce)
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="RC/KIN/2024/A/12345"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Numéro d&apos;immatriculation au registre de commerce.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Numéro d&apos;Identification Fiscale (NIF)
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="A1234567890"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Votre numéro d&apos;identification fiscale.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>Note :</strong> Ces informations permettront de
                  vérifier votre entreprise et d&apos;obtenir le badge
                  &quot;Professionnel vérifié&quot;.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Téléphone professionnel
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="+243 999 999 999"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ce numéro sera affiché sur vos annonces professionnelles.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Pays
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white"
                >
                  <option value="RDC">République Démocratique du Congo</option>
                  <option value="Congo">République du Congo</option>
                  <option value="Angola">Angola</option>
                  <option value="Zambie">Zambie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Kinshasa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse du siège
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  placeholder="Avenue, numéro, commune..."
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Main navigation */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
                ${
                  currentStep === 0
                    ? "opacity-0 pointer-events-none"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </button>

            <div className="flex items-center gap-3">
              {/* Skip button for optional steps */}
              {currentStep > 0 &&
                currentStep < steps.length - 1 &&
                !steps[currentStep].required && (
                  <button
                    type="button"
                    onClick={skipStep}
                    className="px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    Passer cette étape
                  </button>
                )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !formData.businessName}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>
                      {isEditing ? "Enregistrer" : "Créer mon profil"}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Continue later button */}
          {!isEditing && currentStep > 0 && (
            <div className="flex justify-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleContinueLater}
                disabled={isLoading || !formData.businessName.trim()}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer plus tard et créer mon profil maintenant
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

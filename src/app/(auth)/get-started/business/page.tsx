"use client";

import { motion } from "framer-motion";
import { Building2, ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function BusinessInfoPage() {
    const router = useRouter();
    const [businessName, setBusinessName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!businessName.trim()) {
            setError("Le nom de l'entreprise est obligatoire");
            return;
        }

        if (businessName.trim().length < 2) {
            setError("Le nom de l'entreprise doit contenir au moins 2 caractères");
            return;
        }

        // Stocker le nom de l'entreprise dans sessionStorage pour l'utiliser lors de l'inscription
        sessionStorage.setItem("pendingBusinessName", businessName.trim());

        // Rediriger vers le formulaire d'inscription avec le type business
        router.push("/register?type=business");
    };

    return (
        <div className="w-full flex flex-1 items-center justify-center">
            <div className="w-full max-w-md">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Informations de l&apos;entreprise
                    </h1>
                    <p className="text-slate-600">
                        Commencez par nous donner le nom de votre entreprise
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="businessName"
                            className="block text-sm font-medium text-slate-700"
                        >
                            Nom de l&apos;entreprise <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="businessName"
                            type="text"
                            value={businessName}
                            onChange={(e) => {
                                setBusinessName(e.target.value);
                                setError("");
                            }}
                            required
                            autoFocus
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                            placeholder="Ex: LGK Immobilier SARL"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Ce nom sera affiché sur votre profil professionnel
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <h3 className="text-sm font-medium text-emerald-900 mb-2">
                            Pourquoi cette information ?
                        </h3>
                        <p className="text-sm text-emerald-700">
                            Le nom de votre entreprise sera utilisé pour identifier votre profil
                            professionnel et sera visible par les utilisateurs de la plateforme.
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                        >
                            Continuer
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <Link
                            href="/get-started"
                            className="w-full flex items-center justify-center gap-2 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Link>
                    </div>
                </motion.form>

                {/* Sign In Link */}
                <p className="mt-8 text-center text-sm text-slate-600">
                    Vous avez déjà un compte ?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-slate-900 hover:underline"
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}

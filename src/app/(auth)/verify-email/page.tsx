"use client";

import { useState } from "react";
import Link from "next/link";
import { sendVerificationEmail } from "@/lib/auth-client";
import { Mail, ArrowLeft, Loader2, CheckCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [showResendForm, setShowResendForm] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    try {
      await sendVerificationEmail(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error("Erreur lors du renvoi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-emerald-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Vérifiez votre email
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          Nous avons envoyé un email de vérification à votre adresse. Cliquez
          sur le lien dans l&apos;email pour activer votre compte.
        </p>

        {/* Tips */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Vous n&apos;avez pas reçu l&apos;email ?
          </p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• Vérifiez votre dossier spam ou courrier indésirable</li>
            <li>• Assurez-vous que l&apos;adresse email est correcte</li>
            <li>• L&apos;email peut prendre quelques minutes à arriver</li>
          </ul>
        </div>

        {/* Resend Section */}
        {!showResendForm ? (
          <button
            onClick={() => setShowResendForm(true)}
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Renvoyer l&apos;email de vérification
          </button>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
            <button
              onClick={handleResend}
              disabled={loading || !email}
              className="w-full py-3 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : resent ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Email envoyé !</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Renvoyer l&apos;email</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
        </div>

        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

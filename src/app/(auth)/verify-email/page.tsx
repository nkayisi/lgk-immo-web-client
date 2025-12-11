"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { sendVerificationEmail } from "@/lib/auth-client";
import { Mail, ArrowLeft, Loader2, CheckCircle, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer l'email depuis les paramètres URL
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  // Masquer partiellement l'email pour la confidentialité
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    if (!domain) return email;

    const visibleChars = Math.min(3, localPart.length);
    const masked = localPart.slice(0, visibleChars) + "***";
    return `${masked}@${domain}`;
  };

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);
    try {
      await sendVerificationEmail(email);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      console.error("Erreur lors du renvoi:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
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

        {/* Description with email */}
        <p className="text-slate-500 text-sm mb-2 max-w-sm mx-auto">
          Nous avons envoyé un email de vérification à votre adresse :
        </p>

        {email && (
          <p className="text-emerald-600 font-semibold text-base mb-6">
            {maskEmail(email)}
          </p>
        )}

        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          Cliquez sur le lien dans l&apos;email pour activer votre compte.
        </p>

        {/* Tips */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Vous n&apos;avez pas reçu l&apos;email ?
          </p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• Vérifiez votre dossier spam ou courrier indésirable</li>
            <li>• L&apos;email peut prendre quelques minutes à arriver</li>
          </ul>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Resend Button - Direct resend without form */}
        {email ? (
          <button
            onClick={handleResend}
            disabled={loading || resent}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <span>Renvoyer l&apos;email de vérification</span>
              </>
            )}
          </button>
        ) : (
          <p className="text-slate-500 text-sm">
            Aucun email associé. Veuillez vous{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              réinscrire
            </Link>
            .
          </p>
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

// Loading fallback for Suspense
function VerifyEmailLoading() {
  return (
    <div className="w-full">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
        <p className="text-slate-500">Chargement...</p>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

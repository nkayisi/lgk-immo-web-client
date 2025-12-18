"use client";

import { useState, FormEvent, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, authClient } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Check,
  X,
  User,
  Building2,
} from "lucide-react";
import { ProfileType } from "@/lib/profile/types";
import { ensureProfileAction } from "@/lib/profile/ensure-profile";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileType, setProfileType] = useState<ProfileType>(
    ProfileType.INDIVIDUAL
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Récupérer le type de profil depuis l'URL
  useEffect(() => {
    const type = searchParams.get("type");
    console.log("[RegisterForm] URL type parameter:", type);
    if (type === "individual") {
      console.log("[RegisterForm] Setting profileType to INDIVIDUAL");
      setProfileType(ProfileType.INDIVIDUAL);
    } else if (type === "business") {
      console.log("[RegisterForm] Setting profileType to BUSINESS");
      setProfileType(ProfileType.BUSINESS);
    } else {
      // Rediriger vers la page de sélection si pas de type
      router.push("/get-started");
    }
  }, [searchParams, router]);

  // Password strength checker
  const passwordStrength = useMemo(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength.score <= 1) return "bg-red-500";
    if (passwordStrength.score <= 2) return "bg-yellow-500";
    if (passwordStrength.score <= 3) return "bg-emerald-400";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength.score <= 1) return "Faible";
    if (passwordStrength.score <= 2) return "Moyen";
    if (passwordStrength.score <= 3) return "Fort";
    return "Très fort";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      return;
    }

    if (passwordStrength.score < 3) {
      setError("Le mot de passe n'est pas assez fort");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        email,
        password,
        name: name.trim() || "", // Nom dans User temporairement
      });
      if (result.error) {
        if (result.error.status === 403) {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        setError(result.error.message || "Échec de la création du compte");
      } else {
        // Créer automatiquement le profil après l'inscription
        if (result.data?.user) {
          console.log(
            "[RegisterForm] Creating profile with type:",
            profileType
          );
          await ensureProfileAction({
            userId: result.data.user.id,
            email: result.data.user.email,
            name: name.trim() || undefined,
            profileType,
          });
        }
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Échec de la création du compte";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // Stocker le type de profil dans sessionStorage pour OAuth
    sessionStorage.setItem("pendingProfileType", profileType);
    authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="w-full">
      {/* Header removed - now in page */}

      {/* Social Login Buttons */}
      <div className="space-y-3 mb-5">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={socialLoading !== null}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 group"
        >
          {socialLoading === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Continuer avec Google
          </span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={socialLoading !== null}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {socialLoading === "facebook" ? (
            <Loader2 className="w-5 h-5 animate-spin text-white/70" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span className="text-sm font-medium text-white">
            Continuer avec Facebook
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 text-sm text-slate-400 bg-slate-50">ou</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 flex items-start gap-3 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field - Conditional based on profile type */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700"
          >
            {profileType === ProfileType.INDIVIDUAL
              ? "Nom complet"
              : "Nom de l'entreprise"}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            placeholder={
              profileType === ProfileType.INDIVIDUAL
                ? "Jean Kabongo"
                : "LGK Immobilier SARL"
            }
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            placeholder="nom@exemple.com"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              placeholder="Créez un mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${
                    passwordStrength.score <= 1
                      ? "text-red-500"
                      : passwordStrength.score <= 2
                      ? "text-yellow-600"
                      : "text-emerald-600"
                  }`}
                >
                  {getStrengthText()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {[
                  { key: "length", label: "8+ caractères" },
                  { key: "uppercase", label: "Majuscule" },
                  { key: "lowercase", label: "Minuscule" },
                  { key: "number", label: "Chiffre" },
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    className={`flex items-center gap-1 ${
                      passwordStrength.checks[
                        key as keyof typeof passwordStrength.checks
                      ]
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {passwordStrength.checks[
                      key as keyof typeof passwordStrength.checks
                    ] ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 py-1">
          <button
            type="button"
            onClick={() => setAcceptTerms(!acceptTerms)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
              acceptTerms
                ? "bg-emerald-500 border-emerald-500"
                : "border-slate-300 hover:border-slate-400"
            }`}
          >
            {acceptTerms && <Check className="w-3 h-3 text-white" />}
          </button>
          <p className="text-sm text-slate-600">
            J&apos;accepte les{" "}
            <Link
              href="/terms"
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link
              href="/privacy"
              className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !acceptTerms}
          className="w-full py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Création en cours...
            </span>
          ) : (
            <span>Créer mon compte</span>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <p className="mt-6 text-center text-sm text-slate-600">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-semibold text-slate-900 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

import { LoginForm } from "@/components/auth/login-form";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bon retour !
          </h1>
          <p className="text-slate-600">Connectez-vous à votre compte</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}

import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Créer votre compte
          </h1>
        </div>

        <Suspense fallback={<div>Chargement...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

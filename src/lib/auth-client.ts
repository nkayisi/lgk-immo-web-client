import { createAuthClient } from "better-auth/react"

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const authClient = createAuthClient({
  baseURL,
})

// Hooks et méthodes d'authentification
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession,
  getSession,
} = authClient

// Méthodes pour la gestion des emails et mots de passe
// Demander la réinitialisation du mot de passe (envoie l'email)
export const requestPasswordReset = async (email: string, redirectTo?: string) => {
  return authClient.$fetch("/request-password-reset", {
    method: "POST",
    body: {
      email,
      redirectTo: redirectTo || "/reset-password",
    },
  })
}

// Réinitialiser le mot de passe avec le token (après clic sur le lien)
export const resetPassword = async (newPassword: string, token: string) => {
  return authClient.$fetch("/reset-password", {
    method: "POST",
    body: {
      newPassword,
      token,
    },
  })
}

// Envoyer l'email de vérification
export const sendVerificationEmail = async (email: string, callbackURL?: string) => {
  return authClient.$fetch("/send-verification-email", {
    method: "POST",
    body: {
      email,
      callbackURL: callbackURL || "/dashboard",
    },
  })
}

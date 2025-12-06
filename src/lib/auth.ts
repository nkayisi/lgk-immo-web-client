import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import nodemailer from "nodemailer"

// Configuration du transporteur SMTP avec options robustes
const smtpPort = parseInt(process.env.SMTP_PORT || "587")
const isSecure = smtpPort === 465 || process.env.SMTP_SECURE === "true"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Options de connexion robustes
  connectionTimeout: 10000, // 10 secondes
  greetingTimeout: 10000,
  socketTimeout: 30000, // 30 secondes pour l'envoi
  // TLS options
  tls: {
    rejectUnauthorized: false, // Accepter les certificats auto-signés en dev
    minVersion: "TLSv1.2",
  },
  // Debug en développement
  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development",
})

// Fonction d'envoi d'email avec gestion d'erreur
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const info = await transporter.sendMail({
      from: `"LGK Immo" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
    console.log(`[Email] Envoyé à ${to}: ${info.messageId}`)
    return info
  } catch (error) {
    console.error(`[Email] Erreur d'envoi à ${to}:`, error)
    // Ne pas bloquer l'inscription si l'email échoue
    // L'utilisateur pourra demander un renvoi
    throw error
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Utiliser void pour ne pas bloquer si l'email échoue
      void sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe - LGK Immo",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">LGK Immo</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">Réinitialisation du mot de passe</h2>
                <p style="color: #64748b; line-height: 1.6; margin: 0 0 24px 0;">
                  Bonjour ${user.name || ""},<br><br>
                  Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                </p>
                <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Réinitialiser mon mot de passe
                </a>
                <p style="color: #94a3b8; font-size: 14px; margin: 24px 0 0 0; line-height: 1.6;">
                  Ce lien expire dans 1 heure.<br>
                  Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
              </div>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} LGK Immo. Tous droits réservés.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Utiliser void pour ne pas bloquer l'inscription si l'email échoue
      void sendEmail({
        to: user.email,
        subject: "Vérifiez votre adresse email - LGK Immo",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <div style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 32px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">LGK Immo</h1>
              </div>
              <div style="padding: 32px;">
                <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px;">Bienvenue sur LGK Immo ! 🎉</h2>
                <p style="color: #64748b; line-height: 1.6; margin: 0 0 24px 0;">
                  Bonjour ${user.name || ""},<br><br>
                  Merci de vous être inscrit sur LGK Immo, la plateforme immobilière intelligente en RDC. 
                  Veuillez confirmer votre adresse email pour activer votre compte.
                </p>
                <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Vérifier mon email
                </a>
                <p style="color: #94a3b8; font-size: 14px; margin: 24px 0 0 0; line-height: 1.6;">
                  Ce lien expire dans 24 heures.<br>
                  Si vous n'avez pas créé de compte, ignorez cet email.
                </p>
              </div>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} LGK Immo. Tous droits réservés.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "lgk_auth",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
})

export type Session = typeof auth.$Infer.Session

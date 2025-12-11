/**
 * Script de test pour vérifier l'envoi d'emails via Resend
 * Usage: pnpm tsx scripts/test-resend.ts
 */

import { Resend } from "resend"
import * as dotenv from "dotenv"

// Charger les variables d'environnement
dotenv.config({ path: ".env.local" })

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || "LGK Immo <onboarding@resend.dev>"
const TEST_EMAIL = process.env.TEST_EMAIL || "nelsonkayisirirya5@gmail.com" // Email de destination pour le test

async function testResend() {
  console.log("\n🚀 Test d'envoi d'email via Resend\n")
  console.log("━".repeat(50))

  // Vérifier la configuration
  console.log("\n📋 Configuration:")
  console.log(`   RESEND_API_KEY: ${RESEND_API_KEY ? "✅ Configurée" : "❌ Manquante"}`)
  console.log(`   EMAIL_FROM: ${EMAIL_FROM}`)
  console.log(`   TEST_EMAIL: ${TEST_EMAIL || "❌ Non défini"}`)

  if (!RESEND_API_KEY) {
    console.error("\n❌ RESEND_API_KEY n'est pas définie dans .env.local")
    console.log("\n💡 Ajoutez cette ligne dans votre .env.local:")
    console.log("   RESEND_API_KEY=re_xxxxxxxxxxxxx")
    console.log("\n   Obtenez votre clé API sur: https://resend.com/api-keys")
    process.exit(1)
  }

  if (!TEST_EMAIL) {
    console.error("\n❌ Aucun email de test défini")
    console.log("\n💡 Ajoutez TEST_EMAIL dans votre .env.local:")
    console.log("   TEST_EMAIL=votre@email.com")
    process.exit(1)
  }

  const resend = new Resend(RESEND_API_KEY)

  console.log("\n📧 Envoi d'un email de test...")
  console.log(`   De: ${EMAIL_FROM}`)
  console.log(`   À: ${TEST_EMAIL}`)

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [TEST_EMAIL],
      subject: "✅ Test Resend - LGK Immo",
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
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🎉 Test Resend Réussi!</h1>
            </div>
            <div style="padding: 32px;">
              <p style="color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">
                Si vous recevez cet email, votre configuration Resend fonctionne correctement sur LGK Immo.
              </p>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <p style="color: #166534; margin: 0; font-size: 14px;">
                  <strong>✅ Configuration validée</strong><br>
                  Les emails de vérification et de réinitialisation de mot de passe fonctionneront en production.
                </p>
              </div>
              <p style="color: #94a3b8; font-size: 14px; margin: 16px 0 0 0;">
                Date du test: ${new Date().toLocaleString("fr-FR", { 
                  dateStyle: "full", 
                  timeStyle: "medium" 
                })}
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

    if (error) {
      console.error("\n❌ Erreur Resend:", error)
      
      if (error.message?.includes("API key")) {
        console.log("\n💡 Vérifiez que votre clé API est valide sur: https://resend.com/api-keys")
      }
      if (error.message?.includes("domain")) {
        console.log("\n💡 Pour envoyer à n'importe quelle adresse, vous devez vérifier votre domaine sur Resend")
        console.log("   En attendant, utilisez 'onboarding@resend.dev' comme expéditeur")
        console.log("   et testez uniquement vers l'email associé à votre compte Resend")
      }
      
      process.exit(1)
    }

    console.log("\n✅ Email envoyé avec succès!")
    console.log(`   ID: ${data?.id}`)
    console.log("\n📬 Vérifiez votre boîte de réception (et les spams)")
    console.log("\n━".repeat(50))
    console.log("\n🎉 Votre configuration Resend est prête pour la production!")

  } catch (err) {
    console.error("\n❌ Erreur lors de l'envoi:", err)
    process.exit(1)
  }
}

testResend()

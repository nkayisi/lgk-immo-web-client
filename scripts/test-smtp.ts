/**
 * Script de test SMTP
 * Exécuter avec: npx tsx scripts/test-smtp.ts
 */

import nodemailer from "nodemailer"
import * as dotenv from "dotenv"
import { resolve } from "path"

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, "../.env.local") })

async function testSMTP() {
  console.log("🔧 Configuration SMTP:")
  console.log(`   Host: ${process.env.SMTP_HOST}`)
  console.log(`   Port: ${process.env.SMTP_PORT}`)
  console.log(`   User: ${process.env.SMTP_USER}`)
  console.log(`   Secure: ${process.env.SMTP_SECURE}`)
  console.log("")

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
    tls: {
      rejectUnauthorized: false,
    },
    debug: true,
    logger: true,
  })

  console.log("📡 Test de connexion SMTP...")
  
  try {
    await transporter.verify()
    console.log("✅ Connexion SMTP réussie!")
    
    // Test d'envoi (optionnel)
    const testEmail = process.env.SMTP_USER
    if (testEmail) {
      console.log(`\n📧 Envoi d'un email de test à ${testEmail}...`)
      
      const info = await transporter.sendMail({
        from: `"LGK Immo Test" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: testEmail,
        subject: "Test SMTP - LGK Immo",
        html: `
          <h1>Test SMTP réussi! 🎉</h1>
          <p>Si vous recevez cet email, votre configuration SMTP fonctionne correctement.</p>
          <p>Date: ${new Date().toLocaleString("fr-FR")}</p>
        `,
      })
      
      console.log(`✅ Email envoyé! Message ID: ${info.messageId}`)
    }
  } catch (error) {
    console.error("❌ Erreur SMTP:", error)
    
    // Suggestions de résolution
    console.log("\n💡 Suggestions:")
    console.log("   1. Vérifiez que SMTP_HOST, SMTP_PORT, SMTP_USER et SMTP_PASSWORD sont corrects")
    console.log("   2. Pour Gmail: activez 'Accès aux applications moins sécurisées' ou utilisez un mot de passe d'application")
    console.log("   3. Pour Office365: utilisez le port 587 avec SMTP_SECURE=false")
    console.log("   4. Vérifiez que votre pare-feu/antivirus ne bloque pas la connexion")
  }
}

testSMTP()

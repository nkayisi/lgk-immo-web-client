/**
 * API Route pour l'envoi d'emails via Resend.
 * IMPORTANT: Cette route force le runtime "nodejs" pour être compatible avec Resend sur Vercel.
 * Better-Auth et autres fichiers en edge runtime doivent appeler cette route.
 */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "LGK Immo <onboarding@resend.dev>";

// Clé secrète pour sécuriser les appels internes
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || process.env.BETTER_AUTH_SECRET;

interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  internalSecret?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { to, subject, html, internalSecret } = body;

    // Vérification de sécurité pour les appels internes
    if (internalSecret !== INTERNAL_API_SECRET) {
      console.error("[Email API] Unauthorized request - invalid secret");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validation des champs requis
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: to, subject, html" },
        { status: 400 }
      );
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error(`[Email API] Resend error for ${to}:`, error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`[Email API] Email sent to ${to}: ${data?.id}`);
    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("[Email API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

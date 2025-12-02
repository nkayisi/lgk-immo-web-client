# 🏠 LGK Immo - Plateforme Immobilière Moderne

Plateforme immobilière nouvelle génération avec authentification Better-Auth intégrée, analyses géospatiales et cartographie interactive.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
pnpm install
```

### 2. Configuration

Créer un fichier `.env.local` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lgk_immo"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-super-secret-key-min-32-characters-long"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OAuth - Facebook
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

### 3. Base de Données

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Lancer l'Application

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Guide de configuration complet
- **[IMPLEMENTATION_COMPLETE.md](../IMPLEMENTATION_COMPLETE.md)** - Détails d'implémentation

## 🛠️ Stack Technique

- **Framework**: Next.js 16 (App Router)
- **Authentification**: Better-Auth (intégré)
- **Base de données**: PostgreSQL + Prisma 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **TypeScript**: Type-safety complète

## 📁 Structure

```
src/
├── app/
│   ├── api/auth/[...all]/     # Better-Auth API routes
│   ├── (auth)/                # Pages d'authentification
│   ├── (protected)/           # Pages protégées
│   └── page.tsx               # Page d'accueil
├── components/
│   ├── home/                  # Composants page d'accueil
│   ├── auth/                  # Formulaires auth
│   └── ui/                    # Composants UI
├── lib/
│   ├── auth.ts                # Config Better-Auth
│   └── auth-client.ts         # Client Better-Auth
└── middleware.ts              # Protection des routes
```

## 🔐 Authentification

- ✅ Email/Password
- ✅ OAuth Google
- ✅ OAuth Facebook
- ✅ JWT + Refresh Tokens
- ✅ Sessions en DB
- ✅ Cookies sécurisés

## 🎨 Fonctionnalités

- ✅ Page d'accueil immobilière premium
- ✅ Propriétés en vedette
- ✅ Baromètres de marché
- ✅ Carte interactive
- ✅ Design responsive
- ✅ Navigation moderne

## 📝 Scripts

```bash
pnpm dev          # Développement
pnpm build        # Build production
pnpm start        # Démarrer en production
pnpm lint         # Linter
pnpm prisma:studio # DB GUI
```

## 🔗 Liens Utiles

- [Next.js Docs](https://nextjs.org/docs)
- [Better-Auth Docs](https://better-auth.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**LGK Immo** - Plateforme immobilière avec intelligence géospatiale

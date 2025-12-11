"use client";

import { useSession } from "@/lib/auth-client";
import { useProfile } from "@/contexts/profile-context";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Building2,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Search,
  User,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Profile,
  isIndividualProfile,
  getProfileDisplayName,
  IndividualProfile,
  BusinessProfile,
  VerificationStatus,
} from "@/lib/graphql/types";

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const stats = [
  {
    label: "Annonces actives",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Building2,
    color: "emerald",
    href: "/dashboard/properties",
  },
  {
    label: "Vues totales",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Eye,
    color: "blue",
    href: "/dashboard/properties",
  },
  {
    label: "Messages",
    value: "0",
    change: "0 nouveaux",
    trend: "neutral",
    icon: MessageSquare,
    color: "purple",
    href: "/dashboard/messages",
  },
  {
    label: "Favoris reçus",
    value: "0",
    change: "+0%",
    trend: "up",
    icon: Heart,
    color: "rose",
    href: "/dashboard/favorites",
  },
];

const quickActions = [
  {
    title: "Créer une annonce",
    description: "Publiez votre bien immobilier",
    icon: Plus,
    href: "/dashboard/properties/new",
    gradient: "from-emerald-500 to-cyan-500",
    primary: true,
  },
  {
    title: "Rechercher",
    description: "Explorer les biens disponibles",
    icon: Search,
    href: "/search",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Mes favoris",
    description: "Voir les biens sauvegardés",
    icon: Heart,
    href: "/dashboard/favorites",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Messages",
    description: "Consulter vos conversations",
    icon: MessageSquare,
    href: "/dashboard/messages",
    gradient: "from-purple-500 to-violet-500",
  },
];

const recentActivities = [
  {
    type: "view",
    message: "Votre annonce a été consultée 5 fois",
    time: "Il y a 2h",
    icon: Eye,
    color: "blue",
  },
  {
    type: "favorite",
    message: "Quelqu'un a ajouté votre bien en favori",
    time: "Il y a 5h",
    icon: Heart,
    color: "rose",
  },
  {
    type: "message",
    message: "Nouveau message de Jean Kabongo",
    time: "Hier",
    icon: MessageSquare,
    color: "purple",
  },
  {
    type: "listing",
    message: "Votre annonce a été approuvée",
    time: "Il y a 2 jours",
    icon: CheckCircle2,
    color: "emerald",
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const Icon = stat.icon;
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={stat.href}>
        <Card className="hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-xl ${
                  colorClasses[stat.color]
                } flex items-center justify-center`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {stat.trend === "up" && (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-slate-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function QuickActionCard({
  action,
  index,
}: {
  action: (typeof quickActions)[0];
  index: number;
}) {
  const Icon = action.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      <Link href={action.href}>
        <Card
          className={`h-full hover:shadow-lg transition-all cursor-pointer group overflow-hidden ${
            action.primary ? "border-0" : ""
          }`}
        >
          <CardContent
            className={`p-6 h-full ${
              action.primary
                ? `bg-gradient-to-br ${action.gradient} text-white`
                : ""
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                action.primary
                  ? "bg-white/20"
                  : `bg-gradient-to-br ${action.gradient} text-white`
              } group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-7 h-7" />
            </div>
            <h3
              className={`font-semibold text-lg mb-1 ${
                action.primary ? "text-white" : "text-slate-900"
              }`}
            >
              {action.title}
            </h3>
            <p
              className={`text-sm ${
                action.primary ? "text-white/80" : "text-slate-500"
              }`}
            >
              {action.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function ActivityItem({
  activity,
  index,
}: {
  activity: (typeof recentActivities)[0];
  index: number;
}) {
  const Icon = activity.icon;
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    rose: "bg-rose-100 text-rose-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
    >
      <div
        className={`w-10 h-10 rounded-xl ${
          colorClasses[activity.color]
        } flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-700 font-medium">{activity.message}</p>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {activity.time}
        </p>
      </div>
    </motion.div>
  );
}

function ProfileCompletionCard({ profile }: { profile: Profile }) {
  const isIndividual = isIndividualProfile(profile);
  const verificationStatus =
    profile.verifications?.[0]?.status || VerificationStatus.PENDING;

  // Calculer la progression du profil
  const calculateProgress = () => {
    let filled = 0;
    let total = 0;

    if (isIndividual) {
      const p = profile as IndividualProfile;
      const fields = [
        p.firstName,
        p.lastName,
        p.phoneNumber,
        p.country,
        p.city,
        p.address,
        p.dateOfBirth,
        p.gender,
      ];
      total = fields.length;
      filled = fields.filter(Boolean).length;
    } else {
      const p = profile as BusinessProfile;
      const fields = [
        p.businessName,
        p.phoneNumber,
        p.country,
        p.city,
        p.address,
        p.registrationNumber,
        p.taxId,
        p.legalRepresentativeName,
      ];
      total = fields.length;
      filled = fields.filter(Boolean).length;
    }

    return Math.round((filled / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  isIndividual
                    ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500"
                }`}
              >
                {isIndividual ? (
                  <User className="w-8 h-8" />
                ) : (
                  <Building2 className="w-8 h-8" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">Complétez votre profil</h3>
                <p className="text-slate-400 text-sm">
                  Un profil complet augmente vos chances d&apos;être contacté de
                  80%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 md:w-48">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progression</span>
                  <span className="font-medium text-emerald-400">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  />
                </div>
              </div>
              <Link href="/dashboard/profile">
                <Button variant="secondary" className="gap-2">
                  Compléter
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function DashboardPage() {
  const { data: session } = useSession();
  const { profile } = useProfile();

  if (!session?.user || !profile) {
    return null;
  }

  const displayName = getProfileDisplayName(profile);
  const isIndividual = isIndividualProfile(profile);
  const firstName = isIndividual
    ? (profile as IndividualProfile).firstName || displayName
    : displayName;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Bonjour, {firstName} 👋
            </h1>
            <p className="text-slate-600 mt-2">
              Bienvenue sur votre tableau de bord. Gérez vos annonces et suivez
              vos performances.
            </p>
          </div>
          <Link href="/dashboard/properties/new">
            <Button variant="primary" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Nouvelle annonce
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Actions rapides
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={action.title}
                action={action}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Activité récente
            </h2>
            <Link
              href="/dashboard/activity"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Tout voir
            </Link>
          </div>
          <Card>
            <CardContent className="p-2">
              {recentActivities.length > 0 ? (
                <div className="space-y-1">
                  {recentActivities.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      activity={activity}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Aucune activité récente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Completion */}
      <ProfileCompletionCard profile={profile} />
    </div>
  );
}

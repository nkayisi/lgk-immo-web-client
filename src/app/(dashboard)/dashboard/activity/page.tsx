"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Filter,
  Heart,
  MessageSquare,
  Plus,
  RefreshCw,
  Trash2,
  User,
  XCircle
} from "lucide-react";
import { useState } from "react";

// =============================================================================
// TYPES
// =============================================================================

type ActivityType =
  | "listing_created"
  | "listing_updated"
  | "listing_deleted"
  | "listing_viewed"
  | "listing_favorited"
  | "message_sent"
  | "message_received"
  | "profile_updated"
  | "verification_submitted"
  | "verification_approved"
  | "verification_rejected"
  | "login"
  | "payment";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    propertyTitle?: string;
    propertyId?: string;
    userName?: string;
    amount?: number;
    currency?: string;
  };
}

interface Transaction {
  id: string;
  type: "payment" | "refund" | "subscription";
  status: "completed" | "pending" | "failed";
  amount: number;
  currency: string;
  description: string;
  date: string;
  reference: string;
}

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "listing_viewed",
    title: "Annonce consultée",
    description: "Votre annonce a été consultée 15 fois",
    timestamp: "2024-02-15T14:30:00",
    metadata: {
      propertyTitle: "Villa moderne avec piscine",
      propertyId: "prop-1",
    },
  },
  {
    id: "2",
    type: "message_received",
    title: "Nouveau message",
    description: "Vous avez reçu un message de Jean Kabongo",
    timestamp: "2024-02-15T12:15:00",
    metadata: {
      userName: "Jean Kabongo",
      propertyTitle: "Villa moderne avec piscine",
    },
  },
  {
    id: "3",
    type: "listing_favorited",
    title: "Ajouté aux favoris",
    description: "Quelqu'un a ajouté votre annonce en favori",
    timestamp: "2024-02-15T10:45:00",
    metadata: {
      propertyTitle: "Villa moderne avec piscine",
    },
  },
  {
    id: "4",
    type: "listing_created",
    title: "Annonce créée",
    description: "Vous avez publié une nouvelle annonce",
    timestamp: "2024-02-14T16:00:00",
    metadata: {
      propertyTitle: "Appartement de standing",
      propertyId: "prop-2",
    },
  },
  {
    id: "5",
    type: "verification_approved",
    title: "Vérification approuvée",
    description: "Votre document d'identité a été vérifié",
    timestamp: "2024-02-14T09:30:00",
  },
  {
    id: "6",
    type: "profile_updated",
    title: "Profil mis à jour",
    description: "Vous avez modifié vos informations personnelles",
    timestamp: "2024-02-13T15:20:00",
  },
  {
    id: "7",
    type: "listing_updated",
    title: "Annonce modifiée",
    description: "Vous avez mis à jour le prix de votre annonce",
    timestamp: "2024-02-12T11:00:00",
    metadata: {
      propertyTitle: "Villa moderne avec piscine",
    },
  },
  {
    id: "8",
    type: "login",
    title: "Connexion",
    description: "Connexion depuis un nouvel appareil",
    timestamp: "2024-02-11T08:45:00",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "t1",
    type: "payment",
    status: "completed",
    amount: 50,
    currency: "USD",
    description: "Mise en avant - Villa moderne avec piscine",
    date: "2024-02-15",
    reference: "TXN-2024-001",
  },
  {
    id: "t2",
    type: "subscription",
    status: "completed",
    amount: 99,
    currency: "USD",
    description: "Abonnement Premium - Février 2024",
    date: "2024-02-01",
    reference: "SUB-2024-002",
  },
  {
    id: "t3",
    type: "payment",
    status: "pending",
    amount: 25,
    currency: "USD",
    description: "Boost annonce - Appartement de standing",
    date: "2024-01-28",
    reference: "TXN-2024-003",
  },
  {
    id: "t4",
    type: "refund",
    status: "completed",
    amount: 15,
    currency: "USD",
    description: "Remboursement - Annonce expirée",
    date: "2024-01-20",
    reference: "REF-2024-001",
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function getActivityIcon(type: ActivityType) {
  const icons: Record<ActivityType, { icon: typeof Eye; color: string }> = {
    listing_created: { icon: Plus, color: "bg-emerald-100 text-emerald-600" },
    listing_updated: { icon: Edit3, color: "bg-blue-100 text-blue-600" },
    listing_deleted: { icon: Trash2, color: "bg-red-100 text-red-600" },
    listing_viewed: { icon: Eye, color: "bg-purple-100 text-purple-600" },
    listing_favorited: { icon: Heart, color: "bg-rose-100 text-rose-600" },
    message_sent: { icon: ArrowUpRight, color: "bg-cyan-100 text-cyan-600" },
    message_received: {
      icon: ArrowDownLeft,
      color: "bg-indigo-100 text-indigo-600",
    },
    profile_updated: { icon: User, color: "bg-slate-100 text-slate-600" },
    verification_submitted: {
      icon: FileText,
      color: "bg-amber-100 text-amber-600",
    },
    verification_approved: {
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    verification_rejected: { icon: XCircle, color: "bg-red-100 text-red-600" },
    login: { icon: User, color: "bg-slate-100 text-slate-600" },
    payment: { icon: CreditCard, color: "bg-green-100 text-green-600" },
  };
  return icons[type] || { icon: Clock, color: "bg-slate-100 text-slate-600" };
}

function ActivityItem({ activity }: { activity: Activity }) {
  const { icon: Icon, color } = getActivityIcon(activity.type);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 py-4"
    >
      <div
        className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-slate-900">{activity.title}</p>
            <p className="text-sm text-slate-500">{activity.description}</p>
            {activity.metadata?.propertyTitle && (
              <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {activity.metadata.propertyTitle}
              </p>
            )}
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {formatTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const statusConfig: Record<
    Transaction["status"],
    { label: string; variant: "success" | "warning" | "destructive" }
  > = {
    completed: { label: "Complété", variant: "success" },
    pending: { label: "En attente", variant: "warning" },
    failed: { label: "Échoué", variant: "destructive" },
  };

  const typeConfig: Record<
    Transaction["type"],
    { label: string; icon: typeof CreditCard }
  > = {
    payment: { label: "Paiement", icon: ArrowUpRight },
    refund: { label: "Remboursement", icon: ArrowDownLeft },
    subscription: { label: "Abonnement", icon: RefreshCw },
  };

  const TypeIcon = typeConfig[transaction.type].icon;
  const isRefund = transaction.type === "refund";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isRefund ? "bg-emerald-100" : "bg-slate-100"
          }`}
        >
          <TypeIcon
            className={`w-5 h-5 ${
              isRefund ? "text-emerald-600" : "text-slate-600"
            }`}
          />
        </div>
        <div>
          <p className="font-medium text-slate-900">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{typeConfig[transaction.type].label}</span>
            <span>•</span>
            <span>{transaction.reference}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            isRefund ? "text-emerald-600" : "text-slate-900"
          }`}
        >
          {isRefund ? "+" : "-"}
          {transaction.amount} {transaction.currency}
        </p>
        <div className="flex items-center gap-2 justify-end mt-1">
          <Badge variant={statusConfig[transaction.status].variant}>
            {statusConfig[transaction.status].label}
          </Badge>
          <span className="text-xs text-slate-400">
            {new Date(transaction.date).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityTimeline({ activities }: { activities: Activity[] }) {
  // Grouper par date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dayActivities]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-slate-500 mb-2 capitalize">
            {date}
          </h3>
          <Card>
            <CardContent className="divide-y divide-slate-100 p-0 px-4">
              {dayActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ type }: { type: "activity" | "transaction" }) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
        {type === "activity" ? (
          <Clock className="w-10 h-10 text-slate-400" />
        ) : (
          <CreditCard className="w-10 h-10 text-slate-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {type === "activity" ? "Aucune activité" : "Aucune transaction"}
      </h3>
      <p className="text-slate-500 max-w-md mx-auto">
        {type === "activity"
          ? "Votre historique d'activité apparaîtra ici une fois que vous commencerez à utiliser la plateforme."
          : "Vos transactions et paiements apparaîtront ici."}
      </p>
    </div>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function ActivityPage() {
  const [activities] = useState<Activity[]>(mockActivities);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7days");

  const activityTypes = [
    { value: "all", label: "Toutes les activités" },
    { value: "listings", label: "Annonces" },
    { value: "messages", label: "Messages" },
    { value: "profile", label: "Profil" },
    { value: "verification", label: "Vérification" },
  ];

  const filteredActivities = activities.filter((activity) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "listings") {
      return activity.type.startsWith("listing_");
    }
    if (activityFilter === "messages") {
      return activity.type.startsWith("message_");
    }
    if (activityFilter === "profile") {
      return activity.type === "profile_updated" || activity.type === "login";
    }
    if (activityFilter === "verification") {
      return activity.type.startsWith("verification_");
    }
    return true;
  });

  // Stats
  const stats = {
    totalViews:
      activities.filter((a) => a.type === "listing_viewed").length * 15,
    totalFavorites: activities.filter((a) => a.type === "listing_favorited")
      .length,
    totalMessages: activities.filter((a) => a.type.startsWith("message_"))
      .length,
    totalTransactions: transactions.filter((t) => t.status === "completed")
      .length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Historique & Activités
          </h1>
          <p className="text-slate-600 mt-1">
            Suivez toutes vos actions et transactions
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalViews}
                </p>
                <p className="text-sm text-slate-500">Vues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalFavorites}
                </p>
                <p className="text-sm text-slate-500">Favoris</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalMessages}
                </p>
                <p className="text-sm text-slate-500">Messages</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.totalTransactions}
                </p>
                <p className="text-sm text-slate-500">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity" className="gap-2">
            <Clock className="w-4 h-4" />
            Activités
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="90days">3 derniers mois</SelectItem>
                <SelectItem value="all">Tout l&apos;historique</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Activity Timeline */}
          {filteredActivities.length === 0 ? (
            <EmptyState type="activity" />
          ) : (
            <ActivityTimeline activities={filteredActivities} />
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {transactions.length === 0 ? (
              <EmptyState type="transaction" />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Historique des transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    {transactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

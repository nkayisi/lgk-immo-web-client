"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  Eye,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Lock,
  Key,
  Trash2,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Check,
  Loader2,
  Monitor,
  Languages,
  HelpCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// =============================================================================
// TYPES
// =============================================================================

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const initialNotifications: NotificationSetting[] = [
  {
    id: "messages",
    label: "Messages",
    description: "Recevoir une notification pour les nouveaux messages",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "listings",
    label: "Activité sur mes annonces",
    description: "Vues, favoris et demandes de contact",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "favorites",
    label: "Mises à jour des favoris",
    description: "Changements de prix ou de disponibilité",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "marketing",
    label: "Actualités et promotions",
    description: "Nouvelles fonctionnalités et offres spéciales",
    email: false,
    push: false,
    sms: false,
  },
];

const initialPrivacy: PrivacySetting[] = [
  {
    id: "profile_visible",
    label: "Profil public",
    description: "Permettre aux autres utilisateurs de voir votre profil",
    enabled: true,
  },
  {
    id: "show_phone",
    label: "Afficher le téléphone",
    description: "Afficher votre numéro sur vos annonces",
    enabled: true,
  },
  {
    id: "show_email",
    label: "Afficher l'email",
    description: "Permettre le contact par email",
    enabled: false,
  },
  {
    id: "online_status",
    label: "Statut en ligne",
    description: "Montrer quand vous êtes connecté",
    enabled: true,
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function SettingRow({
  icon: Icon,
  label,
  description,
  action,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  action: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            danger ? "bg-red-100" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${danger ? "text-red-600" : "text-slate-600"}`}
          />
        </div>
        <div>
          <p
            className={`font-medium ${
              danger ? "text-red-600" : "text-slate-900"
            }`}
          >
            {label}
          </p>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function NotificationSettings() {
  const [notifications, setNotifications] =
    useState<NotificationSetting[]>(initialNotifications);

  const toggleNotification = (
    id: string,
    channel: "email" | "push" | "sms"
  ) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Gérez comment vous souhaitez être notifié
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="text-left font-medium pb-4">Type</th>
                <th className="text-center font-medium pb-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </th>
                <th className="text-center font-medium pb-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <Smartphone className="w-4 h-4" />
                    Push
                  </div>
                </th>
                <th className="text-center font-medium pb-4 px-4">
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    SMS
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <tr key={notification.id}>
                  <td className="py-4">
                    <p className="font-medium text-slate-900">
                      {notification.label}
                    </p>
                    <p className="text-sm text-slate-500">
                      {notification.description}
                    </p>
                  </td>
                  <td className="text-center px-4">
                    <Switch
                      checked={notification.email}
                      onCheckedChange={() =>
                        toggleNotification(notification.id, "email")
                      }
                    />
                  </td>
                  <td className="text-center px-4">
                    <Switch
                      checked={notification.push}
                      onCheckedChange={() =>
                        toggleNotification(notification.id, "push")
                      }
                    />
                  </td>
                  <td className="text-center px-4">
                    <Switch
                      checked={notification.sms}
                      onCheckedChange={() =>
                        toggleNotification(notification.id, "sms")
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PrivacySettings() {
  const [privacy, setPrivacy] = useState<PrivacySetting[]>(initialPrivacy);

  const togglePrivacy = (id: string) => {
    setPrivacy((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Confidentialité
        </CardTitle>
        <CardDescription>
          Contrôlez qui peut voir vos informations
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100">
        {privacy.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-medium text-slate-900">{setting.label}</p>
              <p className="text-sm text-slate-500">{setting.description}</p>
            </div>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => togglePrivacy(setting.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("fr");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          Apparence
        </CardTitle>
        <CardDescription>
          Personnalisez l&apos;apparence de l&apos;application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Thème
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", label: "Clair", icon: Sun },
              { value: "dark", label: "Sombre", icon: Moon },
              { value: "system", label: "Système", icon: Monitor },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    theme === option.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      theme === option.value
                        ? "text-emerald-600"
                        : "text-slate-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      theme === option.value
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Langue
          </label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full md:w-64">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ln">Lingala</SelectItem>
              <SelectItem value="sw">Swahili</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = async () => {
    setIsChangingPassword(true);
    // Simuler l'API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsChangingPassword(false);
    setChangePasswordOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Protégez votre compte avec ces options de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <SettingRow
            icon={Key}
            label="Mot de passe"
            description="Dernière modification il y a 3 mois"
            action={
              <Button
                variant="outline"
                onClick={() => setChangePasswordOpen(true)}
              >
                Modifier
              </Button>
            }
          />
          <SettingRow
            icon={Lock}
            label="Authentification à deux facteurs"
            description="Ajoutez une couche de sécurité supplémentaire"
            action={
              <div className="flex items-center gap-3">
                {twoFactorEnabled && (
                  <Badge variant="success" className="gap-1">
                    <Check className="w-3 h-3" />
                    Activé
                  </Badge>
                )}
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
            }
          />
          <SettingRow
            icon={Smartphone}
            label="Sessions actives"
            description="Gérez vos appareils connectés"
            action={
              <Button variant="ghost" size="sm">
                Voir
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre mot de passe actuel et choisissez un nouveau mot de
              passe sécurisé.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mot de passe actuel
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nouveau mot de passe
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangePasswordOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleChangePassword}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DangerZone() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "SUPPRIMER") return;

    setIsDeleting(true);
    // Simuler l'API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeleting(false);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles sur votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100">
          <SettingRow
            icon={LogOut}
            label="Déconnexion de tous les appareils"
            description="Déconnectez toutes les sessions actives"
            action={<Button variant="outline">Déconnecter tout</Button>}
          />
          <SettingRow
            icon={Trash2}
            label="Supprimer mon compte"
            description="Supprimez définitivement votre compte et toutes vos données"
            action={
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Supprimer
              </Button>
            }
            danger
          />
        </CardContent>
      </Card>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Supprimer le compte
            </DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes vos données, annonces et
              messages seront définitivement supprimés.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
              <p className="text-sm text-red-700">
                Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
              </p>
            </div>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              className="font-mono"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmText("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={confirmText !== "SUPPRIMER" || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-600 mt-1">
          Gérez vos préférences et paramètres de compte
        </p>
      </motion.div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Eye className="w-4 h-4" />
            Confidentialité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Monitor className="w-4 h-4" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NotificationSettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PrivacySettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AppearanceSettings />
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <SecuritySettings />
            <DangerZone />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Besoin d&apos;aide ?
                  </h3>
                  <p className="text-sm text-slate-500">
                    Consultez notre centre d&apos;aide ou contactez le support
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Centre d&apos;aide
                </Button>
                <Button variant="primary" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contacter le support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

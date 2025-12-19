"use client";

import { useProfile } from "@/contexts/profile-context";
import {
    getProfileDisplayName,
    getProfileTypeLabel,
    getProfileRoleLabel,
    ProfileType,
    ProfileRole,
} from "@/lib/profile/types";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    Building2,
    ChevronDown,
    Heart,
    Home,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Settings,
    User,
    Users,
    Briefcase,
    Key,
    Check,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const mainNavigation: NavSection[] = [
    {
        title: "COMPTE",
        items: [
            { label: "Tableau de bord", href: "/account", icon: LayoutDashboard },
            { label: "Activités", href: "/account/activity", icon: Activity },
            { label: "Mes annonces", href: "/account/properties", icon: Building2 },
            { label: "Favoris", href: "/account/favorites", icon: Heart },
            { label: "Messages", href: "/account/messages", icon: MessageSquare },
        ],
    },
    {
        title: "PARAMÈTRES",
        items: [
            { label: "Mon profil", href: "/account/profile", icon: User },
            { label: "Paramètres", href: "/account/settings", icon: Settings },
        ],
    },
];

const roleIcons: Record<ProfileRole, React.ElementType> = {
    [ProfileRole.TENANT]: Home,
    [ProfileRole.LANDLORD]: Key,
    [ProfileRole.AGENT]: Briefcase,
};

export function AccountSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, profiles, switchProfile, isLoading } = useProfile();
    const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleSwitchProfile = async (profileId: string) => {
        if (profileId !== profile?.id) {
            await switchProfile(profileId);
        }
        setShowProfileSwitcher(false);
    };

    const isActive = (href: string) => {
        if (href === "/account") {
            return pathname === "/account";
        }
        return pathname.startsWith(href);
    };

    const activeRoles = profile?.profileRoles?.map((r) => r.role) || [];

    return (
        <aside className="w-64 sticky top-20 min-h-[calc(100vh-5rem)] bg-[#faf8f5] border-r border-slate-200 hidden sm:flex flex-col">
            {/* Profile Switcher */}
            <div className="p-4 border-b border-slate-200">
                <div className="relative">
                    <button
                        onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                                {profile ? getProfileDisplayName(profile).charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                                    {profile ? getProfileDisplayName(profile) : "Chargement..."}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {profile ? getProfileTypeLabel(profile.profileType) : ""}
                                </p>
                            </div>
                        </div>
                        <ChevronDown
                            className={cn(
                                "w-4 h-4 text-slate-400 transition-transform",
                                showProfileSwitcher && "rotate-180"
                            )}
                        />
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                        {showProfileSwitcher && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-50"
                            >
                                <div className="p-2">
                                    <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">
                                        Changer de profil
                                    </p>
                                    {profiles.map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleSwitchProfile(p.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                                p.id === profile?.id
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "hover:bg-slate-50 text-slate-700"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                                    p.profileType === ProfileType.INDIVIDUAL
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-purple-100 text-purple-600"
                                                )}
                                            >
                                                {p.profileType === ProfileType.INDIVIDUAL ? (
                                                    <User className="w-4 h-4" />
                                                ) : (
                                                    <Building2 className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-sm font-medium">{getProfileDisplayName(p)}</p>
                                                <p className="text-xs text-slate-500">
                                                    {getProfileTypeLabel(p.profileType)}
                                                </p>
                                            </div>
                                            {p.id === profile?.id && (
                                                <Check className="w-4 h-4 text-emerald-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {mainNavigation.map((section) => (
                    <div key={section.title} className="mb-6">
                        <p className="px-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {section.title}
                        </p>
                        <ul className="space-y-1 px-3">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}

                {/* Espaces / Rôles */}
                {activeRoles.length > 0 && (
                    <div className="mb-6">
                        <p className="px-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            MES ESPACES
                        </p>
                        <ul className="space-y-1 px-3">
                            {activeRoles.map((role) => {
                                const Icon = roleIcons[role];
                                return (
                                    <li key={role}>
                                        <Link
                                            href={`/account/space/${role.toLowerCase()}`}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                                pathname.includes(`/space/${role.toLowerCase()}`)
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            )}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {getProfileRoleLabel(role)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-200">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Déconnexion
                </button>
            </div>
        </aside>
    );
}

"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Globe,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  User,
  X,
  Activity,
  ChevronDown,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/contexts/profile-context";
import { getProfileDisplayName, getProfileTypeLabel, ProfileType } from "@/lib/profile/types";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileProfileSwitcher, setShowMobileProfileSwitcher] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useSession();
  const { profile, profiles, switchProfile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  // Obtenir les initiales de l'utilisateur
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/20 backdrop-blur-xl border-b border-slate-200"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-semibold text-xl text-slate-900">
              LGK<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Ajouter un bien */}
            <Link
              href="/dashboard/properties/new"
              className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Deposer une annonce
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200" />

            {/* Language */}
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">FR</span>
            </button>

            {/* Auth - Conditionnel */}
            {isPending ? (
              // Loading state
              <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
            ) : user ? (
              // Utilisateur connecté - Menu avatar
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 hover:shadow-md transition-all bg-white"
                >
                  <Menu className="w-4 h-4 text-slate-500 ml-1" />
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Avatar"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(user.name)}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-medium text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Mon Compte</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          <span>Favoris</span>
                        </Link>
                        <Link
                          href="/account/properties"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>Mes annonces</span>
                        </Link>
                        <Link
                          href="/account/messages"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span>Messages</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 py-2">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Déconnexion</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Utilisateur non connecté - Boutons auth
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/get-started"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lock body scroll when menu is open */}
      {isOpen && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}

      {/* Mobile Menu - Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black"
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 bg-white w-[75%] max-w-[280px] shadow-2xl"
            >
              {/* Header avec bouton fermer */}
              <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <span className="font-semibold text-lg text-slate-900">
                    LGK<span className="text-emerald-500">.</span>
                  </span>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Menu Content - Scrollable */}
              <div className="bg-white overflow-y-auto h-[calc(100vh-4rem)] px-4 py-5">
                {/* Ajouter un bien - CTA principal */}
                <Link
                  href="/dashboard/properties/new"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl shadow-md shadow-emerald-500/20 mb-5"
                >
                  <Plus className="w-4 h-4" />
                  Deposer une annonce
                </Link>

                {user ? (
                  // Menu utilisateur connecté (mobile)
                  <div className="space-y-0.5">
                    {/* Profile Switcher */}
                    <div className="mb-4">
                      <button
                        onClick={() => setShowMobileProfileSwitcher(!showMobileProfileSwitcher)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                            {profile ? getProfileDisplayName(profile).charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 truncate max-w-[140px]">
                              {profile ? getProfileDisplayName(profile) : user.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {profile ? getProfileTypeLabel(profile.profileType) : user.email}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-slate-400 transition-transform",
                            showMobileProfileSwitcher && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Profile Dropdown */}
                      <AnimatePresence>
                        {showMobileProfileSwitcher && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 bg-white rounded-xl border border-slate-200 overflow-hidden"
                          >
                            <div className="p-2">
                              <p className="px-3 py-2 text-xs font-medium text-slate-400 uppercase">
                                Changer de profil
                              </p>
                              {profiles.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={async () => {
                                    if (p.id !== profile?.id) {
                                      await switchProfile(p.id);
                                    }
                                    setShowMobileProfileSwitcher(false);
                                  }}
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

                    {/* Navigation Links */}
                 
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname === "/account"
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname === "/account" ? "bg-blue-200" : "bg-blue-50"
                      )}>
                        <LayoutDashboard className={cn(
                          "w-4 h-4",
                          pathname === "/account" ? "text-blue-700" : "text-blue-600"
                        )} />
                      </div>
                      <span className="text-sm">Tableau de bord</span>
                    </Link>
                    <Link
                      href="/account/activity"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname === "/account/activity"
                          ? "bg-yellow-100 text-yellow-700"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname === "/account/activity" ? "bg-yellow-200" : "bg-yellow-50"
                      )}>
                        <Activity className={cn(
                          "w-4 h-4",
                          pathname === "/account/activity" ? "text-yellow-700" : "text-yellow-600"
                        )} />
                      </div>
                      <span className="text-sm">Activités</span>
                    </Link>
                    <Link
                      href="/account/properties"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname.startsWith("/account/properties")
                          ? "bg-orange-100 text-orange-700"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname.startsWith("/account/properties") ? "bg-orange-200" : "bg-orange-50"
                      )}>
                        <Building2 className={cn(
                          "w-4 h-4",
                          pathname.startsWith("/account/properties") ? "text-orange-700" : "text-orange-600"
                        )} />
                      </div>
                      <span className="text-sm">Mes annonces</span>
                    </Link>
                    <Link
                      href="/account/favorites"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname.startsWith("/account/favorites")
                          ? "bg-pink-100 text-pink-700"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname.startsWith("/account/favorites") ? "bg-pink-200" : "bg-pink-50"
                      )}>
                        <Heart className={cn(
                          "w-4 h-4",
                          pathname.startsWith("/account/favorites") ? "text-pink-700" : "text-pink-600"
                        )} />
                      </div>
                      <span className="text-sm">Favoris</span>
                    </Link>
                    <Link
                      href="/account/messages"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname.startsWith("/account/messages")
                          ? "bg-purple-100 text-purple-700"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname.startsWith("/account/messages") ? "bg-purple-200" : "bg-purple-50"
                      )}>
                        <MessageSquare className={cn(
                          "w-4 h-4",
                          pathname.startsWith("/account/messages") ? "text-purple-700" : "text-purple-600"
                        )} />
                      </div>
                      <span className="text-sm">Messages</span>
                    </Link>

                    <div className="my-3 border-t border-slate-100" />

                    <Link
                      href="/account/profile"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname.startsWith("/account/profile")
                          ? "bg-slate-200 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname.startsWith("/account/profile") ? "bg-slate-300" : "bg-slate-100"
                      )}>
                        <User className={cn(
                          "w-4 h-4",
                          pathname.startsWith("/account/profile") ? "text-slate-900" : "text-slate-600"
                        )} />
                      </div>
                      <span className="text-sm">Mon profil</span>
                    </Link>
                    <Link
                      href="/account/settings"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-2 rounded-lg transition-colors",
                        pathname.startsWith("/account/settings")
                          ? "bg-slate-200 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        pathname.startsWith("/account/settings") ? "bg-slate-300" : "bg-slate-100"
                      )}>
                        <Settings className={cn(
                          "w-4 h-4",
                          pathname.startsWith("/account/settings") ? "text-slate-900" : "text-slate-600"
                        )} />
                      </div>
                      <span className="text-sm">Paramètres</span>
                    </Link>

                    {/* Déconnexion */}
                    <div className="pt-4 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 py-2 px-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Boutons auth (mobile)
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 text-sm border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/get-started"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full py-2.5 text-sm bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      S&apos;inscrire
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

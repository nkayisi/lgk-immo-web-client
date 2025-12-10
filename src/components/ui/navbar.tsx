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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = useSession();
  const router = useRouter();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/20 backdrop-blur-xl border-b border-slate-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Tableau de bord</span>
                        </Link>
                        <Link
                          href="/dashboard/properties"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span>Mes annonces</span>
                        </Link>
                        <Link
                          href="/dashboard/favorites"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-slate-400" />
                          <span>Favoris</span>
                        </Link>
                        <Link
                          href="/dashboard/messages"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          <span>Messages</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 py-2">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Mon profil</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Paramètres</span>
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
                  href="/register"
                  className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-50 bg-white"
          >
            {/* Header avec bouton fermer */}
            <div className="flex items-center justify-between px-4 h-20 border-b border-slate-100">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="font-semibold text-xl text-slate-900">
                  LGK<span className="text-emerald-500">.</span>
                </span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content - Scrollable */}
            <div className="bg-white overflow-y-auto h-[calc(100vh-5rem)] px-6 py-8">
              {/* Ajouter un bien - CTA principal */}
              <Link
                href="/dashboard/properties/new"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 mb-8"
              >
                <Plus className="w-5 h-5" />
                Deposer une annonce
              </Link>

              {user ? (
                // Menu utilisateur connecté (mobile)
                <div className="space-y-2">
                  {/* User Info Card */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Avatar"}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-xl font-medium">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <LayoutDashboard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="font-medium">Tableau de bord</span>
                  </Link>
                  <Link
                    href="/dashboard/properties"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Mes annonces</span>
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="font-medium">Favoris</span>
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Messages</span>
                  </Link>

                  <div className="my-4 border-t border-slate-100" />

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-medium">Mon profil</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 py-1.5 px-2.5 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-medium">Paramètres</span>
                  </Link>

                  {/* Déconnexion */}
                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-4 py-1.5 px-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-medium">Déconnexion</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Boutons auth (mobile)
                <div className="space-y-4">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full py-3 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

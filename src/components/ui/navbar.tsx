"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Globe,
  User,
  Plus,
  LayoutDashboard,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
                  S'inscrire
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Ajouter un bien */}
              <Link
                href="/dashboard/properties/new"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                <Plus className="w-5 h-5 text-emerald-500" />
                Deposer une annonce
              </Link>

              {user ? (
                // Menu utilisateur connecté (mobile)
                <div className="pt-4 border-t border-slate-100 space-y-1">
                  {/* User Info */}
                  <div className="flex items-center gap-3 py-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "Avatar"}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-medium">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                    Tableau de bord
                  </Link>
                  <Link
                    href="/dashboard/properties"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <Building2 className="w-5 h-5 text-slate-400" />
                    Mes annonces
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <Heart className="w-5 h-5 text-slate-400" />
                    Favoris
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    Messages
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <User className="w-5 h-5 text-slate-400" />
                    Mon profil
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 py-3 text-slate-700"
                  >
                    <Settings className="w-5 h-5 text-slate-400" />
                    Paramètres
                  </Link>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 text-red-600 w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                // Boutons auth (mobile)
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 text-center bg-slate-900 text-white font-medium rounded-xl"
                  >
                    S'inscrire
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

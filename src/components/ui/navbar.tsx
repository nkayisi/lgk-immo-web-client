"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Menu,
  X,
  Search,
  MapPin,
  Home,
  Key,
  Shield,
  Globe2,
  ChevronDown,
  User,
} from "lucide-react";

const navLinks = [
  {
    label: "Acheter",
    href: "/buy",
    icon: Home,
    submenu: [
      { label: "Villas", href: "/buy/villas" },
      { label: "Appartements", href: "/buy/apartments" },
      { label: "Terrains", href: "/buy/land" },
      { label: "Commerces", href: "/buy/commercial" },
    ],
  },
  {
    label: "Louer",
    href: "/rent",
    icon: Key,
    submenu: [
      { label: "Longue durée", href: "/rent/long-term" },
      { label: "Courte durée", href: "/rent/short-term" },
      { label: "Meublé", href: "/rent/furnished" },
    ],
  },
  { label: "Carte", href: "/map", icon: MapPin },
  { label: "Certification", href: "/certification", icon: Shield },
  { label: "Diaspora", href: "/diaspora", icon: Globe2 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-emerald-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 via-cyan-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Building2 className="w-7 h-7 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white">LGK Immo</span>
              <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">
                RD Congo
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() =>
                  link.submenu && setActiveSubmenu(link.label)
                }
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors rounded-xl hover:bg-white/5"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                  {link.submenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {link.submenu && activeSubmenu === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {link.submenu.map((sublink, i) => (
                        <Link
                          key={i}
                          href={sublink.href}
                          className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2.5 text-slate-300 hover:text-white font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              Connexion
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/register"
                className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold overflow-hidden group shadow-lg shadow-emerald-500/30"
              >
                <span className="relative z-10">S'inscrire</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950/98 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher un bien..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Mobile Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors"
                >
                  <link.icon className="w-5 h-5 text-emerald-400" />
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center text-slate-300 hover:bg-white/5 rounded-xl font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30"
                >
                  S'inscrire gratuitement
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

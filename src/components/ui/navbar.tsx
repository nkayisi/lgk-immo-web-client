"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, User, Plus } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

            {/* Auth */}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

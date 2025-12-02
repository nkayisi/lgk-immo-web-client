"use client";

import Link from "next/link";
import {
  MapPin,
  Search,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Play,
  Globe2,
  Users,
  FileCheck,
  Sparkles,
  TrendingUp,
  Home,
  Key,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    value: "80%",
    label: "Litiges fonciers",
    sublabel: "en RDC",
    icon: AlertTriangle,
    color: "text-amber-400",
  },
  {
    value: "100%",
    label: "Biens certifiés",
    sublabel: "sur LGK",
    icon: Shield,
    color: "text-emerald-400",
  },
  {
    value: "5K+",
    label: "Diaspora",
    sublabel: "connectée",
    icon: Globe2,
    color: "text-cyan-400",
  },
];

const features = [
  { icon: Shield, label: "Certification sans conflit" },
  { icon: MapPin, label: "Cartographie des risques" },
  { icon: FileCheck, label: "Documents vérifiés" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-900 pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mesh Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-600/5 via-transparent to-transparent" />

        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        {/* Floating Orbs */}
        <motion.div
          animate={{ y: [0, -50, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge - Contexte RDC */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full"
            >
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-100" />
              </div>
              <span className="text-sm font-semibold text-white">
                Plateforme Immobilière Sécurisée • RD Congo
              </span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
              >
                Investissez en
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400">
                  toute confiance
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl"
              >
                La première plateforme qui{" "}
                <span className="text-emerald-400 font-semibold">sécurise</span>{" "}
                vos transactions immobilières en RDC. Certification des biens,
                cartographie des risques, transparence totale.
              </motion.p>
            </div>

            {/* Trust Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-slate-300"
                >
                  <feature.icon className="w-4 h-4 text-emerald-400" />
                  {feature.label}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-cyan-600 text-white rounded-2xl font-semibold overflow-hidden shadow-2xl shadow-emerald-500/30"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Explorer les biens
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/10 transition-all"
                >
                  <Play className="w-5 h-5" />
                  Comment ça marche
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span
                      className={`text-3xl sm:text-4xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.sublabel}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual - Property Card Stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <motion.div
              whileHover={{ y: -8, rotateY: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Property Image Area */}
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-amber-500/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-white/20" />
                </div>

                {/* Certification Badge */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg"
                >
                  <Shield className="w-4 h-4" />
                  Certifié Sans Conflit
                </motion.div>

                {/* Risk Score */}
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-emerald-500/50">
                  <span className="text-emerald-400">●</span> Risque Faible
                </div>

                {/* Property Type */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-amber-500/90 text-white text-sm font-bold rounded-full">
                  Villa Premium
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      Résidence Les Jardins
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      Kinshasa, Gombe
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      $385,000
                    </div>
                    <div className="text-xs text-slate-500">
                      Prix négociable
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">20m</div>
                    <div className="text-xs text-slate-500">Longueur</div>
                  </div>
                  <div className="text-center border-x border-white/10">
                    <div className="text-lg font-bold text-white">15m</div>
                    <div className="text-xs text-slate-500">Largeur</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">4</div>
                    <div className="text-xs text-slate-500">Chambres</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                    Voir les détails
                  </button>
                  <button className="p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all">
                    <Play className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Background Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute top-8 -right-8 w-full h-full bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-xl border border-white/10 rounded-3xl -z-10"
            />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 0.3, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute top-16 -right-16 w-full h-full bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 backdrop-blur-xl border border-white/10 rounded-3xl -z-20"
            />

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-xl"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 p-4 bg-gradient-to-br from-amber-500/20 to-amber-500/10 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-xl"
            >
              <Scale className="w-8 h-8 text-amber-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Shield,
  Heart,
  Eye,
  Play,
  ArrowRight,
  Sparkles,
  Building2,
  Home,
  Star,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const properties = [
  {
    id: 1,
    title: "Villa Prestige Gombe",
    location: "Kinshasa, Gombe",
    price: "$485,000",
    dimensions: "25m × 20m",
    bedrooms: 5,
    type: "Villa",
    badge: "Premium",
    badgeColor: "from-amber-500 to-orange-500",
    certified: true,
    riskLevel: "low",
    virtualTour: true,
    image: "from-emerald-500/30 via-cyan-500/20 to-blue-500/30",
  },
  {
    id: 2,
    title: "Appartement Standing",
    location: "Kinshasa, Ngaliema",
    price: "$180,000",
    dimensions: "15m × 12m",
    bedrooms: 3,
    type: "Appartement",
    badge: "Nouveau",
    badgeColor: "from-emerald-500 to-cyan-500",
    certified: true,
    riskLevel: "low",
    virtualTour: true,
    image: "from-violet-500/30 via-purple-500/20 to-pink-500/30",
  },
  {
    id: 3,
    title: "Terrain Constructible",
    location: "Kinshasa, Limete",
    price: "$95,000",
    dimensions: "30m × 25m",
    bedrooms: 0,
    type: "Terrain",
    badge: "Opportunité",
    badgeColor: "from-blue-500 to-indigo-500",
    certified: true,
    riskLevel: "medium",
    virtualTour: false,
    image: "from-amber-500/30 via-orange-500/20 to-red-500/30",
  },
  {
    id: 4,
    title: "Duplex Moderne",
    location: "Kinshasa, Bandalungwa",
    price: "$320,000",
    dimensions: "20m × 18m",
    bedrooms: 4,
    type: "Duplex",
    badge: "Coup de cœur",
    badgeColor: "from-rose-500 to-pink-500",
    certified: true,
    riskLevel: "low",
    virtualTour: true,
    image: "from-cyan-500/30 via-teal-500/20 to-emerald-500/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturedProperties() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Sélection Premium
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Offres du{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                moment
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl">
              Découvrez notre sélection de biens certifiés, vérifiés et prêts
              pour votre investissement.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all group"
          >
            Voir tout
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            >
              {/* Image Area */}
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${property.image} overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-white/20" />
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`px-3 py-1.5 bg-gradient-to-r ${property.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}
                  >
                    {property.badge}
                  </motion.div>

                  {property.certified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/90 text-white text-xs font-semibold rounded-full">
                      <Shield className="w-3 h-3" />
                      Certifié
                    </div>
                  )}
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.riskLevel === "low"
                        ? "bg-emerald-500/80 text-white"
                        : "bg-amber-500/80 text-white"
                    }`}
                  >
                    {property.riskLevel === "low"
                      ? "● Risque faible"
                      : "● Risque moyen"}
                  </div>

                  {property.virtualTour && (
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
                      <Play className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20">
                  <Heart className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                    <span className="px-2 py-0.5 bg-white/5 rounded text-xs">
                      {property.type}
                    </span>
                    <span>•</span>
                    <span>{property.dimensions}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {property.location}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      {property.price}
                    </div>
                    {property.bedrooms > 0 && (
                      <div className="text-xs text-slate-500">
                        {property.bedrooms} chambres
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-xl hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all"
                  >
                    <Eye className="w-5 h-5 text-emerald-400" />
                  </motion.button>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left pr-4">
              <div className="text-white font-semibold">
                +2,500 biens disponibles
              </div>
              <div className="text-sm text-slate-400">
                Tous certifiés et vérifiés
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

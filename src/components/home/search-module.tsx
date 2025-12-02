"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Home,
  Key,
  Building2,
  Calendar,
  ChevronDown,
  Sparkles,
  Filter,
  SlidersHorizontal,
} from "lucide-react";

const propertyTypes = [
  { id: "all", label: "Tous", icon: Building2 },
  { id: "sale", label: "Achat", icon: Home },
  { id: "rent", label: "Location", icon: Key },
  { id: "short", label: "Courte durée", icon: Calendar },
];

const locations = [
  "Kinshasa, Gombe",
  "Kinshasa, Ngaliema",
  "Kinshasa, Limete",
  "Kinshasa, Bandalungwa",
  "Lubumbashi",
  "Goma",
];

export function SearchModule() {
  const [activeType, setActiveType] = useState("all");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <section className="relative py-8 -mt-24 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-amber-500/20 rounded-3xl blur-2xl" />

          {/* Main Container */}
          <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            {/* Property Type Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-white/10">
              {propertyTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeType === type.id
                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </motion.button>
              ))}

              {/* AI Badge */}
              <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">
                  Recherche IA
                </span>
              </div>
            </div>

            {/* Search Fields */}
            <div className="p-6">
              <div className="grid md:grid-cols-12 gap-4">
                {/* Location */}
                <div className="md:col-span-4 relative">
                  <label className="block text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                    Localisation
                  </label>
                  <button
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-left hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-emerald-400" />
                      <span
                        className={
                          selectedLocation ? "text-white" : "text-slate-500"
                        }
                      >
                        {selectedLocation || "Où cherchez-vous ?"}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isLocationOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isLocationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        {locations.map((location, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSelectedLocation(location);
                              setIsLocationOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-emerald-400" />
                            {location}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Dimensions */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                    Longueur (m)
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                    Largeur (m)
                  </label>
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                {/* Budget */}
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                    Budget Max
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="500,000"
                      className="w-full pl-8 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2 flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                  >
                    <Search className="w-5 h-5" />
                    Rechercher
                  </motion.button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/10">
                <span className="text-sm text-slate-500">Filtres rapides:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Certifié sans conflit",
                    "Visite virtuelle",
                    "Prix négociable",
                    "Nouveau",
                  ].map((filter, i) => (
                    <button
                      key={i}
                      className="px-3 py-1.5 text-sm text-slate-400 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    >
                      {filter}
                    </button>
                  ))}
                  <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-all">
                    <SlidersHorizontal className="w-3 h-3" />
                    Plus de filtres
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

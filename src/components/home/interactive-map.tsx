"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Layers,
  Navigation,
  Maximize2,
  Filter,
  AlertTriangle,
  Shield,
  TrendingUp,
  Building2,
  Eye,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const mapLocations = [
  {
    id: 1,
    name: "Gombe",
    properties: 245,
    risk: "low",
    x: "45%",
    y: "35%",
    trend: "+12%",
  },
  {
    id: 2,
    name: "Ngaliema",
    properties: 189,
    risk: "low",
    x: "25%",
    y: "45%",
    trend: "+8%",
  },
  {
    id: 3,
    name: "Limete",
    properties: 312,
    risk: "medium",
    x: "65%",
    y: "40%",
    trend: "+5%",
  },
  {
    id: 4,
    name: "Bandalungwa",
    properties: 156,
    risk: "low",
    x: "40%",
    y: "60%",
    trend: "+15%",
  },
  {
    id: 5,
    name: "Kintambo",
    properties: 98,
    risk: "high",
    x: "20%",
    y: "65%",
    trend: "-2%",
  },
];

const mapLegend = [
  {
    color: "bg-emerald-500",
    label: "Risque faible",
    description: "Zone sécurisée",
  },
  {
    color: "bg-amber-500",
    label: "Risque moyen",
    description: "Vigilance requise",
  },
  { color: "bg-red-500", label: "Risque élevé", description: "Zone à éviter" },
];

export function InteractiveMap() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
            <MapPin className="w-4 h-4" />
            Cartographie Intelligente
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Explorez le marché{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              en temps réel
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Notre système d&apos;information géographique vous permet de visualiser
            les risques, les opportunités et les tendances du marché immobilier
            congolais.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Map Controls */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {[
                    { icon: Layers, label: "Couches" },
                    { icon: Filter, label: "Filtres" },
                    { icon: Navigation, label: "Ma position" },
                  ].map((control, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white hover:border-white/20 transition-all"
                    >
                      <control.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{control.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium">
                    Kinshasa, RDC
                  </div>
                  <button className="p-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all">
                    <Maximize2 className="w-4 h-4 text-slate-300" />
                  </button>
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                <button className="p-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all">
                  <ZoomIn className="w-4 h-4 text-slate-300" />
                </button>
                <button className="p-2 bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all">
                  <ZoomOut className="w-4 h-4 text-slate-300" />
                </button>
              </div>

              {/* Mock Map Area */}
              <div className="relative h-[500px] bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

                {/* Heatmap Effect */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                  <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
                  <div className="absolute bottom-1/4 left-1/5 w-24 h-24 bg-red-500/20 rounded-full blur-3xl" />
                </div>

                {/* Location Markers */}
                {mapLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.2, zIndex: 50 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: location.x, top: location.y }}
                  >
                    {/* Pulse Animation */}
                    <div className="absolute inset-0 -m-2">
                      <div
                        className={`w-full h-full rounded-full animate-ping ${
                          location.risk === "low"
                            ? "bg-emerald-500/30"
                            : location.risk === "medium"
                            ? "bg-amber-500/30"
                            : "bg-red-500/30"
                        }`}
                      />
                    </div>

                    {/* Marker */}
                    <div
                      className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                        location.risk === "low"
                          ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-emerald-500/50"
                          : location.risk === "medium"
                          ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/50"
                          : "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/50"
                      }`}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                      <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white">
                            {location.name}
                          </h4>
                          <span
                            className={`text-xs font-semibold ${
                              location.trend.startsWith("+")
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {location.trend}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                          <Building2 className="w-4 h-4" />
                          {location.properties} propriétés
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            location.risk === "low"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : location.risk === "medium"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {location.risk === "low" ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {location.risk === "low"
                            ? "Zone sécurisée"
                            : location.risk === "medium"
                            ? "Vigilance"
                            : "Zone à risque"}
                        </div>
                        {/* Arrow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 border-r border-b border-white/10 rotate-45" />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Map Legend - Bottom */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-white mb-3">
                    Légende des risques
                  </p>
                  <div className="space-y-2">
                    {mapLegend.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${item.color} rounded-full`} />
                        <span className="text-xs text-slate-300">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Statistiques Kinshasa
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Biens disponibles
                  </span>
                  <span className="text-white font-bold">1,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Prix moyen</span>
                  <span className="text-white font-bold">$185,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Zones sécurisées
                  </span>
                  <span className="text-emerald-400 font-bold">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Tendance</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +8.5%
                  </span>
                </div>
              </div>
            </div>

            {/* Popular Zones */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Zones Populaires
              </h3>
              <div className="space-y-3">
                {mapLocations.slice(0, 4).map((location) => (
                  <motion.div
                    key={location.id}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          location.risk === "low"
                            ? "bg-emerald-500/20"
                            : location.risk === "medium"
                            ? "bg-amber-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        <MapPin
                          className={`w-5 h-5 ${
                            location.risk === "low"
                              ? "text-emerald-400"
                              : location.risk === "medium"
                              ? "text-amber-400"
                              : "text-red-400"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {location.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {location.properties} biens
                        </p>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-slate-500" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
            >
              Explorer la carte complète
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

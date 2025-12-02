"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  MapPin,
  Clock,
  Target,
} from "lucide-react";

const insights = [
  {
    title: "Prix Moyen",
    value: "$215K",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs. année dernière",
    color: "from-emerald-500 to-cyan-500",
    bgColor: "from-emerald-500/10 to-cyan-500/10",
  },
  {
    title: "Transactions",
    value: "1,847",
    change: "+28.3%",
    trend: "up",
    icon: BarChart3,
    description: "ce trimestre",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-500/10 to-purple-500/10",
  },
  {
    title: "Délai de Vente",
    value: "45j",
    change: "-15%",
    trend: "up",
    icon: Clock,
    description: "en moyenne",
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-500/10 to-orange-500/10",
  },
  {
    title: "Demande",
    value: "Forte",
    change: "+35%",
    trend: "up",
    icon: Target,
    description: "acheteurs actifs",
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-500/10 to-pink-500/10",
  },
];

const marketTrends = [
  { month: "Jan", value: 65 },
  { month: "Fév", value: 72 },
  { month: "Mar", value: 68 },
  { month: "Avr", value: 85 },
  { month: "Mai", value: 78 },
  { month: "Jun", value: 92 },
];

const topZones = [
  { name: "Gombe", growth: "+18%", properties: 245, avgPrice: "$320K" },
  { name: "Ngaliema", growth: "+12%", properties: 189, avgPrice: "$185K" },
  { name: "Limete", growth: "+8%", properties: 312, avgPrice: "$145K" },
];

export function MarketInsights() {
  const maxValue = Math.max(...marketTrends.map((t) => t.value));

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            Baromètre du Marché
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Insights{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              immobiliers
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Suivez les tendances du marché immobilier congolais en temps réel et
            prenez des décisions éclairées.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-6 bg-gradient-to-br ${insight.bgColor} backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <insight.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-1">
                <p className="text-sm text-slate-400">{insight.title}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {insight.value}
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      insight.trend === "up"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {insight.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {insight.change}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{insight.description}</p>
              </div>

              {/* Decorative */}
              <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${insight.color} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Évolution du Marché
                </h3>
                <p className="text-sm text-slate-400">
                  Indice de croissance 2024
                </p>
              </div>
              <div className="flex items-center gap-2">
                {["6M", "1A", "Max"].map((period, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      i === 0
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64 flex items-end justify-between gap-4">
              {marketTrends.map((trend, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(trend.value / maxValue) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-xl relative group cursor-pointer"
                    style={{ height: "100%" }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {trend.value}%
                    </div>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/50 to-cyan-500/50 rounded-t-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
                  </div>
                  <span className="text-xs text-slate-500">{trend.month}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Zones */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Top Zones</h3>
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-4">
              {topZones.map((zone, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-emerald-400">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{zone.name}</p>
                        <p className="text-xs text-slate-500">
                          {zone.properties} biens
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-semibold text-sm">
                      {zone.growth}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Prix moyen</span>
                    <span className="text-white font-medium">
                      {zone.avgPrice}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Voir toutes les zones →
            </button>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20 rounded-3xl"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Rapport Mensuel Disponible
                </h4>
                <p className="text-sm text-slate-400">
                  Analyse complète du marché immobilier congolais - Décembre
                  2024
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/30"
            >
              Télécharger gratuitement
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

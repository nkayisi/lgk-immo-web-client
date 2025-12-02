"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Map,
  Video,
  FileCheck,
  BarChart3,
  Globe2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";

const tools = [
  {
    icon: Shield,
    title: "Certification Sans Conflit",
    description:
      "Vérification complète de l'historique foncier et juridique de chaque bien avant mise en ligne.",
    features: [
      "Analyse cadastrale",
      "Vérification des titres",
      "Historique des propriétaires",
    ],
    color: "from-emerald-500 to-cyan-500",
    bgColor: "from-emerald-500/10 to-cyan-500/10",
    borderColor: "border-emerald-500/30",
  },
  {
    icon: Map,
    title: "Cartographie des Risques",
    description:
      "Visualisez les zones à risque, les conflits en cours et les tendances du marché sur une carte interactive.",
    features: [
      "Heatmap des litiges",
      "Zones sécurisées",
      "Analyse géospatiale",
    ],
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-500/10 to-orange-500/10",
    borderColor: "border-amber-500/30",
  },
  {
    icon: Video,
    title: "Visites Virtuelles 360°",
    description:
      "Explorez les biens à distance avec nos visites immersives, idéal pour la diaspora.",
    features: ["Visite 360°", "Plans interactifs", "Mesures précises"],
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-500/10 to-purple-500/10",
    borderColor: "border-violet-500/30",
  },
  {
    icon: BarChart3,
    title: "Analyse Géo-Décisionnelle",
    description:
      "Prenez des décisions éclairées grâce à nos analyses de marché et prévisions de valeur.",
    features: ["Estimation de prix", "Tendances du marché", "ROI prévisionnel"],
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-500/10 to-blue-500/10",
    borderColor: "border-cyan-500/30",
  },
  {
    icon: FileCheck,
    title: "Documentation Automatisée",
    description:
      "Génération automatique de tous les documents nécessaires pour une transaction sécurisée.",
    features: ["Contrats types", "Checklist juridique", "Suivi notarial"],
    color: "from-rose-500 to-pink-500",
    bgColor: "from-rose-500/10 to-pink-500/10",
    borderColor: "border-rose-500/30",
  },
  {
    icon: Globe2,
    title: "Accompagnement Diaspora",
    description:
      "Service dédié pour les Congolais de l'étranger souhaitant investir en toute sérénité.",
    features: ["Agent dédié", "Visites à distance", "Gestion locative"],
    color: "from-indigo-500 to-violet-500",
    bgColor: "from-indigo-500/10 to-violet-500/10",
    borderColor: "border-indigo-500/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ToolsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Technologie de pointe
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Outils{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400">
              innovants
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Une suite d'outils technologiques conçus pour sécuriser et
            simplifier vos investissements immobiliers en RD Congo.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative p-6 bg-gradient-to-br ${tool.bgColor} backdrop-blur-xl border ${tool.borderColor} rounded-3xl overflow-hidden`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 shadow-lg`}
              >
                <tool.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                {tool.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                {tool.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {tool.features.map((feature, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className={`p-2 rounded-full bg-gradient-to-r ${tool.color}`}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "100%", label: "Biens vérifiés" },
            { value: "24/7", label: "Support disponible" },
            { value: "15+", label: "Experts juridiques" },
            { value: "5K+", label: "Clients satisfaits" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

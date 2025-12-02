"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Eye,
  Scale,
  FileWarning,
  Users,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const problems = [
  {
    icon: AlertTriangle,
    title: "8 litiges sur 10",
    description:
      "En RDC, 80% des conflits judiciaires concernent des problèmes fonciers et parcellaires.",
    color: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
    iconColor: "text-red-400",
  },
  {
    icon: Eye,
    title: "Manque de transparence",
    description:
      "Prix injustifiés, informations cachées, historique des biens inaccessible.",
    color: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
  {
    icon: Users,
    title: "Intermédiaires non réglementés",
    description:
      "Agents informels, commissions abusives, aucune garantie légale.",
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    icon: FileWarning,
    title: "Documentation incomplète",
    description:
      "Titres fonciers douteux, cadastre non mis à jour, risques juridiques élevés.",
    color: "from-rose-500/20 to-pink-500/20",
    borderColor: "border-rose-500/30",
    iconColor: "text-rose-400",
  },
];

const solutions = [
  { icon: Shield, text: "Certification des biens sans conflit" },
  { icon: Scale, text: "Vérification juridique complète" },
  { icon: Eye, text: "Transparence totale des prix" },
  { icon: CheckCircle2, text: "Agents certifiés et réglementés" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function MarketProblems() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Comprendre les enjeux
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Le marché immobilier en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">
              RD Congo
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Un environnement à haut risque qui nécessite une approche innovante
            pour protéger les investisseurs et la diaspora.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {problems.map((problem, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-6 bg-gradient-to-br ${problem.color} backdrop-blur-xl border ${problem.borderColor} rounded-2xl group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-4 ${problem.iconColor}`}
              >
                <problem.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {problem.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {problem.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-emerald-500/10 rounded-3xl blur-xl" />

          <div className="relative bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Notre solution
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white">
                  LGK-IMMO{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    sécurise
                  </span>{" "}
                  vos investissements
                </h3>
                <p className="text-lg text-slate-300">
                  Nous avons développé une plateforme technologique qui répond
                  directement aux défis du marché congolais, en apportant
                  transparence, sécurité et professionnalisme à chaque
                  transaction.
                </p>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
                >
                  Découvrir nos garanties
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Right - Features */}
              <div className="grid grid-cols-2 gap-4">
                {solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-5 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-3">
                      <solution.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-white font-medium text-sm">
                      {solution.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          {/* Without LGK */}
          <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h4 className="text-lg font-bold text-white">Sans LGK-IMMO</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Risque de litiges fonciers",
                "Prix non vérifiés",
                "Documents douteux",
                "Aucune garantie",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-slate-400 text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With LGK */}
          <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h4 className="text-lg font-bold text-white">Avec LGK-IMMO</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Biens certifiés sans conflit",
                "Prix transparents et justifiés",
                "Documents vérifiés par experts",
                "Garantie satisfaction",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-slate-400 text-sm"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

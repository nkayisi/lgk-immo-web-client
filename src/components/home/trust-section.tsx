"use client";

import { motion } from "framer-motion";
import { Shield, FileCheck, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Biens certifiés",
    description:
      "Chaque propriété est vérifiée et certifiée par nos experts locaux.",
  },
  {
    icon: FileCheck,
    title: "Titres fonciers vérifiés",
    description: "Vérification légale complète pour éviter tout litige.",
  },
  {
    icon: MapPin,
    title: "Cartographie des risques",
    description: "Analyse géographique des zones à risque avant achat.",
  },
  {
    icon: Users,
    title: "Support diaspora",
    description: "Accompagnement dédié pour les Congolais de l'étranger.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
            Pourquoi choisir LGK ?
          </h2>
          <p className="text-lg text-slate-600">
            La première plateforme immobilière en RDC qui garantit la sécurité
            de vos transactions.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl mb-5">
                <feature.icon className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-200"
        >
          {[
            { value: "2,500+", label: "Biens certifiés" },
            { value: "15K+", label: "Utilisateurs" },
            { value: "0", label: "Litiges" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          >
            En savoir plus sur notre processus
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

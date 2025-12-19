"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bell, Globe, Lock, Shield } from "lucide-react";

const settingsSections = [
    {
        title: "Notifications",
        description: "Gérez vos préférences de notifications",
        icon: Bell,
        color: "blue",
    },
    {
        title: "Sécurité",
        description: "Mot de passe et authentification",
        icon: Lock,
        color: "emerald",
    },
    {
        title: "Confidentialité",
        description: "Contrôlez vos données personnelles",
        icon: Shield,
        color: "purple",
    },
    {
        title: "Langue et région",
        description: "Préférences linguistiques et régionales",
        icon: Globe,
        color: "orange",
    },
];

export default function SettingsPage() {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        emerald: "bg-emerald-100 text-emerald-600",
        purple: "bg-purple-100 text-purple-600",
        orange: "bg-orange-100 text-orange-600",
    };

    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
                <p className="text-slate-500 mt-1">
                    Configurez votre compte et vos préférences.
                </p>
            </motion.div>

            {/* Settings Sections */}
            <div className="space-y-4">
                {settingsSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-xl ${colorClasses[section.color]} flex items-center justify-center`}
                                            >
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-slate-900">
                                                    {section.title}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {section.description}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Modifier
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

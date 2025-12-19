"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

export default function NewPropertyPage() {
    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Nouvelle annonce</h1>
                <p className="text-slate-500 mt-1">
                    Créez une nouvelle annonce immobilière.
                </p>
            </motion.div>

            {/* Coming Soon */}
            <Card className="bg-white">
                <CardContent className="py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Formulaire en cours de développement
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Le formulaire de création d&apos;annonce sera bientôt disponible.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

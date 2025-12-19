"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building2, Plus } from "lucide-react";
import Link from "next/link";

export default function PropertiesPage() {
    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mes annonces</h1>
                    <p className="text-slate-500 mt-1">
                        Gérez vos annonces immobilières.
                    </p>
                </div>
                <Link href="/account/properties/new">
                    <Button variant="primary" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Nouvelle annonce
                    </Button>
                </Link>
            </motion.div>

            {/* Empty State */}
            <Card className="bg-white">
                <CardContent className="py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Aucune annonce
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            Vous n&apos;avez pas encore publié d&apos;annonce. Commencez par créer
                            votre première annonce.
                        </p>
                        <Link href="/account/properties/new">
                            <Button variant="primary" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Créer une annonce
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

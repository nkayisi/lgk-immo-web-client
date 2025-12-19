"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Favoris</h1>
                <p className="text-slate-500 mt-1">
                    Retrouvez tous les biens que vous avez sauvegardés.
                </p>
            </motion.div>

            {/* Empty State */}
            <Card className="bg-white">
                <CardContent className="py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-rose-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Aucun favori
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Vous n&apos;avez pas encore ajouté de bien en favori. Explorez les
                            annonces et sauvegardez celles qui vous intéressent.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

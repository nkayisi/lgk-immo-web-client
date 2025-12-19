"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
                <p className="text-slate-500 mt-1">
                    Consultez et gérez vos conversations.
                </p>
            </motion.div>

            {/* Empty State */}
            <Card className="bg-white">
                <CardContent className="py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Aucun message
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            Vous n&apos;avez pas encore de conversation. Les messages des
                            personnes intéressées par vos annonces apparaîtront ici.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    Activity,
    CheckCircle2,
    Clock,
    Eye,
    Heart,
    MessageSquare,
} from "lucide-react";

const activities = [
    {
        type: "view",
        message: "Votre annonce a été consultée 5 fois",
        time: "Il y a 2h",
        icon: Eye,
        color: "blue",
    },
    {
        type: "favorite",
        message: "Quelqu'un a ajouté votre bien en favori",
        time: "Il y a 5h",
        icon: Heart,
        color: "rose",
    },
    {
        type: "message",
        message: "Nouveau message de Jean Kabongo",
        time: "Hier",
        icon: MessageSquare,
        color: "purple",
    },
    {
        type: "listing",
        message: "Votre annonce a été approuvée",
        time: "Il y a 2 jours",
        icon: CheckCircle2,
        color: "emerald",
    },
    {
        type: "view",
        message: "Votre annonce 'Appartement T3' a été consultée",
        time: "Il y a 3 jours",
        icon: Eye,
        color: "blue",
    },
];

function ActivityItem({
    activity,
    index,
}: {
    activity: (typeof activities)[0];
    index: number;
}) {
    const Icon = activity.icon;
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        rose: "bg-rose-100 text-rose-600",
        purple: "bg-purple-100 text-purple-600",
        emerald: "bg-emerald-100 text-emerald-600",
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
        >
            <div
                className={`w-10 h-10 rounded-lg ${colorClasses[activity.color]} flex items-center justify-center flex-shrink-0`}
            >
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 font-medium">{activity.message}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                </p>
            </div>
        </motion.div>
    );
}

export default function ActivityPage() {
    return (
        <div>
            {/* Page Title */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-slate-900">Activités</h1>
                <p className="text-slate-500 mt-1">
                    Suivez toutes vos activités récentes sur la plateforme.
                </p>
            </motion.div>

            {/* Activities List */}
            <Card className="bg-white">
                <CardContent className="p-0">
                    {activities.length > 0 ? (
                        <div>
                            {activities.map((activity, index) => (
                                <ActivityItem key={index} activity={activity} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Aucune activité pour le moment</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

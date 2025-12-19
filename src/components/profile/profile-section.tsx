"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
    editForm?: React.ReactNode;
    onSave?: () => Promise<void>;
}

export function ProfileSection({ title, children, editForm, onSave }: ProfileSectionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (onSave) {
            setIsSaving(true);
            try {
                await onSave();
                setIsEditing(false);
            } catch (error) {
                console.error("Erreur lors de la sauvegarde:", error);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <Card className="bg-white">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>{title}</CardTitle>
                    {editForm && !isEditing && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Modifier
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isEditing && editForm ? (
                    <div className="space-y-4">
                        {editForm}
                        <div className="flex items-center gap-3 pt-4 border-t">
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="gap-2"
                            >
                                <X className="w-4 h-4" />
                                Annuler
                            </Button>
                        </div>
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | null | undefined;
    placeholder?: string;
}

export function InfoRow({ icon, label, value, placeholder = "Non renseigné" }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 py-2">
            <div className="text-slate-400 mt-0.5">{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className={`font-medium ${!value ? "text-slate-400 italic" : "text-slate-900"}`}>
                    {value || placeholder}
                </p>
            </div>
        </div>
    );
}

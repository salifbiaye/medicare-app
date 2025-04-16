// lib/toast-alert.tsx
"use client";

import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, Loader2, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert } from "@/components/ui/alert";

// Types d'alerte
export type AlertType = "success" | "error" | "info" | "loading" | "payment";

// Interface pour la fonction de toast
export interface ToastAlertProps {
    type: AlertType;
    title: string;
    description: string;
    badge?: string;
    duration?: number;
}

// Configuration des styles par type d'alerte
const alertStyles = {
    success: {
        container: "border-green-100 dark:border-green-900/50",
        background: "bg-white dark:bg-zinc-900",
        iconBackground: "bg-green-50 dark:bg-green-950/50",
        iconRing: "ring-green-50/50 dark:ring-green-950/25",
        iconColor: "text-green-600 dark:text-green-400",
        titleColor: "text-green-900 dark:text-green-100",
        descriptionColor: "text-green-600 dark:text-green-400",
        badgeBackground: "bg-green-100 dark:bg-green-900/50",
        badgeText: "text-green-700 dark:text-green-300",
        blur: "bg-green-100 dark:bg-green-900/25",
    },
    error: {
        container: "border-red-100 dark:border-red-900/50",
        background: "bg-white dark:bg-zinc-900",
        iconBackground: "bg-red-50 dark:bg-red-950/50",
        iconRing: "ring-red-50/50 dark:ring-red-950/25",
        iconColor: "text-red-600 dark:text-red-400",
        titleColor: "text-red-900 dark:text-red-100",
        descriptionColor: "text-red-600 dark:text-red-400",
        badgeBackground: "bg-red-100 dark:bg-red-900/50",
        badgeText: "text-red-700 dark:text-red-300",
        blur: "bg-red-100 dark:bg-red-900/25",
    },
    info: {
        container: "border-blue-100 dark:border-blue-900/50",
        background: "bg-white dark:bg-zinc-900",
        iconBackground: "bg-blue-50 dark:bg-blue-950/50",
        iconRing: "ring-blue-50/50 dark:ring-blue-950/25",
        iconColor: "text-blue-600 dark:text-blue-400",
        titleColor: "text-blue-900 dark:text-blue-100",
        descriptionColor: "text-blue-600 dark:text-blue-400",
        badgeBackground: "bg-blue-100 dark:bg-blue-900/50",
        badgeText: "text-blue-700 dark:text-blue-300",
        blur: "bg-blue-100 dark:bg-blue-900/25",
    },
    loading: {
        container: "border-purple-100 dark:border-purple-900/50",
        background: "bg-white dark:bg-zinc-900",
        iconBackground: "bg-purple-50 dark:bg-purple-950/50",
        iconRing: "ring-purple-50/50 dark:ring-purple-950/25",
        iconColor: "text-purple-600 dark:text-purple-400",
        titleColor: "text-purple-900 dark:text-purple-100",
        descriptionColor: "text-purple-600 dark:text-purple-400",
        badgeBackground: "bg-purple-100 dark:bg-purple-900/50",
        badgeText: "text-purple-700 dark:text-purple-300",
        blur: "bg-purple-100 dark:bg-purple-900/25",
    },
    payment: {
        container: "border-emerald-100 dark:border-emerald-900/50",
        background: "bg-white dark:bg-zinc-900",
        iconBackground: "bg-emerald-50 dark:bg-emerald-950/50",
        iconRing: "ring-emerald-50/50 dark:ring-emerald-950/25",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        titleColor: "text-emerald-900 dark:text-emerald-100",
        descriptionColor: "text-emerald-600 dark:text-emerald-400",
        badgeBackground: "bg-emerald-100 dark:bg-emerald-900/50",
        badgeText: "text-emerald-700 dark:text-emerald-300",
        blur: "bg-emerald-100 dark:bg-emerald-900/25",
    },
};

// Fonction pour obtenir l'icône en fonction du type
const getIcon = (type: AlertType, styles: any) => {
    switch (type) {
        case "success":
            return <CheckCircle className={`h-5 w-5 ${styles.iconColor}`} />;
        case "error":
            return <AlertCircle className={`h-5 w-5 ${styles.iconColor}`} />;
        case "info":
            return <Info className={`h-5 w-5 ${styles.iconColor}`} />;
        case "loading":
            return <Loader2 className={`h-5 w-5 ${styles.iconColor} animate-spin`} />;
        case "payment":
            return <CircleDollarSign className={`h-5 w-5 ${styles.iconColor}`} />;
        default:
            return <Info className={`h-5 w-5 ${styles.iconColor}`} />;
    }
};

// Composant d'alerte pour le toast
const CustomToastAlert = ({
                              type,
                              title,
                              description,
                              badge,
                          }: Omit<ToastAlertProps, "duration">) => {
    const styles = alertStyles[type];

    return (
        <Alert
            className={cn(
                "relative overflow-hidden",
                styles.background,
                styles.container,
                "shadow-sm",
                "p-4  rounded-xl flex flex-row w-full "
            )}
        >
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                    <div
                        className={cn(
                            "w-10 h-10 rounded-full",
                            styles.iconBackground,
                            "flex items-center justify-center",
                            styles.iconRing
                        )}
                    >
                        {getIcon(type, styles)}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`text-base font-medium ${styles.titleColor}`}>{title}</h3>
                            {badge && (
                                <span
                                    className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${styles.badgeBackground} ${styles.badgeText}`}
                                >
                  {badge}
                </span>
                            )}
                        </div>
                        <p className={`text-sm ${styles.descriptionColor}`}>{description}</p>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className={`absolute -left-2 -top-2 w-24 h-24 rounded-full ${styles.blur} blur-2xl opacity-50`}
                />
                <div
                    className={`absolute -right-2 -bottom-2 w-24 h-24 rounded-full ${styles.blur} blur-2xl opacity-50`}
                />
            </div>
        </Alert>
    );
};

// Fonctions d'utilitaires pour afficher les différents types de toasts
export const toastAlert = {
    success: (props: Omit<ToastAlertProps, "type">) => {
        toast.custom(() => <CustomToastAlert type="success" {...props} />, {
            duration: props.duration || 4000,
        });
    },
    error: (props: Omit<ToastAlertProps, "type">) => {
        toast.custom(() => <CustomToastAlert type="error" {...props} />, {
            duration: props.duration || 5000,
        });
    },
    info: (props: Omit<ToastAlertProps, "type">) => {
        toast.custom(() => <CustomToastAlert type="info" {...props} />, {
            duration: props.duration || 4000,
        });
    },
    loading: (props: Omit<ToastAlertProps, "type">) => {
        return toast.custom(() => <CustomToastAlert type="loading" {...props} />, {
            duration: props.duration || 4000,
        });
    },
    payment: (props: Omit<ToastAlertProps, "type">) => {
        toast.custom(() => <CustomToastAlert type="payment" {...props} />, {
            duration: props.duration || 4000,
        });
    },
    // Méthode générique pour un contrôle complet
    custom: (props: ToastAlertProps) => {
        toast.custom(() => <CustomToastAlert {...props} />, {
            duration: props.duration || 4000,
        });
    },
};
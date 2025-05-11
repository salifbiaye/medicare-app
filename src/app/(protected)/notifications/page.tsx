"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, isToday, isYesterday, isThisWeek, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import {
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Filter,
    Info,
    MessageSquare,
    Search,
    Shield,
    X,
    AlertTriangle,
    Pill,
    ClipboardList,
    HeartPulse,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types pour les notifications
type NotificationType =
    | "info"
    | "warning"
    | "success"
    | "error"
    | "message"
    | "appointment"
    | "document"
    | "system"
    | "prescription"
    | "lab"
    | "vital"

interface Notification {
    id: string
    title: string
    message: string
    timestamp: string
    read: boolean
    type: NotificationType
    sender?: {
        id: string
        name: string
        avatar?: string
    }
    priority: "low" | "medium" | "high" | "urgent"
    actionRequired?: boolean
    category: "medical" | "administrative" | "system"
}

// Données de démonstration
const demoNotifications: Notification[] = [
    {
        id: "1",
        title: "Résultats d'analyse disponibles",
        message:
            "Les résultats de votre analyse sanguine sont maintenant disponibles. Veuillez les consulter dès que possible.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        read: false,
        type: "lab",
        priority: "high",
        actionRequired: true,
        category: "medical",
    },
    {
        id: "2",
        title: "Rappel de rendez-vous",
        message: "Rappel: Vous avez un rendez-vous avec Dr. Martin demain à 14h30.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        read: true,
        type: "appointment",
        priority: "medium",
        category: "medical",
    },
    {
        id: "3",
        title: "Nouveau message",
        message: "Dr. Sophie Dubois vous a envoyé un message concernant votre traitement.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        read: false,
        type: "message",
        sender: {
            id: "dr-dubois",
            name: "Dr. Sophie Dubois",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        priority: "medium",
        category: "medical",
    },
    {
        id: "4",
        title: "Prescription renouvelée",
        message: "Votre prescription d'antibiotiques a été renouvelée. Vous pouvez la récupérer à la pharmacie.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        read: false,
        type: "prescription",
        priority: "high",
        category: "medical",
    },
    {
        id: "5",
        title: "Mise à jour du système",
        message: "Le système a été mis à jour avec de nouvelles fonctionnalités de sécurité.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        read: true,
        type: "system",
        priority: "low",
        category: "system",
    },
    {
        id: "6",
        title: "Document ajouté à votre dossier",
        message: "Un nouveau document a été ajouté à votre dossier médical: Rapport d'IRM.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        read: true,
        type: "document",
        priority: "medium",
        category: "administrative",
    },
    {
        id: "7",
        title: "Alerte de paramètres vitaux",
        message: "Vos dernières mesures de tension artérielle sont élevées. Veuillez consulter votre médecin.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
        read: false,
        type: "vital",
        priority: "urgent",
        actionRequired: true,
        category: "medical",
    },
    {
        id: "8",
        title: "Rappel de vaccination",
        message: "Il est temps de planifier votre vaccination annuelle contre la grippe.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        read: true,
        type: "info",
        priority: "medium",
        category: "medical",
    },
    {
        id: "9",
        title: "Problème de facturation",
        message: "Il y a un problème avec votre dernière facture. Veuillez contacter le service administratif.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
        read: false,
        type: "error",
        priority: "high",
        actionRequired: true,
        category: "administrative",
    },
    {
        id: "10",
        title: "Nouveau protocole de traitement",
        message: "Un nouveau protocole a été ajouté à votre plan de traitement. Consultez les détails.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        read: true,
        type: "info",
        priority: "medium",
        category: "medical",
    },
]

// Fonction pour obtenir l'icône en fonction du type de notification
const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case "info":
            return <Info className="h-5 w-5 text-blue-500" />
        case "warning":
            return <AlertTriangle className="h-5 w-5 text-amber-500" />
        case "success":
            return <CheckCircle2 className="h-5 w-5 text-green-500" />
        case "error":
            return <X className="h-5 w-5 text-red-500" />
        case "message":
            return <MessageSquare className="h-5 w-5 text-indigo-500" />
        case "appointment":
            return <Calendar className="h-5 w-5 text-purple-500" />
        case "document":
            return <FileText className="h-5 w-5 text-cyan-500" />
        case "system":
            return <Shield className="h-5 w-5 text-gray-500" />
        case "prescription":
            return <Pill className="h-5 w-5 text-emerald-500" />
        case "lab":
            return <ClipboardList className="h-5 w-5 text-amber-500" />
        case "vital":
            return <HeartPulse className="h-5 w-5 text-red-500" />
        default:
            return <Bell className="h-5 w-5 text-gray-500" />
    }
}

// Fonction pour formater la date
const formatNotificationDate = (dateString: string) => {
    const date = parseISO(dateString)

    if (isToday(date)) {
        return `Aujourd'hui, ${format(date, "HH:mm", { locale: fr })}`
    } else if (isYesterday(date)) {
        return `Hier, ${format(date, "HH:mm", { locale: fr })}`
    } else if (isThisWeek(date)) {
        return format(date, "EEEE, HH:mm", { locale: fr })
    } else {
        return format(date, "d MMMM yyyy, HH:mm", { locale: fr })
    }
}

// Fonction pour obtenir la couleur de priorité
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "low":
            return "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
        case "medium":
            return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
        case "high":
            return "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400"
        case "urgent":
            return "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
        default:
            return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    }
}

// Fonction pour obtenir la couleur de fond en fonction du type
const getBackgroundColor = (type: NotificationType, read: boolean) => {
    if (read) return "bg-white/50 dark:bg-card/40"

    switch (type) {
        case "info":
            return "bg-blue-50/80 dark:bg-blue-950/20"
        case "warning":
            return "bg-amber-50/80 dark:bg-amber-950/20"
        case "success":
            return "bg-green-50/80 dark:bg-green-950/20"
        case "error":
            return "bg-red-50/80 dark:bg-red-950/20"
        case "message":
            return "bg-indigo-50/80 dark:bg-indigo-950/20"
        case "appointment":
            return "bg-purple-50/80 dark:bg-purple-950/20"
        case "document":
            return "bg-cyan-50/80 dark:bg-cyan-950/20"
        case "prescription":
            return "bg-emerald-50/80 dark:bg-emerald-950/20"
        case "lab":
            return "bg-amber-50/80 dark:bg-amber-950/20"
        case "vital":
            return "bg-red-50/80 dark:bg-red-950/20"
        default:
            return "bg-white/80 dark:bg-card/60"
    }
}

// Fonction pour obtenir la bordure en fonction du type
const getBorderColor = (type: NotificationType, read: boolean) => {
    if (read) return "border-border/40"

    switch (type) {
        case "info":
            return "border-blue-200 dark:border-blue-800/40"
        case "warning":
            return "border-amber-200 dark:border-amber-800/40"
        case "success":
            return "border-green-200 dark:border-green-800/40"
        case "error":
            return "border-red-200 dark:border-red-800/40"
        case "message":
            return "border-indigo-200 dark:border-indigo-800/40"
        case "appointment":
            return "border-purple-200 dark:border-purple-800/40"
        case "document":
            return "border-cyan-200 dark:border-cyan-800/40"
        case "prescription":
            return "border-emerald-200 dark:border-emerald-800/40"
        case "lab":
            return "border-amber-200 dark:border-amber-800/40"
        case "vital":
            return "border-red-200 dark:border-red-800/40"
        default:
            return "border-border"
    }
}

// Fonction pour grouper les notifications par date
const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {
        today: [],
        yesterday: [],
        thisWeek: [],
        older: [],
    }

    notifications.forEach((notification) => {
        const date = parseISO(notification.timestamp)

        if (isToday(date)) {
            groups.today.push(notification)
        } else if (isYesterday(date)) {
            groups.yesterday.push(notification)
        } else if (isThisWeek(date)) {
            groups.thisWeek.push(notification)
        } else {
            groups.older.push(notification)
        }
    })

    return groups
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(demoNotifications)
    const [activeTab, setActiveTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedTypes, setSelectedTypes] = useState<string[]>([])

    // Filtrer les notifications
    const filteredNotifications = notifications.filter((notification) => {
        // Filtre par onglet
        if (activeTab === "unread" && notification.read) return false
        if (activeTab === "medical" && notification.category !== "medical") return false
        if (activeTab === "administrative" && notification.category !== "administrative") return false
        if (activeTab === "system" && notification.category !== "system") return false

        // Filtre par recherche
        if (
            searchQuery &&
            !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !notification.message.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
            return false
        }

        // Filtre par priorité
        if (selectedPriorities.length > 0 && !selectedPriorities.includes(notification.priority)) {
            return false
        }

        // Filtre par catégorie
        if (selectedCategories.length > 0 && !selectedCategories.includes(notification.category)) {
            return false
        }

        // Filtre par type
        if (selectedTypes.length > 0 && !selectedTypes.includes(notification.type)) {
            return false
        }

        return true
    })

    // Grouper les notifications par date
    const groupedNotifications = groupNotificationsByDate(filteredNotifications)

    // Marquer une notification comme lue
    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    // Marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    }

    // Supprimer une notification
    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter((notification) => notification.id !== id))
    }

    // Gérer les filtres
    const togglePriorityFilter = (priority: string) => {
        setSelectedPriorities((prev) =>
            prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority],
        )
    }

    const toggleCategoryFilter = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
    }

    const toggleTypeFilter = (type: string) => {
        setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    }

    const clearFilters = () => {
        setSelectedPriorities([])
        setSelectedCategories([])
        setSelectedTypes([])
        setSearchQuery("")
    }

    // Compter les notifications non lues
    const unreadCount = notifications.filter((notification) => !notification.read).length

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-12 pt-6 dark:from-background dark:to-background/95">
            <div className="container mx-auto max-w-6xl px-4">
                {/* En-tête */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Bell className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                                <p className="text-muted-foreground">
                                    {unreadCount > 0
                                        ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                                        : "Toutes les notifications ont été lues"}
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="h-9">
                                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                                Tout marquer comme lu
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-9 ${showFilters ? "bg-accent text-accent-foreground" : ""}`}
                            >
                                <Filter className="mr-1.5 h-4 w-4" />
                                Filtres
                                {(selectedPriorities.length > 0 || selectedCategories.length > 0 || selectedTypes.length > 0) && (
                                    <Badge className="ml-1.5 bg-primary text-primary-foreground">
                                        {selectedPriorities.length + selectedCategories.length + selectedTypes.length}
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Barre de recherche et filtres */}
                    <div className="mt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher dans les notifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtres avancés */}
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-4 overflow-hidden rounded-xl border border-border bg-white/50 p-4 backdrop-blur-sm dark:bg-card/40"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Filtres avancés</h3>
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                                            Réinitialiser
                                        </Button>
                                    </div>

                                    <div className="mt-4 grid gap-6 md:grid-cols-3">
                                        {/* Filtres par priorité */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Priorité</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {["low", "medium", "high", "urgent"].map((priority) => (
                                                    <Badge
                                                        key={priority}
                                                        variant="outline"
                                                        className={`cursor-pointer ${
                                                            selectedPriorities.includes(priority) ? getPriorityColor(priority) : "bg-background"
                                                        }`}
                                                        onClick={() => togglePriorityFilter(priority)}
                                                    >
                                                        {priority === "low" && "Basse"}
                                                        {priority === "medium" && "Moyenne"}
                                                        {priority === "high" && "Haute"}
                                                        {priority === "urgent" && "Urgente"}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Filtres par catégorie */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Catégorie</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {["medical", "administrative", "system"].map((category) => (
                                                    <Badge
                                                        key={category}
                                                        variant="outline"
                                                        className={`cursor-pointer ${
                                                            selectedCategories.includes(category)
                                                                ? "bg-primary/10 text-primary dark:bg-primary/20"
                                                                : "bg-background"
                                                        }`}
                                                        onClick={() => toggleCategoryFilter(category)}
                                                    >
                                                        {category === "medical" && "Médicale"}
                                                        {category === "administrative" && "Administrative"}
                                                        {category === "system" && "Système"}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Filtres par type */}
                                        <div>
                                            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">Type</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    "info",
                                                    "warning",
                                                    "success",
                                                    "error",
                                                    "message",
                                                    "appointment",
                                                    "document",
                                                    "prescription",
                                                    "lab",
                                                    "vital",
                                                ].map((type) => (
                                                    <Badge
                                                        key={type}
                                                        variant="outline"
                                                        className={`cursor-pointer ${
                                                            selectedTypes.includes(type)
                                                                ? "bg-primary/10 text-primary dark:bg-primary/20"
                                                                : "bg-background"
                                                        }`}
                                                        onClick={() => toggleTypeFilter(type)}
                                                    >
                                                        <span className="mr-1.5">{getNotificationIcon(type as NotificationType)}</span>
                                                        {type === "info" && "Information"}
                                                        {type === "warning" && "Avertissement"}
                                                        {type === "success" && "Succès"}
                                                        {type === "error" && "Erreur"}
                                                        {type === "message" && "Message"}
                                                        {type === "appointment" && "Rendez-vous"}
                                                        {type === "document" && "Document"}
                                                        {type === "prescription" && "Prescription"}
                                                        {type === "lab" && "Laboratoire"}
                                                        {type === "vital" && "Signes vitaux"}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Onglets */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="all" className="relative">
                                Toutes
                                <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{notifications.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="relative">
                                Non lues
                                <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">{unreadCount}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="medical" className="relative">
                                Médicales
                                <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">
                                    {notifications.filter((n) => n.category === "medical").length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="administrative" className="relative">
                                Administratives
                                <Badge className="ml-1.5 bg-primary/10 text-primary dark:bg-primary/20">
                                    {notifications.filter((n) => n.category === "administrative").length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab} className="mt-0">
                            {filteredNotifications.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/50 py-16 text-center backdrop-blur-sm dark:bg-card/40"
                                >
                                    <Bell className="h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mt-4 text-xl font-medium">Aucune notification</h3>
                                    <p className="mt-2 text-muted-foreground">
                                        {searchQuery ||
                                        selectedPriorities.length > 0 ||
                                        selectedCategories.length > 0 ||
                                        selectedTypes.length > 0
                                            ? "Aucune notification ne correspond à vos critères de recherche."
                                            : "Vous n'avez aucune notification pour le moment."}
                                    </p>
                                    {(searchQuery ||
                                        selectedPriorities.length > 0 ||
                                        selectedCategories.length > 0 ||
                                        selectedTypes.length > 0) && (
                                        <Button variant="outline" onClick={clearFilters} className="mt-4">
                                            Effacer les filtres
                                        </Button>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Aujourd'hui */}
                                    {groupedNotifications.today.length > 0 && (
                                        <div>
                                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                                <Clock className="h-5 w-5 text-muted-foreground" />
                                                Aujourd'hui
                                            </h2>
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {groupedNotifications.today.map((notification) => (
                                                        <NotificationItem
                                                            key={notification.id}
                                                            notification={notification}
                                                            onMarkAsRead={markAsRead}
                                                            onDelete={deleteNotification}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hier */}
                                    {groupedNotifications.yesterday.length > 0 && (
                                        <div>
                                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                                <Clock className="h-5 w-5 text-muted-foreground" />
                                                Hier
                                            </h2>
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {groupedNotifications.yesterday.map((notification) => (
                                                        <NotificationItem
                                                            key={notification.id}
                                                            notification={notification}
                                                            onMarkAsRead={markAsRead}
                                                            onDelete={deleteNotification}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cette semaine */}
                                    {groupedNotifications.thisWeek.length > 0 && (
                                        <div>
                                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                Cette semaine
                                            </h2>
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {groupedNotifications.thisWeek.map((notification) => (
                                                        <NotificationItem
                                                            key={notification.id}
                                                            notification={notification}
                                                            onMarkAsRead={markAsRead}
                                                            onDelete={deleteNotification}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}

                                    {/* Plus ancien */}
                                    {groupedNotifications.older.length > 0 && (
                                        <div>
                                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                Plus ancien
                                            </h2>
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {groupedNotifications.older.map((notification) => (
                                                        <NotificationItem
                                                            key={notification.id}
                                                            notification={notification}
                                                            onMarkAsRead={markAsRead}
                                                            onDelete={deleteNotification}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>

                {/* Liste des notifications */}

            </div>
        </div>
    )
}

// Composant pour un élément de notification
function NotificationItem({
                              notification,
                              onMarkAsRead,
                              onDelete,
                          }: {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`group relative overflow-hidden rounded-xl border ${getBorderColor(notification.type, notification.read)} ${getBackgroundColor(notification.type, notification.read)} p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${notification.read ? "bg-muted/50" : "bg-primary/10"}`}
                >
                    {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                        <h3 className={`font-medium ${notification.read ? "" : "font-semibold"}`}>
                            {notification.title}
                            {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                        </h3>
                        <div className="flex items-center gap-1">
                            {notification.priority !== "low" && (
                                <Badge variant="outline" className={`${getPriorityColor(notification.priority)}`}>
                                    {notification.priority === "medium" && "Moyenne"}
                                    {notification.priority === "high" && "Haute"}
                                    {notification.priority === "urgent" && "Urgente"}
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{formatNotificationDate(notification.timestamp)}</span>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{notification.message}</p>

                    {notification.sender && (
                        <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.name} />
                                <AvatarFallback className="text-xs">{notification.sender.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{notification.sender.name}</span>
                        </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                        {notification.actionRequired && (
                            <Badge variant="outline" className="bg-primary/10 text-primary dark:bg-primary/20">
                                Action requise
                            </Badge>
                        )}

                        {!notification.read ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                className="h-8 px-3 text-xs"
                            >
                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                                Marquer comme lu
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(notification.id)}
                                className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" />
                                Supprimer
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Indicateur de type sur le côté */}
            <div
                className={`absolute bottom-0 left-0 top-0 w-1 ${
                    notification.type === "info"
                        ? "bg-blue-500"
                        : notification.type === "warning"
                            ? "bg-amber-500"
                            : notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "error"
                                    ? "bg-red-500"
                                    : notification.type === "message"
                                        ? "bg-indigo-500"
                                        : notification.type === "appointment"
                                            ? "bg-purple-500"
                                            : notification.type === "document"
                                                ? "bg-cyan-500"
                                                : notification.type === "system"
                                                    ? "bg-gray-500"
                                                    : notification.type === "prescription"
                                                        ? "bg-emerald-500"
                                                        : notification.type === "lab"
                                                            ? "bg-amber-500"
                                                            : notification.type === "vital"
                                                                ? "bg-red-500"
                                                                : "bg-primary"
                }`}
            />
        </motion.div>
    )
}

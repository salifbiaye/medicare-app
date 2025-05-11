import {
    Home,
    User,
    Users,
    Calendar,
    FileText,
    ClipboardList,
    Stethoscope,
    Building,
    Bell,
    Mail
} from "lucide-react";
import { Role } from "@prisma/client";

interface NavItem {
    id: string;
    title: string;
    href: string;
    icon: React.ReactNode;
    roles: Role[];
    badge?: number;
    isProtectedRoute?: boolean;
    subNav?: NavItem[];
}

export const navigationConfig: NavItem[] = [
    // Admin routes
    {
        id: "admin",
        title: "Administration",
        href: "/admin",
        icon: <Building className="w-5 h-5" />,
        roles: [Role.ADMIN],
        subNav: [
            {
                id: "hospitals",
                title: "Hôpitaux",
                href: "/admin/hospitals",
                icon: <Building className="w-5 h-5" />,
                roles: [Role.ADMIN]
            },
            {
                id: "users",
                title: "Utilisateurs",
                href: "/admin/users",
                icon: <Users className="w-5 h-5" />,
                roles: [Role.ADMIN]
            }
        ]
    },

    // Director routes
    {
        id: "director",
        title: "Direction",
        href: "/director",
        icon: <User className="w-5 h-5" />,
        roles: [Role.DIRECTOR],
        subNav: [
            {
                id: "staff",
                title: "Personnel",
                href: "/director/staff",
                icon: <Users className="w-5 h-5" />,
                roles: [Role.DIRECTOR]
            }
        ]
    },

    // Doctor routes
    {
        id: "doctor",
        title: "Médecin",
        href: "/doctor",
        icon: <Stethoscope className="w-5 h-5" />,
        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
        subNav: [
            {
                id: "calendar",
                title: "Calendrier",
                href: "/doctor/calendar",
                icon: <Calendar className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
            },
            {
                id: "patients",
                title: "Patients",
                href: "/doctor/patients",
                icon: <User className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
            },
            {
                id: "dicom-viewer",
                title: "DICOM Viewer",
                href: "/doctor/dicom-viewer",
                icon: <FileText className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
                subNav: [
                    {
                        id: "dicom-details",
                        title: "Détails DICOM",
                        href: "/doctor/dicom-viewer/[id]",
                        icon: <FileText className="w-5 h-5" />,
                        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
                    }
                ]
            },
            {
                id: "treatments",
                title: "Traitements",
                href: "/doctor/treatments",
                icon: <ClipboardList className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
            }
        ]
    },

    // Patient routes
    {
        id: "patient",
        title: "Patient",
        href: "/patient",
        icon: <User className="w-5 h-5" />,
        roles: [Role.PATIENT],
        subNav: [
            {
                id: "calendar",
                title: "Calendrier",
                href: "/patient/calendar",
                icon: <Calendar className="w-5 h-5" />,
                roles: [Role.PATIENT]
            },
            {
                id: "medical-record",
                title: "Dossier Médical",
                href: "/patient/medical-record",
                icon: <FileText className="w-5 h-5" />,
                roles: [Role.PATIENT]
            },
            {
                id: "prescriptions",
                title: "Ordonnances",
                href: "/patient/prescriptions",
                icon: <ClipboardList className="w-5 h-5" />,
                roles: [Role.PATIENT]
            },
            {
                id: "requests",
                title: "Demandes",
                href: "/patient/requests",
                icon: <Mail className="w-5 h-5" />,
                roles: [Role.PATIENT]
            }
        ]
    },

    // Secretary routes
    {
        id: "secretary",
        title: "Secrétaire",
        href: "/secretary",
        icon: <User className="w-5 h-5" />,
        roles: [Role.SECRETARY],
        subNav: [
            {
                id: "requests",
                title: "Demandes",
                href: "/secretary/requests",
                icon: <Mail className="w-5 h-5" />,
                roles: [Role.SECRETARY]
            }
        ]
    },

    // Notifications (common for all roles)
    {
        id: "notifications",
        title: "Notifications",
        href: "/notifications",
        icon: <Bell className="w-5 h-5" />,
        roles: [Role.PATIENT, Role.DOCTOR, Role.CHIEF_DOCTOR, Role.SECRETARY, Role.DIRECTOR, Role.ADMIN],
        badge: 0 // Vous pouvez mettre à jour ce nombre dynamiquement
    },
    {
        id: "account",
        title: "Compte",
        href: "/account",
        icon: <User className="w-5 h-5" />,
        roles: [Role.PATIENT, Role.DOCTOR, Role.CHIEF_DOCTOR, Role.SECRETARY, Role.DIRECTOR, Role.ADMIN],
        badge: 0 // Vous pouvez mettre à jour ce nombre dynamiquement
    },
];
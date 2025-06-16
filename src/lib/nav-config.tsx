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
    Mail, User2, Users2, UsersRound, DownloadIcon, BriefcaseMedicalIcon
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
                id: "dashboard",
                title: "Tableau de bord",
                href: "/admin/dashboard",
                icon: <Building className="w-5 h-5" />,
                roles: [Role.ADMIN]
            },
            {
                id: "hospitals",
                title: "Hôpitaux",
                href: "/admin/hospitals",
                icon: <Building className="w-5 h-5" />,
                roles: [Role.ADMIN],
                subNav: [

                    {
                        id: "hospitals-create",
                        title: "Créer un hopital",
                        href: "/admin/hospitals/new",
                        icon: <User2 className="w-5 h-5" />,
                        roles: [Role.ADMIN],
                    },
                    {
                        id: "hospitals-imports",
                        title: "Importer des hopitaux",
                        href: "/admin/hospitals/import",
                        icon: <DownloadIcon className="w-5 h-5" />,
                        roles: [Role.ADMIN],
                    },
                ]
            },
            {
                id: "users",
                title: "Utilisateurs",
                href: "/admin/users",
                icon: <Users className="w-5 h-5" />,
                roles: [Role.ADMIN],
                subNav: [

                    {
                        id: "users-create",
                        title: "Créer un utilisateur",
                        href: "/admin/users/new",
                        icon: <User2 className="w-5 h-5" />,
                        roles: [Role.ADMIN],
                    },
                    {
                        id: "users-imports",
                        title: "Importer des utilisateurs",
                        href: "/admin/users/import",
                        icon: <DownloadIcon className="w-5 h-5" />,
                        roles: [Role.ADMIN],
                    },
                ]
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
                id: "appointments",
                title: "Rendez-vous",
                href: "/doctor/appointment/#",
                icon: <Calendar className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
                subNav: [
                    {
                        id: "appointments-new",
                        title: "Gestion des rendez-vous",
                        href: "/doctor/appointment",
                        icon: <Calendar className="w-5 h-5" />,
                        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
                    },
                    {
                        id: "calendar",
                        title: "calendrier",
                        href: "/doctor/calendar",
                        icon: <Calendar className="w-5 h-5" />,
                        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
                    }
                ]
            },
            {
                id: "patients",
                title: "Patients",
                href: "/doctor/patients",
                icon: <User className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
            },
            {
                id: "dicom",
                title: "DICOM ",
                href: "/doctor/dicom-viewer/#",
                icon: <FileText className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
                subNav: [
                    {
                        id: "dicom-viewer",
                        title: "DICOM Viewer",
                        href: "/doctor/dicom-viewer",
                        icon: <FileText className="w-5 h-5" />,
                        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR],
                    },
                    {
                        id: "dicom-shared",
                        title: "DICOM Partagés",
                        href: "/doctor/dicom-viewer/shared",
                        icon: <FileText className="w-5 h-5" />,
                        roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
                    }
                ]
            },
            {
                id: "treatments",
                title: "Demandes",
                href: "/doctor/treatments",
                icon: <ClipboardList className="w-5 h-5" />,
                roles: [Role.DOCTOR, Role.CHIEF_DOCTOR]
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
                id: "dashboard",
                title: "Tableau de bord",
                href: "/director/dashboard",
                icon: <Building className="w-5 h-5" />,
                roles: [Role.DIRECTOR]
            },
            {
                id: "service",
                title: "Services",
                href: "/director/services",
                icon: <Building className="w-5 h-5" />,
                roles: [Role.DIRECTOR],
                subNav: [

                    {
                        id: "service-create",
                        title: "Créer un service",
                        href: "/director/services/new",
                        icon: <BriefcaseMedicalIcon className="w-5 h-5" />,
                        roles: [Role.DIRECTOR],
                    },
                    {
                        id: "service-imports",
                        title: "Importer des services",
                        href: "/director/services/import",
                        icon: <DownloadIcon className="w-5 h-5" />,
                        roles: [Role.DIRECTOR],
                    },
                ]
            },
            {
                id: "staff",
                title: "Personnels",
                href: "/director/staff",
                icon: <Users className="w-5 h-5" />,
                roles: [Role.DIRECTOR],
                subNav: [
                    {
                        id: "personnels-create",
                        title: "Créer un membre du personnels",
                        href: "/director/staff/new",
                        icon: <User2 className="w-5 h-5" />,
                        roles: [Role.DIRECTOR],
                    },
                    {
                        id: "personnels-imports",
                        title: "Importer des membres du personnels",
                        href: "/director/staff/import",
                        icon: <DownloadIcon className="w-5 h-5" />,
                        roles: [Role.DIRECTOR],
                    },
                ]
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
                title: "Tableau de bord",
                href: "/secretary/dashboard",
                icon: <Mail className="w-5 h-5" />,
                roles: [Role.SECRETARY]
            },

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
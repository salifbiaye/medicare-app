import { UserIcon, CheckCircle2Icon, HeartPulse, Stethoscope, ClipboardList, Building2, Hospital } from "lucide-react"

// Base user groups
const baseUserGroups = [
    {
        title: "Informations de base",
        description: "Entrez les informations principales de l'utilisateur",
        fields: ["name", "email", "gender"],
        icon: <UserIcon className="h-5 w-5" />,
    },
    {
        title: "Profil et permissions",
        description: "Paramètres additionnels du compte",
        fields: ["emailVerified", "profileCompleted"],
        icon: <CheckCircle2Icon className="h-5 w-5" />,
    },
]

// Patient specific groups
export const patientGroups = [
    ...baseUserGroups,
    {
        title: "Informations médicales",
        description: "Informations médicales du patient",
        fields: ["socialSecurityNumber", "bloodGroup", "allergies"],
        icon: <HeartPulse className="h-5 w-5" />,
    },
]

// Doctor specific groups
export const doctorGroups = [
    ...baseUserGroups,
    {
        title: "Informations professionnelles",
        description: "Informations professionnelles du médecin",
        fields: ["role", "specialty", "registrationNumber", "isChief"],
        icon: <Stethoscope className="h-5 w-5" />,
    },
    {
        title: "Affectation",
        description: "Hôpital et service d'affectation",
        fields: ["hospitalId", "serviceId"],
        icon: <Hospital className="h-5 w-5" />,
    },
]

// Secretary specific groups
export const secretaryGroups = [
    ...baseUserGroups,
    {
        title: "Affectation",
        description: "Hôpital et service d'affectation",
        fields: ["hospitalId", "serviceId"],
        icon: <ClipboardList className="h-5 w-5" />,
    },
]

// Director specific groups
export const directorGroups = [
    ...baseUserGroups,
    {
        title: "Affectation",
        description: "Hôpital d'affectation",
        fields: ["hospitalId"],
        icon: <Building2 className="h-5 w-5" />,
    },
]

// Admin specific groups
export const adminGroups = [...baseUserGroups]

// Original user groups for backward compatibility
export const createUsergroups = [
    {
        title: "Informations de base",
        description: "Entrez les informations principales de l'utilisateur",
        fields: ["name", "email"],
        icon: <UserIcon className="h-5 w-5" />,
    },
    {
        title: "Profil et permissions",
        description: "Paramètres additionnels du compte",
        fields: ["gender", "role", "emailVerified", "profileCompleted"],
        icon: <CheckCircle2Icon className="h-5 w-5" />,
    },
]

// Helper function to get groups by role
export const getGroupsByRole = (role: string) => {
    switch (role) {
        case "PATIENT":
            return patientGroups
        case "DOCTOR":
        case "CHIEF_DOCTOR":
            return doctorGroups
        case "SECRETARY":
            return secretaryGroups
        case "DIRECTOR":
            return directorGroups
        case "ADMIN":
            return adminGroups
        default:
            return createUsergroups
    }
}

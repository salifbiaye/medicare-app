import type { Role } from "@prisma/client"

export function getRoleLabel(role: Role): string {
    switch (role) {
        case "PATIENT":
            return "Patient"
        case "DOCTOR":
            return "Médecin"
        case "CHIEF_DOCTOR":
            return "Médecin en Chef"
        case "SECRETARY":
            return "Secrétaire"
        case "DIRECTOR":
            return "Directeur"
        case "ADMIN":
            return "Administrateur"
        default:
            return "Utilisateur"
    }
}

export function getRoleBadgeVariant(role: Role): string {
    switch (role) {
        case "PATIENT":
            return "secondary"
        case "DOCTOR":
            return "success"
        case "CHIEF_DOCTOR":
            return "destructive"
        case "SECRETARY":
            return "warning"
        case "DIRECTOR":
            return "default"
        case "ADMIN":
            return "accent"
        default:
            return "secondary"
    }
}


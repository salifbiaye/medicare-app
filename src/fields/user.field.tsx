import {
    AtSignIcon,
    CheckCircle2Icon,
    ShieldIcon,
    UserIcon,
    HeartPulse,
    Stethoscope,
    Hospital,
    Briefcase,
} from "lucide-react"

// Base user fields that are common to all roles
export const baseUserFields = [
    {
        type: "text",
        name: "name",
        label: "Nom complet",
        placeholder: "Entrez le nom complet",
        required: true,
        icon: <UserIcon className="h-4 w-4" />,
        helpText: "Nom et prénom de l'utilisateur",
    },
    {
        type: "email",
        name: "email",
        label: "Email",
        placeholder: "exemple@domaine.com",
        required: true,
        icon: <AtSignIcon className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "gender",
        label: "Genre",
        options: [
            { value: "MALE", label: "Masculin" },
            { value: "FEMALE", label: "Féminin" },
        ],
        required: true,
    },
    {
        type: "checkbox",
        name: "emailVerified",
        label: "Email vérifié",
        icon: <AtSignIcon className="h-4 w-4" />,
    },
    {
        type: "checkbox",
        name: "profileCompleted",
        label: "Profil complété",
        icon: <CheckCircle2Icon className="h-4 w-4" />,
    },
]

// Patient specific fields
export const patientFields = [
    ...baseUserFields,
    {
        type: "hidden",
        name: "role",
        defaultValue: "PATIENT",
    },
    {
        type: "text",
        name: "socialSecurityNumber",
        label: "Numéro de sécurité sociale",
        placeholder: "Entrez le numéro de sécurité sociale",
        icon: <ShieldIcon className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "bloodGroup",
        label: "Groupe sanguin",
        options: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
        ],
        icon: <HeartPulse className="h-4 w-4" />,
    },
    {
        type: "textarea",
        name: "allergies",
        label: "Allergies",
        placeholder: "Listez les allergies connues",
        icon: <HeartPulse className="h-4 w-4" />,
    },
]

// Doctor specific fields
export const doctorFields = [
    ...baseUserFields,
    {
        type: "select",
        name: "role",
        label: "Type de médecin",
        options: [
            { value: "DOCTOR", label: "Médecin" },
            { value: "CHIEF_DOCTOR", label: "Médecin en chef" },
        ],
        required: true,
        icon: <Stethoscope className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "specialty",
        label: "Spécialité",
        options: [
            { value: "GENERAL_PRACTICE", label: "Médecine générale" },
            { value: "OPHTHALMOLOGY", label: "Ophtalmologie" },
            { value: "CARDIOLOGY", label: "Cardiologie" },
            { value: "PEDIATRICS", label: "Pédiatrie" },
            { value: "DERMATOLOGY", label: "Dermatologie" },
            { value: "NEUROLOGY", label: "Neurologie" },
            { value: "ORTHOPEDICS", label: "Orthopédie" },
            { value: "GYNECOLOGY", label: "Gynécologie" },
            { value: "RADIOLOGY", label: "Radiologie" },
            { value: "PSYCHIATRY", label: "Psychiatrie" },
            { value: "UROLOGY", label: "Urologie" },
            { value: "ENT", label: "ORL" },
        ],
        required: true,
        icon: <Briefcase className="h-4 w-4" />,
    },
    {
        type: "text",
        name: "registrationNumber",
        label: "Numéro d'enregistrement",
        placeholder: "Entrez le numéro d'enregistrement",
        required: true,
        icon: <ShieldIcon className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "hospitalId",
        label: "Hôpital",
        options: [], // This should be populated from the database
        required: true,
        icon: <Hospital className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "serviceId",
        label: "Service",
        options: [], // This should be populated from the database
        required: true,
        icon: <Briefcase className="h-4 w-4" />,
    },
    {
        type: "checkbox",
        name: "isChief",
        label: "Chef de service",
        icon: <CheckCircle2Icon className="h-4 w-4" />,
    },
]

// Secretary specific fields
export const secretaryFields = [
    ...baseUserFields,
    {
        type: "hidden",
        name: "role",
        defaultValue: "SECRETARY",
    },
    {
        type: "select",
        name: "hospitalId",
        label: "Hôpital",
        options: [], // This should be populated from the database
        required: true,
        icon: <Hospital className="h-4 w-4" />,
    },
    {
        type: "select",
        name: "serviceId",
        label: "Service",
        options: [], // This should be populated from the database
        required: true,
        icon: <Briefcase className="h-4 w-4" />,
    },
]

// Director specific fields
export const directorFields = [
    ...baseUserFields,
    {
        type: "hidden",
        name: "role",
        defaultValue: "DIRECTOR",
    },
    {
        type: "select",
        name: "hospitalId",
        label: "Hôpital",
        options: [], // This should be populated from the database
        required: true,
        icon: <Hospital className="h-4 w-4" />,
    },
]

// Admin specific fields
export const adminFields = [
    ...baseUserFields,
    {
        type: "hidden",
        name: "role",
        defaultValue: "ADMIN",
    },
]

// Original user fields for backward compatibility
export const createUserfields = [
    ...baseUserFields,
    {
        type: "select",
        name: "role",
        label: "Rôle",
        options: [
            { value: "PATIENT", label: "Patient" },
            { value: "ADMIN", label: "Administrateur" },
            { value: "DIRECTOR", label: "Directeur" },
            { value: "DOCTOR", label: "Médecin" },
            { value: "SECRETARY", label: "Secrétaire" },
            { value: "CHIEF_DOCTOR", label: "Chef de service" },
        ],
        required: true,
        icon: <ShieldIcon className="h-4 w-4" />,
    },
]

// Helper function to get fields by role
export const getFieldsByRole = (role: string) => {
    switch (role) {
        case "PATIENT":
            return patientFields
        case "DOCTOR":
        case "CHIEF_DOCTOR":
            return doctorFields
        case "SECRETARY":
            return secretaryFields
        case "DIRECTOR":
            return directorFields
        case "ADMIN":
            return adminFields
        default:
            return createUserfields
    }
}

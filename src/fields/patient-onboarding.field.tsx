import { 
    AtSignIcon, 
    HeartPulse, 
    Calendar, 
    Phone, 
    UserIcon, 
    ShieldIcon 
} from "lucide-react";

// Fields for the first step - Basic patient information
export const patientBasicInfoFields = [
    {
        type: "text" as const,
        name: "name",
        label: "Nom complet",
        placeholder: "Entrez votre nom complet",
        required: true,
        width: "full",
        icon: <UserIcon className="h-4 w-4" />,
        helpText: "Votre nom et prénom",
    },
    {
        type: "email" as const,
        name: "email",
        label: "Email",
        placeholder: "exemple@domaine.com",
        required: true,
        width: "full",
        icon: <AtSignIcon className="h-4 w-4" />,
        helpText: "Votre adresse email principale",
    },
    {
        type: "select" as const,
        name: "gender",
        label: "Genre",
        options: [
            { value: "MALE", label: "Masculin" },
            { value: "FEMALE", label: "Féminin" },
        ],
        required: true,
        width: "half",
    },
    {
        type: "date" as const,
        name: "birthDate",
        label: "Date de naissance",
        placeholder: "Sélectionnez votre date de naissance",
        width: "half",
        icon: <Calendar className="h-4 w-4" />,
    },
    {
        type: "text" as const,
        name: "phone",
        label: "Téléphone",
        placeholder: "Entrez votre numéro de téléphone",
        width: "full",
        icon: <Phone className="h-4 w-4" />,
    },
];

// Fields for the second step - Medical information
export const patientMedicalInfoFields = [
    {
        type: "text" as const,
        name: "socialSecurityNumber",
        label: "Numéro de sécurité sociale",
        placeholder: "Entrez votre numéro de sécurité sociale",
        width: "full",
        icon: <ShieldIcon className="h-4 w-4" />,
        helpText: "Votre numéro de sécurité sociale (facultatif)",
    },
    {
        type: "select" as const,
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
        width: "half",
        icon: <HeartPulse className="h-4 w-4" />,
        helpText: "Votre groupe sanguin (facultatif)",
    },
    {
        type: "textarea" as const,
        name: "allergies",
        label: "Allergies",
        placeholder: "Listez vos allergies connues (médicaments, aliments, etc.)",
        width: "full",
        rows: 4,
        icon: <HeartPulse className="h-4 w-4" />,
        helpText: "Vos allergies connues (facultatif)",
    },
];

// Hidden fields needed for the patient creation
export const patientHiddenFields = [
    {
        type: "hidden" as const,
        name: "role",
        defaultValue: "PATIENT",
    },
    {
        type: "hidden" as const,
        name: "emailVerified",
        defaultValue: true,
    },
    {
        type: "hidden" as const,
        name: "profileCompleted",
        defaultValue: true,
    },
];

// Combined fields for the complete form
export const patientOnboardingFields = [
    ...patientBasicInfoFields,
    ...patientMedicalInfoFields,
    ...patientHiddenFields,
]; 
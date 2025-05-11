import {AtSignIcon, CheckCircle2Icon, ShieldIcon, UserIcon} from "lucide-react";
import React from "react";

export const createUserfields = [
    // Groupe 1: Informations de base
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


    // Groupe 3: Profil et permissions
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
        type: "select",
        name: "role",
        label: "Rôle",
        options: [
            { value: "PATIENT", label: "PATIENT" },
            { value: "ADMIN", label: "Administrateur" },
            { value: "DIRECTOR", label: "Directeur" },
            { value: "DOCTOR", label: "Médecin" },
            { value: "SECRETARY", label: "Secretaire" },
            { value: "CHIEF_DOCTOR", label: "Chef de service" },

        ],
        required: true,
        icon: <ShieldIcon className="h-4 w-4" />,
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

// Groupes pour le layout wizard
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
        fields: ["gender", "role","emailVerified", "profileCompleted"],
        icon: <CheckCircle2Icon className="h-5 w-5" />,
    },
]
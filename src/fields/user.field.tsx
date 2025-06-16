import {
    AtSignIcon,
    CheckCircle2Icon,
    ShieldIcon,
    UserIcon,
    HeartPulse,
    Stethoscope,
    Hospital,
    Briefcase, CalendarIcon, MapPinIcon, PhoneIcon, User2, KeyRound, Lock,
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
    {
        type: "select",
        name: "role",
        label: "Rôle",
        hidden: true,
        options: [
            { value: "PATIENT", label: "Patient" },
            { value: "ADMIN", label: "Administrateur" },
            { value: "DIRECTOR", label: "Directeur" },
            { value: "DOCTOR", label: "Médecin" },
            { value: "SECRETARY", label: "Secrétaire" },
            { value: "CHIEF_DOCTOR", label: "Chef de service" },
        ],
       
        icon: <ShieldIcon className="h-4 w-4" />,
    },
]



// Patient specific fields
export const patientFields = [
    ...baseUserFields,
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
        options: [], // This will be populated dynamically
        required: true,
        icon: <Hospital className="h-4 w-4" />,
        async loadOptions() {
            try {
                const { getAllHospitalsForSelectAction } = await import("@/actions/hospital.action");
                const response = await getAllHospitalsForSelectAction();

                if (response.success && response.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Erreur lors du chargement des hôpitaux:", error);
                return [];
            }
        }
    },
    {
        type: "select",
        name: "serviceId",
        label: "Service",
        options: [], // This should be populated from the database
        required: true,
        icon: <Briefcase className="h-4 w-4" />,
        dependsOn: "hospitalId",
        async loadOptions(formData: any) {
            try {
                if (!formData.hospitalId) {
                    return [];
                }
                
                const { getServicesByHospitalIdAction } = await import("@/actions/service.action");
                const response = await getServicesByHospitalIdAction(formData.hospitalId);
                
                if (response.success && response.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Erreur lors du chargement des services:", error);
                return [];
            }
        }
    },
]

// Secretary specific fields
export const secretaryFields = [
    ...baseUserFields,
    {
        type: "select",
        name: "hospitalId",
        label: "Hôpital",
        options: [], // This will be populated dynamically
        required: true,
        icon: <Hospital className="h-4 w-4" />,
        async loadOptions() {
            try {
                const { getAllHospitalsForSelectAction } = await import("@/actions/hospital.action");
                const response = await getAllHospitalsForSelectAction();

                if (response.success && response.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Erreur lors du chargement des hôpitaux:", error);
                return [];
            }
        }
    },
    {
        type: "select",
        name: "serviceId",
        label: "Service",
        options: [], // This should be populated from the database
        required: true,
        icon: <Briefcase className="h-4 w-4" />,
        dependsOn: "hospitalId",
        async loadOptions(formData: any) {
            try {
                if (!formData.hospitalId) {
                    return [];
                }
                
                const { getServicesByHospitalIdAction } = await import("@/actions/service.action");
                const response = await getServicesByHospitalIdAction(formData.hospitalId);
                
                if (response.success && response.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Erreur lors du chargement des services:", error);
                return [];
            }
        }
    },
]

// Director specific fields
export const directorFields = [
    ...baseUserFields,
    {
        type: "select",
        name: "hospitalId",
        label: "Hôpital",
        options: [], // This will be populated dynamically
        required: true,
        icon: <Hospital className="h-4 w-4" />,
        async loadOptions() {
            try {
                // Importer l'action de manière dynamique pour éviter les erreurs côté serveur
                const { getAllHospitalsForSelectAction } = await import("@/actions/hospital.action");
                const response = await getAllHospitalsForSelectAction();
                
                if (response.success && response.data) {
                    return response.data;
                }
                return [];
            } catch (error) {
                console.error("Erreur lors du chargement des hôpitaux:", error);
                return [];
            }
        }
    },
]

// Admin specific fields
export const adminFields = [
    ...baseUserFields,
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


export const personalInfoFields = [
    {
        type: "text" as const,
        name: "name" as const,
        label: "Nom complet",
        placeholder: "Entrez votre nom complet",
        required: true,
        icon: <User2 className="h-4 w-4" />,
    },
    {
        type: "email" as const,
        name: "email" as const,
        label: "Email",
        placeholder: "votre@email.com",
        required: true,
        icon: <AtSignIcon className="h-4 w-4" />,
    },
    {
        type: "text" as const,
        name: "phone" as const,
        label: "Téléphone",
        placeholder: "Entrez votre numéro de téléphone",
        icon: <PhoneIcon className="h-4 w-4" />,
    },
    {
        type: "select" as const,
        name: "gender" as const,
        label: "Genre",
        options: [
            { value: "MALE", label: "Masculin" },
            { value: "FEMALE", label: "Féminin" },
        ],
        required: true,
    },
    {
        type: "date" as const,
        name: "birthDate" as const,
        label: "Date de naissance",
        icon: <CalendarIcon className="h-4 w-4" />,
    },
    {
        type: "textarea" as const,
        name: "address" as const,
        label: "Adresse",
        placeholder: "Entrez votre adresse complète",
        icon: <MapPinIcon className="h-4 w-4" />,
        rows: 3,
    },
]

export const securityFields = [
    {
        type: "password" as const,
        name: "currentPassword" as const,
        label: "Mot de passe actuel",
        placeholder: "Votre mot de passe actuel",
        required: true,
        icon: <KeyRound className="h-4 w-4" />,
    },
    {
        type: "password" as const,
        name: "newPassword" as const,
        label: "Nouveau mot de passe",
        placeholder: "Votre nouveau mot de passe",
        required: true,
        icon: <Lock className="h-4 w-4" />,
        helpText: "8 caractères minimum, avec majuscules, minuscules, chiffres et caractères spéciaux",
    },
    {
        type: "password" as const,
        name: "confirmPassword" as const,
        label: "Confirmer le mot de passe",
        placeholder: "Confirmez votre nouveau mot de passe",
        required: true,
        icon: <Lock className="h-4 w-4" />,
    },
]
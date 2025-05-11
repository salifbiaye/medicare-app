import { z } from "zod";


// Base user schema with common fields
const baseUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir un email valide"),
    gender: z.enum(["MALE", "FEMALE"]),
    emailVerified: z.preprocess((val) => val === "true" || val === true, z.boolean()),
    profileCompleted: z.preprocess((val) => val === "true" || val === true, z.boolean()),
})

// Patient specific schema
export const createPatientSchema = baseUserSchema.extend({
    role: z.literal("PATIENT"),
    socialSecurityNumber: z.string().optional(),
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
})

// Doctor specific schema
export const createDoctorSchema = baseUserSchema.extend({
    role: z.enum(["DOCTOR", "CHIEF_DOCTOR"]),
    specialty: z.enum([
        "GENERAL_PRACTICE",
        "OPHTHALMOLOGY",
        "CARDIOLOGY",
        "PEDIATRICS",
        "DERMATOLOGY",
        "NEUROLOGY",
        "ORTHOPEDICS",
        "GYNECOLOGY",
        "RADIOLOGY",
        "PSYCHIATRY",
        "UROLOGY",
        "ENT",
    ]),
    registrationNumber: z.string().min(3, "Le numéro d'enregistrement est requis"),
    isChief: z.preprocess((val) => val === "true" || val === true, z.boolean()).optional(),
    hospitalId: z.string().min(1, "L'hôpital est requis"),
    serviceId: z.string().min(1, "Le service est requis"),
})

// Secretary specific schema
export const createSecretarySchema = baseUserSchema.extend({
    role: z.literal("SECRETARY"),
    hospitalId: z.string().min(1, "L'hôpital est requis"),
    serviceId: z.string().min(1, "Le service est requis"),
})

// Director specific schema
export const createDirectorSchema = baseUserSchema.extend({
    role: z.literal("DIRECTOR"),
    hospitalId: z.string().min(1, "L'hôpital est requis"),
})

// Admin specific schema
export const createAdminSchema = baseUserSchema.extend({
    role: z.literal("ADMIN"),
})


export const createUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir un email valide"),
    gender: z.enum(["MALE", "FEMALE"]),
    role: z.enum(["PATIENT", "ADMIN", "DIRECTOR", "DOCTOR", "SECRETARY","CHIEF_DOCTOR"]),
    emailVerified: z.preprocess(val => val === "true" || val === true, z.boolean()),
    profileCompleted: z.preprocess(val => val === "true" || val === true, z.boolean()),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type CreatePatientFormValues = z.infer<typeof createPatientSchema>
export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>
export type CreateSecretaryFormValues = z.infer<typeof createSecretarySchema>
export type CreateDirectorFormValues = z.infer<typeof createDirectorSchema>
export type CreateAdminFormValues = z.infer<typeof createAdminSchema>

// Helper function to get the appropriate schema based on role
export const getSchemaByRole = (role: string) => {
    switch (role) {
        case "PATIENT":
            return createPatientSchema
        case "DOCTOR":
        case "CHIEF_DOCTOR":
            return createDoctorSchema
        case "SECRETARY":
            return createSecretarySchema
        case "DIRECTOR":
            return createDirectorSchema
        case "ADMIN":
            return createAdminSchema
        default:
            return createUserSchema
    }
}
export const UserFilterSchema = z.object({
    role: z.array(z.string()).optional(),
    gender: z.array(z.string()).optional(),
    profileCompleted: z.array(z.string()).optional(),
})
export type UserFilterSchema = z.infer<typeof UserFilterSchema>
export const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>




export const userImportSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir une adresse email valide"),
    gender: z.enum(["MALE", "FEMALE"], {
        errorMap: () => ({ message: "Le genre doit être 'MALE' ou 'FEMALE'" })
    }),
    role: z.enum(["PATIENT", "ADMIN", "DIRECTOR", "DOCTOR", "SECRETARY", "CHIEF_DOCTOR"], {
        errorMap: () => ({ message: "Le rôle doit être l'un des suivants : PATIENT, ADMIN, DIRECTOR, DOCTOR, SECRETARY, CHIEF_DOCTOR" })
    }),
    emailVerified: z.preprocess(
        (val) =>
            val === "true" ||
            val === true ||
            val === "Oui" ||
            val === "oui" ||
            val === "OUI" ||
            val === "Yes" ||
            val === "yes" ||
            val === "YES",
        z.boolean(),
    ),
    profileCompleted: z.preprocess(
        (val) =>
            val === "true" ||
            val === true ||
            val === "Oui" ||
            val === "oui" ||
            val === "OUI" ||
            val === "Yes" ||
            val === "yes" ||
            val === "YES",
        z.boolean(),
    ),
})

export const patientImportSchema = userImportSchema.extend({
    role: z.literal("PATIENT", {
        errorMap: () => ({ message: "Le rôle doit être 'PATIENT' pour ce type d'utilisateur" })
    }),
    socialSecurityNumber: z.string().optional(),
    bloodGroup: z.string().optional(),
    allergies: z.string().optional(),
})

export const doctorImportSchema = userImportSchema.extend({
    role: z.enum(["DOCTOR", "CHIEF_DOCTOR"], {
        errorMap: () => ({ message: "Le rôle doit être 'DOCTOR' ou 'CHIEF_DOCTOR' pour ce type d'utilisateur" })
    }),
    specialty: z.enum([
        "GENERAL_PRACTICE",
        "OPHTHALMOLOGY",
        "CARDIOLOGY",
        "PEDIATRICS",
        "DERMATOLOGY",
        "NEUROLOGY",
        "ORTHOPEDICS",
        "GYNECOLOGY",
        "RADIOLOGY",
        "PSYCHIATRY",
        "UROLOGY",
        "ENT",
    ], {
        errorMap: () => ({ message: "La spécialité doit être l'une des suivantes : GENERAL_PRACTICE, OPHTHALMOLOGY, CARDIOLOGY, PEDIATRICS, DERMATOLOGY, NEUROLOGY, ORTHOPEDICS, GYNECOLOGY, RADIOLOGY, PSYCHIATRY, UROLOGY, ENT" })
    }),
    registrationNumber: z.string().min(3, "Le numéro d'enregistrement doit contenir au moins 3 caractères"),
    isChief: z.preprocess(
        (val) =>
            val === "true" ||
            val === true ||
            val === "Oui" ||
            val === "oui" ||
            val === "OUI" ||
            val === "Yes" ||
            val === "yes" ||
            val === "YES",
        z.boolean(),
    ).optional(),
    hospitalId: z.string().min(1, "L'identifiant de l'hôpital est requis"),
    serviceId: z.string().min(1, "L'identifiant du service est requis"),
})

export const secretaryImportSchema = userImportSchema.extend({
    role: z.literal("SECRETARY", {
        errorMap: () => ({ message: "Le rôle doit être 'SECRETARY' pour ce type d'utilisateur" })
    }),
    hospitalId: z.string().min(1, "L'identifiant de l'hôpital est requis"),
    serviceId: z.string().min(1, "L'identifiant du service est requis"),
})

export const directorImportSchema = userImportSchema.extend({
    role: z.literal("DIRECTOR", {
        errorMap: () => ({ message: "Le rôle doit être 'DIRECTOR' pour ce type d'utilisateur" })
    }),
    hospitalId: z.string().min(1, "L'identifiant de l'hôpital est requis"),
})

export type UserImport = z.infer<typeof userImportSchema>
export type PatientImport = z.infer<typeof patientImportSchema>
export type DoctorImport = z.infer<typeof doctorImportSchema>
export type SecretaryImport = z.infer<typeof secretaryImportSchema>
export type DirectorImport = z.infer<typeof directorImportSchema>

// Helper function to get the appropriate import schema based on role
export const getImportSchemaByRole = (role: string) => {
    switch (role) {
        case "PATIENT":
            return patientImportSchema
        case "DOCTOR":
        case "CHIEF_DOCTOR":
            return doctorImportSchema
        case "SECRETARY":
            return secretaryImportSchema
        case "DIRECTOR":
            return directorImportSchema
        default:
            return userImportSchema
    }
}


export type RoleImportMap = {
    PATIENT: PatientImport
    DOCTOR: DoctorImport
    CHIEF_DOCTOR: DoctorImport
    SECRETARY: SecretaryImport
    DIRECTOR: DirectorImport
}
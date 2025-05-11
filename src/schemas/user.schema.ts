import { z } from "zod";


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

export const createUserSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir un email valide"),
    gender: z.enum(["MALE", "FEMALE"]),
    role: z.enum(["PATIENT", "ADMIN", "DIRECTOR", "DOCTOR", "SECRETARY","CHIEF_DOCTOR"]),
    emailVerified: z.preprocess(val => val === "true" || val === true, z.boolean()),
    profileCompleted: z.preprocess(val => val === "true" || val === true, z.boolean()),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>


export const userImportSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir un email valide"),
    gender: z.enum(["MALE", "FEMALE"]),
    role: z.enum(["PATIENT", "ADMIN", "DIRECTOR", "DOCTOR", "SECRETARY", "CHIEF_DOCTOR"]),
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

export type UserImport = z.infer<typeof userImportSchema>
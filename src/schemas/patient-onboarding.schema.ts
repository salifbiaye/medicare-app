import { z } from "zod";

// Patient onboarding schema separated into steps
// Step 1: Basic patient information
export const patientBasicInfoSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Veuillez saisir un email valide"),
    gender: z.enum(["MALE", "FEMALE"]),
    birthDate: z.string().transform((str) => str ? new Date(str) : undefined).optional(),
    phone: z.string().optional(),
});

// Step 2: Medical information
export const patientMedicalInfoSchema = z.object({
    socialSecurityNumber: z.string().optional(),
    bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
    allergies: z.string().optional(),
});

// Combined schema for the complete onboarding process
export const patientOnboardingSchema = patientBasicInfoSchema.merge(patientMedicalInfoSchema).extend({
    role: z.literal("PATIENT"),
    emailVerified: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(true),
    profileCompleted: z.preprocess((val) => val === "true" || val === true, z.boolean()).default(true),
});

// Form values types
export type PatientBasicInfoFormValues = z.infer<typeof patientBasicInfoSchema>;
export type PatientMedicalInfoFormValues = z.infer<typeof patientMedicalInfoSchema>;
export type PatientOnboardingFormValues = z.infer<typeof patientOnboardingSchema>; 
import { z } from "zod"

export const createHospitalSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  phone: z.union([
    z.string().min(1, "Le numéro de téléphone est requis"),
    z.number().min(1, "Le numéro de téléphone est requis"),
  ]),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
})

export type CreateHospitalFormValues = z.infer<typeof createHospitalSchema>

export const hospitalFilterSchema = z.object({
  name: z.array(z.string()).optional(),
  email: z.array(z.string()).optional(),
})

export type HospitalFilterSchema = z.infer<typeof hospitalFilterSchema>

// Schéma pour l'import d'hôpitaux
export const hospitalImportSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  phone: z.number().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
})

export type HospitalImport = z.infer<typeof hospitalImportSchema>
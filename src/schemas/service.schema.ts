import { z } from "zod"

export const createServiceSchema = z.object({
  type: z.enum(["GENERAL_PRACTICE", "OPHTHALMOLOGY", "CARDIOLOGY", "PEDIATRICS", "DERMATOLOGY", 
                "NEUROLOGY", "ORTHOPEDICS", "GYNECOLOGY", "RADIOLOGY", "PSYCHIATRY", "UROLOGY", "ENT"]),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().or(z.literal("")),
  hospitalId: z.string().min(1, "L'hôpital est requis"),
})

export type CreateServiceFormValues = z.infer<typeof createServiceSchema>

export const serviceFilterSchema = z.object({
  type: z.array(z.string()).optional(),
  name: z.array(z.string()).optional(),
  hospitalId: z.array(z.string()).optional(),
})

export type ServiceFilterSchema = z.infer<typeof serviceFilterSchema>

// Schéma pour l'import de services
export const serviceImportSchema = z.object({
  type: z.enum(["GENERAL_PRACTICE", "OPHTHALMOLOGY", "CARDIOLOGY", "PEDIATRICS", "DERMATOLOGY", 
                "NEUROLOGY", "ORTHOPEDICS", "GYNECOLOGY", "RADIOLOGY", "PSYCHIATRY", "UROLOGY", "ENT"]),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional().or(z.literal("")),
  hospitalId: z.string().min(1, "L'hôpital est requis"),
})

export type ServiceImport = z.infer<typeof serviceImportSchema> 
import { z } from "zod"

// Schema for creating a medical record
export const createMedicalRecordSchema = z.object({
  phoneNumber: z.string().optional(),
  patientId: z.string().optional(), // Optional here because it will be added programmatically
})

export type CreateMedicalRecordFormValues = z.infer<typeof createMedicalRecordSchema>

// Schema for updating a medical record
export const updateMedicalRecordSchema = z.object({
  phoneNumber: z.string().optional(),
})

export type UpdateMedicalRecordFormValues = z.infer<typeof updateMedicalRecordSchema>

// Schema for medical record filters
export const medicalRecordFilterSchema = z.object({
  createdAt: z.array(z.string()).optional(),
})

export type MedicalRecordFilterSchema = z.infer<typeof medicalRecordFilterSchema> 
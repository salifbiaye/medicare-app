import { z } from "zod"

// Schema for creating a medical report
export const createMedicalReportSchema = z.object({
  content: z.string().min(1, "Le contenu du rapport est requis"),
  diagnosis: z.string().optional(),
  recommendations: z.string().optional(),
  appointmentId: z.string(),
  medicalRecordId: z.string().optional(), // Optional here because it will be added programmatically
  patientId: z.string().optional(), // Optional here because it will be added programmatically
})

export type CreateMedicalReportFormValues = z.infer<typeof createMedicalReportSchema>

// Schema for creating a prescription
export const createPrescriptionSchema = z.object({
  content: z.string().min(1, "Le contenu de la prescription est requis"),
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
  medicalRecordId: z.string().optional(), // Optional here because it will be added programmatically
  patientId: z.string().optional(), // Optional here because it will be added programmatically
})

export type CreatePrescriptionFormValues = z.infer<typeof createPrescriptionSchema>

// Schema for creating a DICOM image
export const createDicomImageSchema = z.object({
  orthanc_id: z.string().min(1, "L'ID Orthanc de l'image est requis"),
  orthanc_url: z.string().default(""),
  type: z.string().min(1, "Le type d'image est requis"),
  description: z.string().optional(),
  medicalRecordId: z.string().optional(), // Optional here because it will be added programmatically
})

export type CreateDicomImageFormValues = z.infer<typeof createDicomImageSchema> 
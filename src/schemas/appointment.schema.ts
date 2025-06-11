import { z } from "zod"


export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Le patient est requis"),
  date: z.string().min(1, "La date est requise"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).default("SCHEDULED"),
  notes: z.string().optional()
})

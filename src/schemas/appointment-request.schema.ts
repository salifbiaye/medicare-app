import { z } from "zod";
import { ServiceType } from "@prisma/client";

export const appointmentRequestSchema = z.object({
  description: z.string().min(10, "Veuillez fournir une description d'au moins 10 caractères"),
  existingRecord: z.boolean().default(false),
  patientId: z.string().optional(),
  hospitalId: z.string().min(1, "L'hôpital est requis"),
  serviceId: z.string().optional(),
  identifiedService: z.nativeEnum(ServiceType).optional().nullable(),
});

export type AppointmentRequestFormValues = z.infer<typeof appointmentRequestSchema>; 
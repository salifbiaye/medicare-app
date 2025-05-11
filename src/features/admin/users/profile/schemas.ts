import { z } from "zod"
import { Gender } from "@prisma/client"

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  goals: z.string().optional(),
  gender: z.nativeEnum(Gender),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}) 
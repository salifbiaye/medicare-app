import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
})

export const registerSchema = z.object({
    fullName: z.string().min(2, { message: "Name must contain at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
})

export const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, { message: "Password must contain at least 8 characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

export const verifyEmailSchema = z.object({
    otp: z.string()
        .length(6, { message: "The code must contain exactly 6 characters" })
        .regex(/^[0-9]+$/, { message: "The code must contain only numbers" })
})

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export type RegisterFormValues = z.infer<typeof registerSchema>

export type LoginFormValues = z.infer<typeof loginSchema>
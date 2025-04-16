// actions/verify-email.ts
"use server"

import {AuthService} from "@/services/auth.service";

export async function verifiedEmailAction(email: string) {
    try {
        await AuthService.updateEmailVerified(email)
        return { success: true }
    } catch (error) {

        return {
            error: error instanceof Error
                ? error.message
                : "Échec de la vérification de l'email"
        }
    }
}

export async function verifyEmailAction(email: string) {
    try {
        await AuthService.verifyEmail(email)
        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Échec de la vérification de l'email"
        }
    }
}

export async function completeProfileAction(gender:"male"|"female"){
    try {
        await AuthService.addGenderAndCompleteProfile(gender)
        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error
                ? error.message
                : "Échec de la mise à jour du profil utilisateur. Veuillez réessayer plus tard."
        }
    }
}
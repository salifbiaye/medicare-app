"use server"

import {AuthService} from "@/services/auth.service";

export async function verifiedEmailAction(email: string) {
    return await AuthService.updateEmailVerified(email)
}

export async function verifyEmailAction(email: string) {
    return await AuthService.verifyEmail(email)
}

export async function completeProfileAction(gender: "male" | "female") {
    return await AuthService.addGenderAndCompleteProfile(gender)
}
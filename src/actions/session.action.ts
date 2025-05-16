"use server"

import { SessionService } from "@/services/session.service"
import { revalidatePath } from "next/cache"

/**
 * Récupère toutes les sessions de l'utilisateur connecté
 * @returns Les sessions de l'utilisateur
 */
export async function getUserSessionsAction() {
    return await SessionService.getUserSessions()
}

/**
 * Récupère les informations de la session courante
 * @returns Informations sur la session courante
 */
export async function getCurrentSessionAction() {
    return await SessionService.getCurrentSession()
}

/**
 * Supprime une session spécifique
 * @param sessionId ID de la session à supprimer
 * @returns Résultat de l'opération
 */
export async function deleteSessionAction(sessionId: string) {
    console.log("Deleting session with ID:", sessionId)
    const result = await SessionService.deleteSession(sessionId)
    revalidatePath("/account/security")
    return result
}

/**
 * Supprime toutes les autres sessions (sauf la session courante)
 * @returns Résultat de l'opération
 */
export async function deleteOtherSessionsAction() {
    const result = await SessionService.deleteOtherSessions()
    revalidatePath("/account/security")
    return result
}

/**
 * Récupère toutes les sessions d'un utilisateur spécifique par son ID
 * Cette action est principalement destinée aux administrateurs et directeurs
 * pour gérer les sessions des utilisateurs
 * @param userId ID de l'utilisateur
 * @returns Les sessions de l'utilisateur
 */
export async function getSessionsAction(userId: string) {
    return await SessionService.getSessionsByUserId(userId)
}
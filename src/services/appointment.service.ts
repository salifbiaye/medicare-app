import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AppointmentRepository } from "@/repository/appointment.repository"

export class AppointmentService {
  static async getSession() {
    const headersValue = await headers()
    return await auth.api.getSession({ headers: headersValue })
  }

  static async getDoctorAppointments() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, message: "Utilisateur non authentifié !" }
      }

      const userId = session.user.id
      const result = await AppointmentRepository.getDoctorAppointmentsByUserId(userId)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération des rendez-vous"
      }
    }
  }

  static async getCompletedAppointments() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, message: "Utilisateur non authentifié !" }
      }

      const userId = session.user.id
      const result = await AppointmentRepository.getCompletedAppointmentsByUserId(userId)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous terminés:", error)
      return {
        success: false,
        error: "Échec de la récupération des rendez-vous terminés"
      }
    }
  }

  static async getAppointmentById(appointmentId: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, message: "Utilisateur non authentifié !" }
      }

      const result = await AppointmentRepository.getAppointmentById(appointmentId)
      
      if (!result) {
        return {
          success: false,
          error: "Rendez-vous non trouvé"
        }
      }
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération du rendez-vous"
      }
    }
  }

  static async updateAppointmentStatus(appointmentId: string, status: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, message: "Utilisateur non authentifié !" }
      }

      // Vérifier que le statut est valide
      if (!["SCHEDULED", "COMPLETED", "CANCELLED"].includes(status)) {
        return {
          success: false,
          error: "Statut invalide"
        }
      }

      const result = await AppointmentRepository.updateAppointmentStatus(appointmentId, status)
      
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la mise à jour du statut du rendez-vous"
      }
    }
  }
} 
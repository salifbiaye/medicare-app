import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AppointmentRequestRepository } from "@/repository/appointment-request.repository"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"
import { NotificationType, RequestStatus, ServiceType } from "@prisma/client"
import { NotificationService } from "./notification.service"

export class AppointmentRequestService {
  static async getSession() {
    const headersValue = await headers()
    return await auth.api.getSession({ headers: headersValue })
  }
  
  static async createAppointmentRequest(data: {
    description: string
    existingRecord: boolean
    patientId: string
    hospitalId: string
    serviceId?: string
    identifiedService?: ServiceType | null
  }) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const request = await AppointmentRequestRepository.createAppointmentRequest(data)
      
      // Créer une notification pour le service concerné
      if (request.serviceId) {
        await NotificationService.createNotification({
          title: "Nouvelle demande de rendez-vous",
          message: `${request.patient.name} a fait une demande de rendez-vous.`,
          type: "WARNING" as NotificationType,
          priority: "MEDIUM",
          category: "ADMINISTRATIVE",
          recipientId: session.user.id,
          actionRequired: true
        })
      }
      
      return {
        success: true,
        data: request
      }
    } catch (error) {
      console.error("Erreur lors de la création de la demande de rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la création de la demande de rendez-vous"
      }
    }
  }

  static async updateAppointmentRequestStatus(patientId: string, status: RequestStatus) {
    const session = await this.getSession()
    if (!session?.user?.id) {
      throw new Error("Non autorisé")
    }

    // Récupérer le doctorId de l'utilisateur connecté
    const doctor = await AppointmentRequestRepository.getDoctorByUserId(session.user.id)
    if (!doctor) {
      throw new Error("Utilisateur non autorisé (doit être un médecin)")
    }

    const result = await AppointmentRequestRepository.updatePatientAppointmentRequestsStatus(
      patientId,
      doctor.id,
      status
    )

    if (!result) {
      throw new Error("Échec de la mise à jour du statut")
    }

    if (status === RequestStatus.COMPLETED) {
      await NotificationService.createNotification({
        recipientId: patientId,
        title: "Demandes de rendez-vous complétées",
        message: "Vos demandes de rendez-vous ont été marquées comme complétées par le médecin.",
        type: "INFO" as NotificationType,
        priority: "MEDIUM",
        category: "ADMINISTRATIVE",
        senderId: session.user.id
      })
    }

    return result
  }

  static async updateMultipleAppointmentRequestsStatus(patientIds: string[], status: RequestStatus) {
    const session = await this.getSession()
    if (!session?.user?.id) {
      throw new Error("Non autorisé")
    }

    // Récupérer le doctorId de l'utilisateur connecté
    const doctor = await AppointmentRequestRepository.getDoctorByUserId(session.user.id)
    if (!doctor) {
      throw new Error("Utilisateur non autorisé (doit être un médecin)")
    }

    const results = await AppointmentRequestRepository.updateMultiplePatientAppointmentRequestsStatus(
      patientIds,
      doctor.id,
      status
    )
    
    if (!results) {
      throw new Error("Échec de la mise à jour des statuts")
    }

    if (status === RequestStatus.COMPLETED) {
      await Promise.all(
        patientIds.map(patientId =>
          NotificationService.createNotification({
            recipientId: patientId,
            title: "Demandes de rendez-vous complétées",
            message: "Vos demandes de rendez-vous ont été marquées comme complétées par le médecin.",
            type: "INFO" as NotificationType,
            priority: "MEDIUM",
            category: "ADMINISTRATIVE",
            senderId: session.user.id
          })
        )
      )
    }

    return results
  }

  static async getAppointmentRequestsWithPagination(params: {
    page: number
    perPage: number
    sort?: string
    search?: string
    filters?: {
      status?: RequestStatus[]
      serviceId?: string
      hospitalId?: string[]
      dateRange?: {
        from?: Date
        to?: Date
      }
    }
  }) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      // Récupérer l'ID de l'utilisateur courant
      const userId = session.user.id

      // Passer l'ID de l'utilisateur au repository pour filtrer les demandes
      const result = await AppointmentRequestRepository.getAppointmentRequestsWithPagination({
        ...params,
        userId
      })

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes de rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération des demandes de rendez-vous"
      }
    }
  }

  static async getRequestStats() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      // Récupérer l'ID de l'utilisateur courant
      const userId = session.user.id

      // Utiliser l'ID de l'utilisateur
      const stats = await AppointmentRequestRepository.getRequestStats(userId)

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques de demandes:", error)
      return {
        success: false,
        error: "Échec de la récupération des statistiques de demandes"
      }
    }
  }
} 
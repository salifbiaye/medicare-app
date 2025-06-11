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
        // Ici, il faudrait idéalement récupérer les secrétaires du service
        // et créer une notification pour chacun d'eux
        // Pour simplifier, nous allons créer une notification pour l'utilisateur connecté
        await NotificationService.createNotification({
          title: "Nouvelle demande de rendez-vous",
          message: `${request.patient.name} a fait une demande de rendez-vous.`,
          type: "WARNING" as NotificationType,
          priority: "MEDIUM",
          category: "ADMINISTRATIVE",
          recipientId: session.user.id, // À remplacer par les IDs des secrétaires du service
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
  
  static async updateAppointmentRequestStatus(requestId: string, status: RequestStatus, data?: {
    doctorId?: string
    note?: string
    serviceId?: string
  }) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const userId = session.user.id;
      const request = await AppointmentRequestRepository.getAppointmentRequestById(requestId);
      
      if (!request) {
        return { success: false, error: "Demande non trouvée" }
      }

      let updatedRequest;
      
      // Si un doctorId spécifique est fourni, utiliser celui-là
      if (data?.doctorId) {
        updatedRequest = await AppointmentRequestRepository.updateStatusWithDoctor(
          requestId, 
          status, 
          data.doctorId
        );
      } 
      // Si un serviceId spécifique est fourni pour un transfert
      else if (status === "TRANSFERRED" && data?.serviceId) {
        updatedRequest = await AppointmentRequestRepository.updateStatusWithTransfer(
          requestId,
          status,
          data.serviceId
        );
      }
      // Sinon, chercher le rôle de l'utilisateur connecté
      else {
        // Vérifier si l'utilisateur est un médecin
        const doctor = await AppointmentRequestRepository.getDoctorByUserId(userId);
        
        if (doctor) {
          updatedRequest = await AppointmentRequestRepository.updateStatusWithDoctor(
            requestId,
            status,
            doctor.id
          );
        } else {
          // Vérifier si l'utilisateur est un secrétaire
          const secretary = await AppointmentRequestRepository.getSecretaryByUserId(userId);
          
          if (secretary) {
            updatedRequest = await AppointmentRequestRepository.updateStatusWithSecretary(
              requestId,
              status,
              secretary.id
            );
          } else {
            return { 
              success: false, 
              error: "Utilisateur non autorisé (ni médecin, ni secrétaire)" 
            };
          }
        }
      }
      
      // Créer une notification pour le patient
      await NotificationService.createNotification({
        title: `Mise à jour de votre demande de rendez-vous`,
        message: this.getStatusUpdateMessage(status, data?.note),
        type: "INFO" as NotificationType,
        priority: "MEDIUM",
        category: "ADMINISTRATIVE",
        recipientId: request.patientId,
        senderId: session.user.id
      })
      
      return {
        success: true,
        data: updatedRequest
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la demande de rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la mise à jour de la demande de rendez-vous"
      }
    }
  }
  
  private static getStatusUpdateMessage(status: RequestStatus, note?: string): string {
    switch (status) {
      case "ACCEPTED":
        return `Votre demande de rendez-vous a été acceptée. ${note ? `Note: ${note}` : ''}`;
      case "REJECTED":
        return `Votre demande de rendez-vous a été rejetée. ${note ? `Raison: ${note}` : ''}`;
      case "TRANSFERRED":
        return `Votre demande de rendez-vous a été transférée à un autre service. ${note ? `Raison: ${note}` : ''}`;
      case "COMPLETED":
        return `Votre rendez-vous a été complété. ${note ? `Note: ${note}` : ''}`;
      default:
        return `Le statut de votre demande de rendez-vous a été mis à jour. ${note ? `Note: ${note}` : ''}`;
    }
  }
  
  static async getAppointmentRequestsWithPagination(params: ParamsSchemaFormValues & { serviceId?: string }) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      // Récupérer l'ID de l'utilisateur courant
      const userId = session.user.id

      // Ajouter le serviceId au filtre si spécifié
      const filters = {...(params.filters || {})} as any;
      if (params.serviceId) {
        filters.serviceId = params.serviceId;
      }

      // Passer l'ID de l'utilisateur au repository pour filtrer les demandes
      const result = await AppointmentRequestRepository.getAppointmentRequestsWithPagination({
        ...params,
        filters,
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

      // Utiliser l'ID de l'utilisateur et éventuellement serviceId
      const stats = await AppointmentRequestRepository.getRequestStats( userId)

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
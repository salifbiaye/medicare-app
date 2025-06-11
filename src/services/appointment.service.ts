import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { AppointmentRepository } from "@/repository/appointment.repository"
import { NotificationType } from "@prisma/client"
import { NotificationService } from "./notification.service"

export class AppointmentService {
  static async getSession() {
    const headersValue = await headers()
    return await auth.api.getSession({ headers: headersValue })
  }

  static async getDoctorAppointments() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointments = await AppointmentRepository.getDoctorAppointmentsByUserId(session.user.id)


      return {
        success: true,
        data: appointments
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération des rendez-vous"
      }
    }
  }

  static async getPatientAppointments(patientId: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointments = await AppointmentRepository.getPatientAppointments(patientId)

      return {
        success: true,
        data: appointments
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération des rendez-vous"
      }
    }
  }

  static async getAppointmentById(appointmentId: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointment = await AppointmentRepository.getAppointmentById(appointmentId)

      if (!appointment) {
        return { success: false, error: "Rendez-vous non trouvé" }
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la récupération du rendez-vous"
      }
    }
  }

  static async getPatients() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const patients = await AppointmentRepository.getPatients()

      return {
        success: true,
        data: patients
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error)
      return {
        success: false,
        error: "Échec de la récupération des patients"
      }
    }
  }

  static async createAppointment(data: {
    patientId: string
    date: string
    status: string
    notes?: string
    id?: string
  }) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      // Si un ID est fourni, c'est une mise à jour
      if (data.id) {
        const appointment = await AppointmentRepository.updateAppointment(data.id, data)
        const patient = await AppointmentRepository.getPatientById(data.patientId)
        
        if (patient) {
          // Notification pour le patient
          await NotificationService.createNotification({
            title: "Rendez-vous modifié",
            message: `Votre rendez-vous a été modifié.`,
            type: "APPOINTMENT" as NotificationType,
            priority: "MEDIUM",
            category: "MEDICAL",
            recipientId: patient.userId,
            senderId: session.user.id
          })
        }

        return {
          success: true,
          data: appointment
        }
      }

      // Sinon, c'est une création
      const doctor = await AppointmentRepository.getDoctorByUserId(session.user.id)
      
      if (!doctor) {
        return { success: false, error: "Docteur non trouvé" }
      }

      const appointment = await AppointmentRepository.createAppointment({
        ...data,
        doctorId: doctor.id
      })

      const patient = await AppointmentRepository.getPatientById(data.patientId)
      
      if (patient) {
        // Notification pour le patient
        await NotificationService.createNotification({
          title: "Nouveau rendez-vous",
          message: `Un nouveau rendez-vous a été créé.`,
          type: "APPOINTMENT" as NotificationType,
          priority: "MEDIUM",
          category: "MEDICAL",
          recipientId: patient.userId,
          senderId: session.user.id
        })
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error("Erreur lors de la création/modification du rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la création/modification du rendez-vous"
      }
    }
  }

  static async deleteAppointment(id: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointment = await AppointmentRepository.deleteAppointment(id)
      const patient = await AppointmentRepository.getPatientById(appointment.patientId)

      if (patient) {
        // Notification pour le patient
        await NotificationService.createNotification({
          title: "Rendez-vous annulé",
          message: `Votre rendez-vous a été annulé.`,
          type: "WARNING" as NotificationType,
          priority: "HIGH",
          category: "MEDICAL",
          recipientId: patient.userId,
          senderId: session.user.id
        })
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous:", error)
      return {
        success: false,
        error: "Échec de la suppression du rendez-vous"
      }
    }
  }

  static async getCompletedAppointments() {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointments = await AppointmentRepository.getCompletedAppointments(session.user.id)

      return {
        success: true,
        data: appointments
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous terminés:", error)
      return {
        success: false,
        error: "Échec de la récupération des rendez-vous terminés"
      }
    }
  }

  static async updateAppointmentStatus(appointmentId: string, status: string) {
    try {
      const session = await this.getSession()

      if (!session?.user) {
        return { success: false, error: "Utilisateur non authentifié" }
      }

      const appointment = await AppointmentRepository.updateAppointmentStatus(appointmentId, status)
      const patient = await AppointmentRepository.getPatientById(appointment.patientId)

      if (patient) {
        // Notification pour le patient
        await NotificationService.createNotification({
          title: "Statut du rendez-vous mis à jour",
          message: `Le statut de votre rendez-vous a été mis à jour à "${status}".`,
          type: "APPOINTMENT" as NotificationType,
          priority: "MEDIUM",
          category: "MEDICAL",
          recipientId: patient.userId,
          senderId: session.user.id
        })
      }

      return {
        success: true,
        data: appointment
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      return {
        success: false,
        error: "Échec de la mise à jour du statut"
      }
    }
  }
} 
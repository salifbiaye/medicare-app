import prisma from "@/lib/prisma"

export class AppointmentRepository {
  static async getDoctorAppointmentsByUserId(userId: string) {
    // D'abord trouver le docteur associé à l'utilisateur
    const doctor = await prisma.doctor.findFirst({
      where: {
        userId: userId
      }
    })

    if (!doctor) {
      return []
    }

    // Récupérer tous les rendez-vous du docteur
    return await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })
  }

  static async getCompletedAppointmentsByUserId(userId: string) {
    // D'abord trouver le docteur associé à l'utilisateur
    const doctor = await prisma.doctor.findFirst({
      where: {
        userId: userId
      }
    })

    if (!doctor) {
      return []
    }

    // Récupérer tous les rendez-vous terminés du docteur
    return await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    })
  }

  static async getAppointmentById(appointmentId: string) {
    return await prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        doctor: {
          include: {
            user: true
          }
        },
        request: true
      }
    })
  }

  static async updateAppointmentStatus(appointmentId: string, status: string) {
    return await prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        status: status
      }
    })
  }
} 
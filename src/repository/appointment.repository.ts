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

  static async getPatientAppointments(patientId: string) {
    return await prisma.appointment.findMany({
      where: {
        patientId,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })
  }

  static async getAppointmentById(id: string) {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async getPatients() {
    return await prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    })
  }

  static async getPatientById(patientId: string) {
    return await prisma.patient.findUnique({
      where: { id: patientId }
    })
  }

  static async createAppointment(data: {
    patientId: string
    date: string
    status: string
    notes?: string
    doctorId: string
  }) {
    return await prisma.appointment.create({
      data: {
        patientId: data.patientId,
        doctorId: data.doctorId,
        date: new Date(data.date),
        status: data.status,
        notes: data.notes,
        duration: 30, // Durée par défaut en minutes
        // Ne pas définir requestId s'il n'y en a pas
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async updateAppointment(id: string, data: {
    patientId: string
    date: string
    status: string
    notes?: string
  }) {
    return await prisma.appointment.update({
      where: { id },
      data: {
        patientId: data.patientId,
        date: new Date(data.date),
        status: data.status,
        notes: data.notes,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async deleteAppointment(id: string) {
    return await prisma.appointment.delete({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async getCompletedAppointments(doctorId: string) {
    return await prisma.appointment.findMany({
      where: {
        doctorId,
        status: "completed",
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })
  }

  static async updateAppointmentStatus(id: string, status: string) {
    return await prisma.appointment.update({
      where: { id },
      data: {
        status,
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async getDoctorByUserId(userId: string) {
    return await prisma.doctor.findFirst({
      where: {
        userId: userId
      }
    })
  }
} 
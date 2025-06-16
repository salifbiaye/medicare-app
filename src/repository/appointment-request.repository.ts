import prisma from "@/lib/prisma"
import { RequestStatus, ServiceType } from "@prisma/client"

export class AppointmentRequestRepository {
  static async createAppointmentRequest(data: {
    description: string
    existingRecord: boolean
    patientId: string
    hospitalId: string
    serviceId?: string
    identifiedService?: ServiceType | null
  }) {
    return await prisma.appointmentRequest.create({
      data: {
        description: data.description,
        existingRecord: data.existingRecord,
        status: "PENDING",
        patientId: data.patientId,
        hospitalId: data.hospitalId,
        serviceId: data.serviceId,
        identifiedService: data.identifiedService,
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async updateAppointmentRequest(id: string, data: {
    status?: RequestStatus
    doctorId?: string
    secretaryId?: string
    note?: string
    serviceId?: string
  }) {
    return await prisma.appointmentRequest.update({
      where: { id },
      data,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
  }

  static async getAppointmentRequestById(id: string) {
    return await prisma.appointmentRequest.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
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
    userId?: string // The ID of the user making the request
  }) {
    const { page, perPage, sort, search, filters, userId } = params;

    // Calculate pagination values
    const skip = (page - 1) * perPage;
    const take = perPage;

    // Get the user information first to determine their role and service
    let userInfo = null;
    if (userId) {
      userInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          secretary: {
            include: {
              service: true,
              hospital: true
            }
          },
          doctor:{
            include:{
              service: true,
              hospital:true
            }
          }
        }
      });
    }

    // Prepare where clause based on filters
    const where: any = {};

    // If the user is a secretary, restrict to their service and hospital
    if (userInfo?.role === 'SECRETARY' && userInfo?.secretary) {
      where.serviceId = userInfo.secretary.serviceId;
      where.hospitalId = userInfo.secretary.hospitalId;
    } else if (userInfo?.role === 'DOCTOR' || userInfo?.role === 'CHIEF_DOCTOR') {
      where.status = 'ACCEPTED';
      where.serviceId = userInfo.doctor?.serviceId;
      where.hospitalId = userInfo.doctor?.hospitalId;
    }
    else {
      // Apply service filter if provided
      if (filters?.serviceId) {
        where.serviceId = filters.serviceId;
      }

      // Apply hospital filter if provided
      if (filters?.hospitalId && filters.hospitalId.length > 0) {
        where.hospitalId = { in: filters.hospitalId };
      }
    }

    // Apply status filter if provided
    if (filters?.status && filters.status.length > 0) {
      where.status = { in: filters.status };
    }




    // Determine sort order
    let orderBy: any = { creationDate: 'desc' };
    if (sort) {
      const [field, direction] = sort.split(':');
      if (field && direction) {
        orderBy = {
          [field]: direction.toLowerCase()
        };
      }
    }

    // Get the appointment requests with pagination
    const [requests, total] = await Promise.all([
      prisma.appointmentRequest.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          hospital: {
            select: {
              id: true,
              name: true
            }
          },
          service: {
            select: {
              id: true,
              type: true,
              name: true
            }
          },
          secretary: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          doctor: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      }),
      prisma.appointmentRequest.count({ where })


    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return {
      data: requests,
      meta: {
        total,
        page,
        perPage,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    };
  }

  static async getRequestStats(userId?: string) {
    let whereClause: any = {};

    // Si userId est fourni, on cherche les demandes associées à l'utilisateur
    if (userId) {
      // Trouver d'abord l'utilisateur et ses rôles
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          secretary: {
            select: {
              id: true,
              hospitalId: true,
              serviceId: true
            }
          },
          doctor: {
            select: {
              id: true,
              hospitalId: true,
              serviceId: true
            }
          }
        }
      });

      if (user) {
        // Si l'utilisateur est secrétaire
        if (user.role === 'SECRETARY' && user.secretary) {
          // Filtrer simplement par serviceId et hospitalId comme dans getAppointmentRequestsWithPagination
          whereClause.serviceId = user.secretary.serviceId;
          whereClause.hospitalId = user.secretary.hospitalId;
        }
        // Si l'utilisateur est médecin
        else if (user.role === 'DOCTOR' && user.doctor) {
          // Filtrer simplement par serviceId, hospitalId et doctorId
          whereClause.serviceId = user.doctor.serviceId;
          whereClause.hospitalId = user.doctor.hospitalId;

          // Pour un médecin, on peut soit filtrer par tous les rendez-vous du service
          // Soit uniquement par ceux qui lui sont assignés, selon votre logique métier
          // Exemple pour tous les rendez-vous du service:
          // whereClause.doctorId = user.doctor.id; // Décommentez pour ne voir que ses propres rendez-vous
        }
      }
    }

    const [
      total,
      pending,
      accepted,
      rejected,
      transferred,
      completed
    ] = await Promise.all([
      prisma.appointmentRequest.count({
        where: whereClause
      }),
      prisma.appointmentRequest.count({
        where: {
          ...whereClause,
          status: "PENDING"
        }
      }),
      prisma.appointmentRequest.count({
        where: {
          ...whereClause,
          status: "ACCEPTED"
        }
      }),
      prisma.appointmentRequest.count({
        where: {
          ...whereClause,
          status: "REJECTED"
        }
      }),
      prisma.appointmentRequest.count({
        where: {
          ...whereClause,
          status: "TRANSFERRED"
        }
      }),
      prisma.appointmentRequest.count({
        where: {
          ...whereClause,
          status: "COMPLETED"
        }
      })
    ]);

    return {
      total,
      pending,
      accepted,
      rejected,
      transferred,
      completed
    };
  }

  static async updateStatusWithDoctor(requestId: string, status: RequestStatus, doctorId: string) {
    return await prisma.appointmentRequest.update({
      where: { id: requestId },
      data: {
        status,
        doctorId,
        modificationDate: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        hospital: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            type: true,
            name: true
          }
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  static async updateStatusWithSecretary(requestId: string, status: RequestStatus, secretaryId: string) {
    return await prisma.appointmentRequest.update({
      where: { id: requestId },
      data: {
        status,
        secretaryId,
        modificationDate: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        hospital: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            type: true,
            name: true
          }
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  static async updateStatusWithTransfer(requestId: string, status: RequestStatus, serviceId: string) {
    return await prisma.appointmentRequest.update({
      where: { id: requestId },
      data: {
        status,
        serviceId,
        modificationDate: new Date()
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        hospital: {
          select: {
            id: true,
            name: true
          }
        },
        service: {
          select: {
            id: true,
            type: true,
            name: true
          }
        },
        secretary: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        doctor: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  static async getDoctorByUserId(userId: string) {
    return await prisma.doctor.findFirst({
      where: { userId },
      select: {
        id: true,
        hospitalId: true,
        serviceId: true
      }
    });
  }

  static async getSecretaryByUserId(userId: string) {
    return await prisma.secretary.findFirst({
      where: { userId },
      select: {
        id: true,
        hospitalId: true,
        serviceId: true
      }
    });
  }

  static async updatePatientAppointmentRequestsStatus(patientId: string, doctorId: string, status: RequestStatus) {
    return await prisma.appointmentRequest.updateMany({
      where: {
        patientId: patientId,
        doctorId: doctorId,
        status: {
          not: "COMPLETED"
        }
      },
      data: {
        status: status
      }
    })
  }
  static async updatePatientAppointmentRequestsSecretaryStatus(requestId: string,  status: RequestStatus) {
    return await prisma.appointmentRequest.updateMany({
         where: {
            id: requestId,
        },
      data: {
        status: status
      }
    })
  }

  static async updateMultiplePatientAppointmentRequestsStatus(patientIds: string[], doctorId: string, status: RequestStatus) {
    return await Promise.all(
      patientIds.map(patientId =>
        prisma.appointmentRequest.updateMany({
          where: {
            patientId: patientId,
            doctorId: doctorId,
            status: {
              not: "COMPLETED"
            }
          },
          data: {
            status: status
          }
        })
      )
    )
  }
} 
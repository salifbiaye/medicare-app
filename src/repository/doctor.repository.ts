import prisma from "@/lib/prisma"
import { CreateDoctorFormValues, DoctorImport } from "@/schemas/user.schema"
import { Role } from "@prisma/client"

export class DoctorRepository {
    static async createDoctor(data: CreateDoctorFormValues) {
        return await prisma.doctor.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        role: data.role,
                        emailVerified: data.emailVerified,
                        profileCompleted: data.profileCompleted,
                    }
                },
                specialty: data.specialty,
                registrationNumber: data.registrationNumber,
                hospital: {
                    connect: {
                        id: data.hospitalId
                    }
                },
                service: {
                    connect: {
                        id: data.serviceId
                    }
                }
            },
            include: {
                user: true,
                hospital: true,
                service: true
            }
        })
    }
    static async getDoctorByUserId(userId: string) {
        return await prisma.doctor.findFirst({
            where: { userId },
            include: {
                user: true,
                hospital: true,
                service: true
            }
        })
    }

    static async getAllDoctors() {
        return await prisma.doctor.findMany({
            include: {
                user: true,
                hospital: true,
                service: true
            }
        })
    }

    static async createManyDoctors(data: DoctorImport[]) {
        return await prisma.$transaction(
            data.map(doctor => 
                prisma.doctor.create({
                    data: {
                        user: {
                            create: {
                                name: doctor.name,
                                email: doctor.email,
                                gender: doctor.gender,
                                role: doctor.role,
                                emailVerified: doctor.emailVerified,
                                profileCompleted: doctor.profileCompleted,
                            }
                        },
                        specialty: doctor.specialty,
                        registrationNumber: doctor.registrationNumber,
                        hospital: {
                            connect: {
                                id: doctor.hospitalId
                            }
                        },
                        service: {
                            connect: {
                                id: doctor.serviceId
                            }
                        }
                    },
                    include: {
                        user: true,
                        hospital: true,
                        service: true
                    }
                })
            )
        )
    }

    static async updateDoctor(userId: string, data: CreateDoctorFormValues) {
        // Trouver le médecin associé à l'utilisateur
        const doctor = await prisma.doctor.findFirst({
            where: { userId }
        });

        if (!doctor) {
            throw new Error("Médecin non trouvé");
        }

        // Mettre à jour l'utilisateur et le médecin en une seule transaction
        return await prisma.$transaction(async (tx) => {
            // Mettre à jour l'utilisateur
             await tx.user.update({
                where: { id: userId },
                data: {
                    name: data.name,
                    email: data.email,
                    gender: data.gender,
                    role: data.role,
                    emailVerified: data.emailVerified,
                    profileCompleted: data.profileCompleted
                }
            });

            // Mettre à jour le médecin
            const updatedDoctor = await tx.doctor.update({
                where: { id: doctor.id },
                data: {
                    specialty: data.specialty,
                    registrationNumber: data.registrationNumber,
                    hospital: {
                        connect: {
                            id: data.hospitalId
                        }
                    },
                    service: {
                        connect: {
                            id: data.serviceId
                        }
                    }
                },
                include: {
                    user: true,
                    hospital: true,
                    service: true
                }
            });

            return updatedDoctor;
        });
    }
    static async findDoctorByUserId(userId:string){
        return await prisma.doctor.findFirst({
            where: { userId },
            include: {
                hospital: true,
                service: true
            }
        })


    }

    static async getSharedDicoms(doctorId: string) {
        return prisma.dicomSharing.findMany({
            where: {
                targetDoctorId: doctorId,
                isActive: true
            },
            include: {
                dicomImage: true,
                sourceDoctor: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                sharingDate: 'desc'
            }
        })
    }
}
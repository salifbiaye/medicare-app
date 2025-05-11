import prisma from "@/lib/prisma"
import { CreateDoctorFormValues, DoctorImport } from "@/schemas/user.schema"

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
                isChief: data.isChief || false,
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
                        isChief: doctor.isChief || false,
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
}
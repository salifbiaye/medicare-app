import prisma from "@/lib/prisma"
import { CreateDirectorFormValues, DirectorImport } from "@/schemas/user.schema"

export class DirectorRepository {
    static async createDirector(data: CreateDirectorFormValues) {
        return await prisma.director.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        role: "DIRECTOR",
                        emailVerified: data.emailVerified,
                        profileCompleted: data.profileCompleted,
                    }
                },
                hospital: {
                    connect: {
                        id: data.hospitalId
                    }
                }
            },
            include: {
                user: true,
                hospital: true
            }
        })
    }

    static async getAllDirectors() {
        return await prisma.director.findMany({
            include: {
                user: true,
                hospital: true
            }
        })
    }

    static async createManyDirectors(data: DirectorImport[]) {
        return await prisma.$transaction(
            data.map(director => 
                prisma.director.create({
                    data: {
                        user: {
                            create: {
                                name: director.name,
                                email: director.email,
                                gender: director.gender,
                                role: "DIRECTOR",
                                emailVerified: director.emailVerified,
                                profileCompleted: director.profileCompleted,
                            }
                        },
                        hospital: {
                            connect: {
                                id: director.hospitalId
                            }
                        }
                    },
                    include: {
                        user: true,
                        hospital: true
                    }
                })
            )
        )
    }
} 
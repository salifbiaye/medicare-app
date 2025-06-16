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

    static async findDirector(userId: string) {
        return await prisma.director.findFirst({
            where: { userId: userId },
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

    static async updateDirector(userId: string, data: CreateDirectorFormValues) {
        // Trouver le directeur associé à l'utilisateur
        const director = await prisma.director.findFirst({
            where: { userId }
        });

        if (!director) {
            throw new Error("Directeur non trouvé");
        }

        // Mettre à jour l'utilisateur et le directeur en une seule transaction
        return await prisma.$transaction(async (tx) => {
            // Mettre à jour l'utilisateur
            await tx.user.update({
                where: { id: userId },
                data: {
                    name: data.name,
                    email: data.email,
                    gender: data.gender,
                    emailVerified: data.emailVerified,
                    profileCompleted: data.profileCompleted
                }
            });

            // Mettre à jour le directeur
            const updatedDirector = await tx.director.update({
                where: { id: director.id },
                data: {
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
            });

            return updatedDirector;
        });
    }
} 
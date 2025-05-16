import prisma from "@/lib/prisma"
import { CreateSecretaryFormValues, SecretaryImport } from "@/schemas/user.schema"

export class SecretaryRepository {
    static async createSecretary(data: CreateSecretaryFormValues) {
        return await prisma.secretary.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        role: "SECRETARY",
                        emailVerified: data.emailVerified,
                        profileCompleted: data.profileCompleted,
                    }
                },
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

    static async getAllSecretaries() {
        return await prisma.secretary.findMany({
            include: {
                user: true,
                hospital: true,
                service: true
            }
        })
    }

    static async createManySecretaries(data: SecretaryImport[]) {
        return await prisma.$transaction(
            data.map(secretary => 
                prisma.secretary.create({
                    data: {
                        user: {
                            create: {
                                name: secretary.name,
                                email: secretary.email,
                                gender: secretary.gender,
                                role: "SECRETARY",
                                emailVerified: secretary.emailVerified,
                                profileCompleted: secretary.profileCompleted,
                            }
                        },
                        hospital: {
                            connect: {
                                id: secretary.hospitalId
                            }
                        },
                        service: {
                            connect: {
                                id: secretary.serviceId
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
    
    static async updateSecretary(userId: string, data: CreateSecretaryFormValues) {
        // Trouver la secrétaire associée à l'utilisateur
        const secretary = await prisma.secretary.findFirst({
            where: { userId }
        });

        if (!secretary) {
            throw new Error("Secrétaire non trouvée");
        }

        // Mettre à jour l'utilisateur et la secrétaire en une seule transaction
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

            // Mettre à jour la secrétaire
            const updatedSecretary = await tx.secretary.update({
                where: { id: secretary.id },
                data: {
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

            return updatedSecretary;
        });
    }
    static async findSecretaryByUserId(userId:string){
        return await prisma.secretary.findFirst({
                where: { userId },
                include: {
                    hospital: true,
                    service: true
                }
            })


    }

} 
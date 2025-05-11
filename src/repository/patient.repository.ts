import prisma from "@/lib/prisma"
import { CreatePatientFormValues, PatientImport } from "@/schemas/user.schema"

export class PatientRepository {
    static async createPatient(data: CreatePatientFormValues) {
        return await prisma.patient.create({
            data: {
                user: {
                    create: {
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        role: "PATIENT",
                        emailVerified: data.emailVerified,
                        profileCompleted: data.profileCompleted,
                    }
                },
                socialSecurityNumber: data.socialSecurityNumber,
                bloodGroup: data.bloodGroup,
                allergies: data.allergies,
            },
            include: {
                user: true
            }
        })
    }

    static async getAllPatients() {
        return await prisma.patient.findMany({
            include: {
                user: true
            }
        })
    }

    static async createManyPatients(data: PatientImport[]) {
        return await prisma.$transaction(
            data.map(patient => 
                prisma.patient.create({
                    data: {
                        user: {
                            create: {
                                name: patient.name,
                                email: patient.email,
                                gender: patient.gender,
                                role: "PATIENT",
                                emailVerified: patient.emailVerified,
                                profileCompleted: patient.profileCompleted,
                            }
                        },
                        socialSecurityNumber: patient.socialSecurityNumber,
                        bloodGroup: patient.bloodGroup,
                        allergies: patient.allergies,
                    },
                    include: {
                        user: true
                    }
                })
            )
        )
    }
} 
import prisma from "@/lib/prisma"
import { CreatePatientFormValues, PatientImport } from "@/schemas/user.schema"
import { CreateMedicalRecordFormValues } from "@/schemas/medical-record.schema"
import { 
  CreateMedicalReportFormValues, 
  CreatePrescriptionFormValues, 
  CreateDicomImageFormValues 
} from "@/schemas/medical-document.schema"
import { Prisma } from "@prisma/client"

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


    static async updatePatient(userId: string, data: CreatePatientFormValues) {
        return await prisma.patient.update({
            where: {
                userId: userId
            },
            data: {
                socialSecurityNumber: data.socialSecurityNumber,
                bloodGroup: data.bloodGroup,
                allergies: data.allergies,
                user: {
                    update: {
                        name: data.name,
                        email: data.email,
                        gender: data.gender,
                        emailVerified: data.emailVerified,
                        profileCompleted: data.profileCompleted,
                    }
                }
            },
            include: {
                user: true
            }
        })
    }

    static async getPatientWithUserById(patientId: string) {
        return await prisma.patient.findUnique({
            where: {
                id: patientId
            },
            include: {
                user: true,
                medicalRecord: true
            }
        })
    }

    static async getMedicalRecordById(recordId: string) {
        return await prisma.medicalRecord.findUnique({
            where: {
                id: recordId
            }
        })
    }

    static async getPatientsWithPagination({ page = 1, perPage = 10, sort, search, filters }: { 
        page: number; 
        perPage: number; 
        sort?: string; 
        search?: string;
        filters?: Record<string, string[]>;
    }) {
        // Construire les options de tri
        const orderBy: Prisma.PatientOrderByWithRelationInput[] = []
        
        if (sort) {
            const [field, direction] = sort.split('.')
            const isDesc = direction === 'desc'
            
            // Vérifier si le champ de tri appartient à user
            if (field.startsWith('user.')) {
                const userField = field.replace('user.', '')
                orderBy.push({
                    user: {
                        [userField]: isDesc ? 'desc' : 'asc'
                    }
                })
            } else {
                orderBy.push({
                    [field]: isDesc ? 'desc' : 'asc'
                })
            }
        } else {
            // Tri par défaut
            orderBy.push({
                user: {
                    name: 'asc'
                }
            })
        }

        // Construire les options de filtrage
        const where: Prisma.PatientWhereInput = {}
        
        // Recherche textuelle
        if (search) {
            where.OR = [
                {
                    user: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    user: {
                        email: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    socialSecurityNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }

        // Filtres additionnels
        if (filters) {
            Object.entries(filters).forEach(([key, values]) => {
                if (values.length === 0) return

                if (key.startsWith('user.')) {
                    const userField = key.replace('user.', '')
                    where.user = {
                        ...where.user,
                        [userField]: {
                            in: values
                        }
                    }
                } else {
                    // Utiliser des valeurs connues pour les champs qui existent réellement dans le modèle Patient
                    if (key === 'socialSecurityNumber') {
                        where.socialSecurityNumber = {
                            in: values
                        }
                    } else if (key === 'bloodGroup') {
                        where.bloodGroup = {
                            in: values
                        }
                    } else if (key === 'allergies') {
                        where.allergies = {
                            in: values
                        }
                    }
                    // Il faudrait ajouter tous les autres champs possibles du modèle Patient
                }
            })
        }

        // Exécuter la requête avec pagination
        const [patients, totalPatients] = await Promise.all([
            prisma.patient.findMany({
                where,
                orderBy,
                skip: (page - 1) * perPage,
                take: perPage,
                include: {
                    user: true,
                    medicalRecord: true
                }
            }),
            prisma.patient.count({ where })
        ])

        return {
            patients,
            totalPatients
        }
    }

    static async deletePatient(patientId: string) {
        return await prisma.patient.delete({
            where: {
                id: patientId
            },
            include: {
                user: true
            }
        })
    }

    static async createMedicalRecord(data: CreateMedicalRecordFormValues) {
        return await prisma.medicalRecord.create({
            data: {
                patientId: data.patientId as string,
                phoneNumber: data.phoneNumber,
            }
        })
    }

    static async createMedicalReport(userId:string,data: CreateMedicalReportFormValues) {
        const { appointmentId, content, diagnosis, recommendations, medicalRecordId, patientId } = data
        
        // Get the doctor ID from the current session (this would be implemented in a real app)
        const doctor = await prisma.doctor.findFirst({
            where: {
                userId: userId
            },
        });
        console.log("quoi de neuf docteur !!!! ",doctor)
        if (!doctor){
            return {success:false,message:"ce docteur n'existe pas"}
        }
        const doctorId = doctor.id
        return await prisma.medicalReport.create({
            data: {
                appointment:{connect:{id:appointmentId}},
                content,
                diagnosis,
                recommendations,
                medicalRecord: { connect: { id: medicalRecordId } },
                doctor:{ connect: { id: doctorId } }
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                },
                appointment: true
            }
        })
    }

    static async createPrescription(userId:string,data: CreatePrescriptionFormValues) {
        const { content, startDate, endDate, status, medicalRecordId } = data

        const doctor = await prisma.doctor.findFirst({
            where: {
                userId: userId
            },
        });

        if (!doctor){
            return {success:false,message:"ce docteur n'existe pas"}
        }
        const doctorId = doctor.id
        const existingpatient = await prisma.patient.findFirst({
            where:{
                id:data.patientId
            }
        })
        return await prisma.prescription.create({
            data: {
                content,
                startDate:new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                status,
                medicalRecordId: medicalRecordId as string,
                doctorId,
                patientId:existingpatient?.id || ""
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                }
            }
        })
    }

    static async createDicomImage(data: CreateDicomImageFormValues) {
        const { orthanc_id, type, description, medicalRecordId } = data
        
        return await prisma.dicomImage.create({
            data: {
                orthanc_id,
                type,
                description,
                medicalRecordId: medicalRecordId as string,
                uploadDate: new Date()
            }
        })
    }

    static async getMedicalReportsByMedicalRecordId(medicalRecordId: string) {
        return await prisma.medicalReport.findMany({
            where: {
                medicalRecordId
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                },
                appointment: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    static async getPrescriptionsByMedicalRecordId(medicalRecordId: string) {
        return await prisma.prescription.findMany({
            where: {
                medicalRecordId
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    static async getDicomImagesByMedicalRecordId(medicalRecordId: string) {
        return await prisma.dicomImage.findMany({
            where: {
                medicalRecordId
            },
            orderBy: {
                uploadDate: 'desc'
            }
        })
    }

    static async getMedicalReportById(reportId: string) {
        return await prisma.medicalReport.findUnique({
            where: {
                id: reportId
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                },
                appointment: {
                    include: {
                        patient: {
                            include: {
                                user: true
                            }
                        }
                    }
                },
                medicalRecord: true
            }
        })
    }

    static async getPrescriptionById(prescriptionId: string) {
        return await prisma.prescription.findUnique({
            where: {
                id: prescriptionId
            },
            include: {
                doctor: {
                    include: {
                        user: true
                    }
                },
                patient: {
                    include: {
                        user: true
                    }
                },
                medicalRecord: true
            }
        })
    }
} 
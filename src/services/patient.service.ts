import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import {CreatePatientFormValues, PatientImport} from "@/schemas/user.schema"
import { PatientRepository } from "@/repository/patient.repository"
import { ParamsSchemaFormValues } from "@/schemas/index.schema"
import { CreateMedicalRecordFormValues } from "@/schemas/medical-record.schema"
import { 
  CreateMedicalReportFormValues, 
  CreatePrescriptionFormValues, 
  CreateDicomImageFormValues 
} from "@/schemas/medical-document.schema"
import { PatientOnboardingFormValues } from "@/schemas/patient-onboarding.schema"

export class PatientService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async createPatient(data: CreatePatientFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.createPatient(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du patient:", error)
            return {
                success: false,
                error: "Échec de la création du patient"
            }
        }
    }
    static async importPatients(data: PatientImport[]) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const existingUsers = await PatientRepository.getAllPatients()
            const existingEmails = existingUsers.map(user => user.user.email)
            const existingEmailSet = new Set(existingEmails)
            const newPatients = data.filter(secretary => !existingEmailSet.has(secretary.email))

            if (newPatients.length !== data.length) {
                const existingCount = data.length - newPatients.length
                const plural = existingCount > 1 ? 's' : ''

                if (newPatients.length === 0) {
                    return {
                        success: false,
                        message: `Toutes les secrétaires existent déjà !`
                    }
                }

                return {
                    success: "partial" as const,
                    message: `${existingCount} secrétaire${plural} existe${plural} déjà, création des autres en cours...`,
                    data: {
                        total: data.length,
                        existing: existingCount,
                        toCreate: newPatients.length
                    }
                }
            }

            const result = await PatientRepository.createManyPatients(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de l'import des secrétaires:", error)
            return {
                success: false,
                error: "Échec de l'import des secrétaires"
            }
        }
    }

    static async createPatientForExistingUser(data: PatientOnboardingFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const userId = session.user.id

            const existingPatient = await PatientRepository.getPatientByUserId(userId)
            if (existingPatient) {
                return {
                    success: false,
                    error: "Un profil patient existe déjà pour cet utilisateur"
                }
            }

            const result = await PatientRepository.createPatientForExistingUser(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du profil patient:", error)
            return {
                success: false,
                error: "Échec de la création du profil patient"
            }
        }
    }

    static async updatePatient(userId: string, data: CreatePatientFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.updatePatient(userId, data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du patient:", error)
            return {
                success: false,
                error: "Échec de la mise à jour du patient"
            }
        }
    }

    static async getPatientsWithPagination(params: ParamsSchemaFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const { page, perPage, sort, search, filters } = params
            const result = await PatientRepository.getPatientsWithPagination({
                page,
                perPage,
                sort,
                search,
                filters
            })

            return {
                success: true,
                data: {
                    patients: result.patients,
                    totalPatients: result.totalPatients
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des patients:", error)
            return {
                success: false,
                error: "Échec de la récupération des patients"
            }
        }
    }
    static async getPatientsDoctorWithPagination(params: ParamsSchemaFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            // Obtenir l'ID du docteur à partir de l'ID de l'utilisateur via le repository
            const doctor = await PatientRepository.getDoctorByUserId(session.user.id)

            if (!doctor) {
                return { success: false, message: "Docteur non trouvé !" }
            }

            const { page, perPage, sort, search, filters } = params
            const result = await PatientRepository.getPatientsAppointmentsRequestWithPagination({
                page,
                perPage,
                sort,
                search,
                filters,
                doctorId: doctor.id
            })

            return {
                success: true,
                data: {
                    patients: result.patients,
                    totalPatients: result.totalPatients
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des patients:", error)
            return {
                success: false,
                error: "Échec de la récupération des patients"
            }
        }
    }

    static async deletePatient(patientId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.deletePatient(patientId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du patient:", error)
            return {
                success: false,
                error: "Échec de la suppression du patient"
            }
        }
    }

    static async createMedicalRecord(data: CreateMedicalRecordFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            if (!data.patientId) {
                return { success: false, error: "ID du patient manquant" }
            }

            const result = await PatientRepository.createMedicalRecord(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du dossier médical:", error)
            return {
                success: false,
                error: "Échec de la création du dossier médical"
            }
        }
    }

    static async createMedicalReport(data: CreateMedicalReportFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            if (!data.medicalRecordId) {
                return { success: false, error: "ID du dossier médical manquant" }
            }

            const result = await PatientRepository.createMedicalReport(session.user.id,data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création du rapport médical:", error)
            return {
                success: false,
                error: "Échec de la création du rapport médical"
            }
        }
    }

    static async createPrescription(data: CreatePrescriptionFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            if (!data.medicalRecordId) {
                return { success: false, error: "ID du dossier médical manquant" }
            }

            const result = await PatientRepository.createPrescription(session.user.id,data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la création de la prescription:", error)
            return {
                success: false,
                error: "Échec de la création de la prescription"
            }
        }
    }

    static async createDicomImage(data: CreateDicomImageFormValues) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            if (!data.medicalRecordId) {
                return { success: false, error: "ID du dossier médical manquant" }
            }

            const result = await PatientRepository.createDicomImage(data)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'image DICOM:", error)
            return {
                success: false,
                error: "Échec de l'ajout de l'image DICOM"
            }
        }
    }

    static async getMedicalReportsByMedicalRecordId(medicalRecordId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.getMedicalReportsByMedicalRecordId(medicalRecordId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des rapports médicaux:", error)
            return {
                success: false,
                error: "Échec de la récupération des rapports médicaux"
            }
        }
    }

    static async getPrescriptionsByMedicalRecordId(medicalRecordId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.getPrescriptionsByMedicalRecordId(medicalRecordId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des prescriptions:", error)
            return {
                success: false,
                error: "Échec de la récupération des prescriptions"
            }
        }
    }

    static async getDicomImagesByMedicalRecordId(medicalRecordId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.getDicomImagesByMedicalRecordId(medicalRecordId)
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des images DICOM:", error)
            return {
                success: false,
                error: "Échec de la récupération des images DICOM"
            }
        }
    }

    static async getMedicalReportById(reportId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.getMedicalReportById(reportId)
            
            if (!result) {
                return {
                    success: false,
                    error: "Rapport médical non trouvé"
                }
            }
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du rapport médical:", error)
            return {
                success: false,
                error: "Échec de la récupération du rapport médical"
            }
        }
    }

    static async getPrescriptionById(prescriptionId: string) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return { success: false, message: "Utilisateur non authentifié !" }
            }

            const result = await PatientRepository.getPrescriptionById(prescriptionId)
            
            if (!result) {
                return {
                    success: false,
                    error: "Prescription non trouvée"
                }
            }
            
            return {
                success: true,
                data: result
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la prescription:", error)
            return {
                success: false,
                error: "Échec de la récupération de la prescription"
            }
        }
    }
} 
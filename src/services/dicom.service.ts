import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { DicomRepository } from "@/repository/dicom.repository"
import { DoctorRepository } from "@/repository/doctor.repository"
import { UserRepository } from "@/repository/user.repository"
import { Role } from "@prisma/client"

export class DicomService {
    static async getSession() {
        const headersValue = await headers()
        return await auth.api.getSession({ headers: headersValue })
    }

    static async shareDicom(data: {
        dicomId: string
        doctorEmail: string
    }) {
        try {
            const session = await this.getSession()

            if (!session?.user) {
                return {
                    success: false,
                    error: "Non autorisé"
                }
            }

            // Vérifier que l'utilisateur actuel est un médecin
            const sourceDoctor = await DoctorRepository.findDoctorByUserId(session.user.id)
            if (!sourceDoctor) {
                return {
                    success: false,
                    error: "Seuls les médecins peuvent partager des images DICOM"
                }
            }

            // Vérifier que l'email correspond à un médecin
            const targetUser = await UserRepository.getUserByEmail(data.doctorEmail)
            if (!targetUser) {
                return {
                    success: false,
                    error: "Aucun utilisateur trouvé avec cet email"
                }
            }

            if (targetUser.role !== Role.DOCTOR) {
                return {
                    success: false,
                    error: "L'utilisateur n'est pas un médecin"
                }
            }

            const targetDoctor = await DoctorRepository.findDoctorByUserId(targetUser.id)
            if (!targetDoctor) {
                return {
                    success: false,
                    error: "Médecin cible non trouvé"
                }
            }

            // Vérifier que l'image DICOM existe
            const dicomImage = await DicomRepository.findDicomById(data.dicomId)
            if (!dicomImage) {
                return {
                    success: false,
                    error: "Image DICOM non trouvée"
                }
            }

            // Créer le partage
            const sharing = await DicomRepository.createDicomSharing({
                dicomImageId: data.dicomId,
                sourceDoctorId: sourceDoctor.id,
                targetDoctorId: targetDoctor.id
            })

            // Créer une notification pour le médecin cible
            await DicomRepository.createNotification({
                title: "Nouvelle image DICOM partagée",
                message: `Le Dr. ${session.user.name} a partagé une image DICOM avec vous.`,
                type: "DOCUMENT",
                category: "MEDICAL",
                priority: "MEDIUM",
                senderId: session.user.id,
                recipientId: targetUser.id
            })

            return {
                success: true,
                data: sharing
            }
        } catch (error) {
            console.error("Erreur lors du partage du DICOM:", error)
            return {
                success: false,
                error: "Une erreur est survenue lors du partage"
            }
        }
    }
} 
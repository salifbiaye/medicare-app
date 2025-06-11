import { DoctorRepository } from "@/repository/doctor.repository"
import { DicomRepository } from "@/repository/dicom.repository"

export class OrthancConfig {
  static async getOrthancUrl(userId?: string, dicomId?: string) {
    try {
      // Si un ID DICOM est fourni, utiliser son URL spécifique
      if (dicomId) {
        const dicom = await DicomRepository.findDicomByOrthancId(dicomId)
        if (dicom?.orthanc_url) {
          return dicom.orthanc_url
        }
      }

      // Si un ID utilisateur est fourni, utiliser l'URL de l'hôpital du médecin
      if (userId) {
        const doctor = await DoctorRepository.findDoctorByUserId(userId)
        if (doctor?.hospital?.urlOrthanc) {

          return doctor.hospital.urlOrthanc
        }
      }

      // URL par défaut si aucune URL spécifique n'est trouvée
      return process.env.NEXT_PUBLIC_ORTHANC_URL || 'http://localhost:8042'
    } catch (error) {
      console.error("Erreur lors de la récupération de l'URL Orthanc:", error)
      return process.env.NEXT_PUBLIC_ORTHANC_URL || 'http://localhost:8042'
    }
  }
} 
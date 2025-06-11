import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { PatientRepository } from "@/repository/patient.repository"

export const metadata: Metadata = {
  title: "Ajouter un document médical",
  description: "Ajoutez un document au dossier médical du patient",
}

interface EditMedicalRecordPageProps {
  params: {
    id: string
  }
  searchParams: {
    type?: "medicalreport" | "prescription" | "dicomimage"
  }
}

export default async function EditMedicalRecordPage({ 
  params, 
  searchParams 
}: EditMedicalRecordPageProps) {
  const { id } = params
  const { type } = searchParams

  // Validate document type
  if (!type || !["medicalreport", "prescription", "dicomimage"].includes(type)) {
    redirect(`/doctor/patients/${id}`)
  }
  
  // Get patient information with medical record
  const patient = await PatientRepository.getPatientWithUserById(id)
  
  if (!patient) {
    notFound()
  }
  
  // Check if the patient has a medical record
  if (!patient.medicalRecord) {
    // If they don't, redirect to create one
    redirect(`/doctor/patients/new?patientId=${id}`)
  }

  // Get medical record details
  const medicalRecord = await PatientRepository.getMedicalRecordById(patient.medicalRecord.id)
  
  if (!medicalRecord) {
    notFound()
  }
  
  return (
    <AddMedicalDocumentPage
      patient={patient}
      medicalRecord={medicalRecord}
      documentType={type}
      patientId={id}
    />
  )
} 
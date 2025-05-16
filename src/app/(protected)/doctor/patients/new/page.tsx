import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import CreateMedicalRecordPage from "@/features/doctor/patients/create-medical-record"
import { PatientRepository } from "@/repository/patient.repository"

export const metadata: Metadata = {
  title: "Nouveau dossier médical",
  description: "Créez un nouveau dossier médical pour un patient",
}

interface CreateMedicalRecordPageProps {
  searchParams: {
    patientId?: string
  }
}

export default async function NewMedicalRecordPage({ searchParams }: CreateMedicalRecordPageProps) {
  const { patientId } = searchParams
  
  // If no patientId is provided, redirect to the patients list
  if (!patientId) {
    redirect("/doctor/patients")
  }
  
  // Get patient information
  const patient = await PatientRepository.getPatientWithUserById(patientId)
  
  if (!patient) {
    notFound()
  }
  
  // Check if the patient already has a medical record
  if (patient.medicalRecord) {
    // If they do, redirect to the medical record page
    redirect(`/doctor/patients/${patientId}`)
  }
  
  return (
    <div className="py-10">
      <CreateMedicalRecordPage patient={patient} />
    </div>
  )
} 
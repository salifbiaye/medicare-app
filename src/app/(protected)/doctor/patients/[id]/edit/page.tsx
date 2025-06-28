import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { PatientRepository } from "@/repository/patient.repository"
import AddMedicalDocumentPage from "@/features/doctor/patients/add-medical-document"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
  // Attendre les paramètres dynamiques
  const { id } = await params
  const { type } = await searchParams

  // Validate document type
  if (!type || !["medicalreport", "prescription", "dicomimage"].includes(type)) {
    redirect(`/doctor/patients/${id}`)
  }

  // Get the current session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the doctor and their hospital
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.user.id },
    include: { hospital: true }
  });

  if (!doctor || !doctor.hospital) {
    notFound();
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
      orthancUrl={doctor.hospital.urlOrthanc}
    />
  )
} 
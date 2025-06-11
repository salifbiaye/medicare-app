import React from 'react'
import { notFound } from 'next/navigation'
import { HospitalService } from '@/services/hospital.service'
import { AppointmentRequestForm } from '@/features/patient/appointment-request-form'
import { SessionService } from '@/services/session.service'
import { PatientRepository } from '@/repository/patient.repository'

interface HospitalRequestPageProps {
  params: {
    id: string
  }
}

export default async function HospitalRequestPage({ params }: HospitalRequestPageProps) {
    const param = await params
  const { id } = param

  // Récupérer les détails de l'hôpital
  const hospital = await HospitalService.getHospitalById(id)

  if (!hospital.success || !hospital.data) {
    notFound()
  }

  // Récupérer l'utilisateur connecté
  const session = await SessionService.getSession()
  
  if (!session?.user) {
    return <div>Vous devez être connecté pour effectuer cette action</div>
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <AppointmentRequestForm 
        hospitalId={hospital.data.id} 
        hospitalName={hospital.data.name}
        patientId={session.user.id}
      />
    </div>
  )
} 
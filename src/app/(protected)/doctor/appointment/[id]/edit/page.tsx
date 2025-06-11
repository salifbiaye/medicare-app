import AppointmentEdit from "@/features/doctor/appointment-edit"
import { getAppointmentByIdAction, getPatientsAction } from "@/actions/appointment.action"

type AppointmentStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED"

export default async function EditAppointmentPage({ params }: { params: { id: string } }) {
  const param = await params
  const [appointmentResult, patientsResult] = await Promise.all([
    getAppointmentByIdAction(param.id),
    getPatientsAction()
  ])

  if (!appointmentResult.success || !patientsResult.success || !appointmentResult.data || !patientsResult.data) {
    throw new Error("Failed to load appointment data")
  }

  const appointment = {
    patientId: appointmentResult.data.patient.id,
    date: appointmentResult.data.date,
    status: appointmentResult.data.status as AppointmentStatus,
    notes: appointmentResult.data.notes || undefined
  }

  const patients = patientsResult.data.map(patient => ({
    id: patient.id,
    user: {
      name: patient.user.name
    }
  }))

  return (
    <AppointmentEdit 
      id={param.id}
      appointment={appointment}
      patients={patients}
    />
  )
}

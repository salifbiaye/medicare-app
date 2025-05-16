import { notFound } from "next/navigation"
import { ServiceRepository } from "@/repository/service.repository"
import EditServicePage from "@/features/director/services/edit-service"

interface ServiceEditPageProps {
  params: {
    id: string
  }
}

export default async function ServiceEditPage({ params }: ServiceEditPageProps) {
  const service = await ServiceRepository.getServiceById(params.id)

  if (!service) {
    notFound()
  }

  // Fetch the hospital name for display purposes
  const hospital = await ServiceRepository.getHospitalById(service.hospitalId)
  const hospitalName = hospital?.name || "Hôpital inconnu"

  return (
    <div className="py-10">
      <EditServicePage service={service} hospitalName={hospitalName} />
    </div>
  )
} 
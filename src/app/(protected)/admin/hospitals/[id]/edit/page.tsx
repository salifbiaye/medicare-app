import { notFound } from "next/navigation"
import { HospitalRepository } from "@/repository/hospital.repository"
import EditHospitalPage from "@/features/admin/hospitals/edit-hospital"

interface HospitalEditPageProps {
  params: {
    id: string
  }
}

export default async function HospitalEditPage({ params }: HospitalEditPageProps) {
  const hospital = await HospitalRepository.getHospitalById(params.id)

  if (!hospital) {
    notFound()
  }

  return (
    <div className=" py-10">
      <EditHospitalPage hospital={hospital} />
    </div>
  )
} 
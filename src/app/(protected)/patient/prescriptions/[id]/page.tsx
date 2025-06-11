import { notFound } from "next/navigation"
import { getPrescriptionByIdAction } from "@/actions/patient.action"
import { PrescriptionDetail } from "@/features/patient/prescriptions/prescription-detail"

interface PrescriptionPageProps {
  params: {
    id: string
  }
}

export default async function PrescriptionPage({ params }: PrescriptionPageProps) {
  const param = await params
  const result = await getPrescriptionByIdAction(param.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const prescription = result.data

  return (
    <div className="py-6 px-4">
      <PrescriptionDetail prescription={prescription} />
    </div>
  )
} 
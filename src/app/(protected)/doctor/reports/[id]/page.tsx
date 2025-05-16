import { notFound } from "next/navigation"
import { getMedicalReportByIdAction } from "@/actions/patient.action"
import MedicalReportDetail from "@/features/doctor/reports/medical-report-detail"

interface MedicalReportPageProps {
  params: {
    id: string
  }
}

export default async function MedicalReportPage({ params }: MedicalReportPageProps) {
  const param = await params
  const result = await getMedicalReportByIdAction(param.id)

  if (!result.success || !result.data) {
    notFound()
  }

  const report = result.data

  return (
    <div className="py-6 px-4">
      <MedicalReportDetail report={report} />
    </div>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, User, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getMedicalReportsByMedicalRecordIdAction } from "@/actions/patient.action"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toastAlert } from "@/components/ui/sonner-v2"

interface MedicalReport {
  id: string
  content: string
  diagnosis: string | null
  recommendations: string | null
  createdAt: Date
  doctor: {
    user: {
      name: string
    }
  }
  appointment: {
    date: Date
  }
}

export function MedicalReportsList({ medicalRecordId }: { medicalRecordId: string }) {
  const [reports, setReports] = useState<MedicalReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedicalReports = async () => {
      try {
        setIsLoading(true)
        const response = await getMedicalReportsByMedicalRecordIdAction(medicalRecordId)
        if (response.success) {
          setReports(response.data)
        } else {
          toastAlert.error({
            title: "Erreur",
            description: "Impossible de récupérer les rapports médicaux",
          })
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des rapports médicaux:", error)
        toastAlert.error({
          title: "Erreur",
          description: "Une erreur s'est produite lors de la récupération des rapports médicaux",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicalReports()
  }, [medicalRecordId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loader"></div>
      </div>
    )
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Aucun rapport médical</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Ce patient n'a pas encore de rapports médicaux enregistrés.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Rapports médicaux ({reports.length})</h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center text-base">
                    <FileText className="mr-2 h-4 w-4 text-primary" />
                    Rapport du {format(new Date(report.createdAt), "d MMMM yyyy", { locale: fr })}
                  </CardTitle>
                  <CardDescription className="mt-1.5">
                    <div className="flex items-center text-xs">
                      <Calendar className="mr-1 h-3.5 w-3.5" />
                      Consultation du{" "}
                      {format(new Date(report.appointment.date), "d MMMM yyyy à HH:mm", { locale: fr })}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      <User className="mr-1 h-3.5 w-3.5" />
                      Dr. {report.doctor.user.name}
                    </div>
                  </CardDescription>
                </div>
                <Link href={`/doctor/reports/${report.id}`} passHref>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {report.diagnosis && (
                <div className="mb-3">
                  <Badge variant="outline" className="mb-1">Diagnostic</Badge>
                  <p className="text-sm line-clamp-2">{report.diagnosis}</p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-sm text-muted-foreground line-clamp-3">{report.content}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 